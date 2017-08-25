/* eslint-env node */
const path = require('path');
const gulp = require('gulp');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const through2 = require('through2');
const Buffer = require('buffer').Buffer;
const hasOwn = Object.hasOwnProperty;

const {
  logCannotFindWrapperFile,
  logCannotFindSmashFiles,
  logConfigParseError
} = require('./logging');

const {
  FILE_WRAPPERS,
  GULP_SRC_FILE_EXP,
  GULP_SRC_GLOBAL_FILE_EXP
} = require('./constants');

function getWrapperFile (config = {}) {
  const wrap = config.output.wrap;
  if (wrap && hasOwn.call(FILE_WRAPPERS, wrap)) {
    return FILE_WRAPPERS[wrap];
  }
  return wrap;
}

//const referenceDependencies = getReferenceDependencies(config);
//const requireDependencies = getRequireDependencies(config);
//.replace('\'{{references}}\'', referenceDependencies)
//.replace('\'{{requires}}\'', requireDependencies)

function getConfigFile (cb) {
  return through2.obj((file, enc, closeStream) => {
    try {
      const contents = file.contents.toString();
      const config = JSON.parse(contents);
      cb(config, closeStream);
    }
    catch (err) {
      logConfigParseError(err);
      closeStream();
    }
  });
}

function openWrapperFile (src, cb) {

  let piped = false;

  return gulp.src(src)
    .pipe(through2.obj((file, env, closeStream) => {
      piped = true;
      cb(file.contents.toString(), closeStream);
    }))
    .on('finish', () => {
      if (piped !== true) {
        logCannotFindWrapperFile(src);
      }
    });
}

function wrapFile (config) {
  return through2.obj((file, enc, closeStream) => {

    const wrapper = getWrapperFile(config);

    if (wrapper) {
      openWrapperFile(wrapper, (contents, closeWrapperStream) => {

        const output = contents
          .replace('{{name}}', config.output.name)
          .replace('\'{{content}}\'', content);

        file.contents = Buffer.from(output);

        closeWrapperStream();
        closeStream(null, file);
      });
      return;
    }
    closeStream(null, file);
  });
}

function smashFiles (config, options, closeStream) {

  const root = config.root || '';
  const files = (config.files || []).map((file) => {
    return file.replace(/\{root\}/i, root);
  });

  const file = config.output.file;
  const dest = config.output.dest;

  return gulp.src(files)
    .pipe(concat(file))
    .pipe(wrapFile(config))
    .pipe(gulp.dest(dest))
    .on('finish', () => {
      closeStream();
    });
}

function smash (src, options = {}) {

  let piped = false;
  let smashSrc = src;
  let smashOptions = options;

  if (typeof src !== 'string' && !(src instanceof Array)) {
    smashSrc = GULP_SRC_FILE_EXP;
    smashOptions = src || {};
  }

  return gulp.src(smashSrc)
    .pipe(getConfigFile((config, closeStream) => {
      piped = true;
      return smashFiles(config, smashOptions, closeStream)
    }))
    .on('finish', () => {
      if (piped !== true) {
        logCannotFindSmashFiles(src);
      }
    });
};

module.exports = {
  smash,
  wrapFile,
  smashFiles,
  getConfigFile,
  openWrapperFile
};

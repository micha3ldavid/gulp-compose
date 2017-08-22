/* eslint-env node */
const path = require('path');
const gulp = require('gulp');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const through2 = require('through2');
const Buffer = require('buffer').Buffer;

const {
  findWrapperFile,
  logCannotFindWrapperFile,
  logCannotFindSmashFiles
} = require('./utils');

//const referenceDependencies = getReferenceDependencies(config);
//const requireDependencies = getRequireDependencies(config);
//.replace('\'{{references}}\'', referenceDependencies)
//.replace('\'{{requires}}\'', requireDependencies)

function getConfig (cb) {

  let config;
  let contents;

  return through2.obj((file, enc, done) => {
    try {
      contents = file.contents.toString();
      config = JSON.parse(contents);
    }
    catch (err) {
      config = { err };
    }
    cb(config, done);
  });
}

function getWrapperFile (src, cb) {

  let piped = false;

  return gulp.src(src)
    .pipe(through2.obj((file, env, done) => {
      piped = true;
      cb(file.contents.toString(), done);
    }))
    .on('finish', () => {
      if (piped !== true) {
        logCannotFindWrapperFile(src);
      }
    });
}

function wrapFile (config) {
  return through2.obj((file, enc, done) => {

    const wrapper = findWrapperFile(config);

    if (wrapper) {
      getWrapperFile(wrapper, (contents, done2) => {

        const content = file.contents.toString();
        const output = contents
          .replace('{{namespace}}', config.name)
          .replace('\'{{content}}\'', content);

        file.contents = Buffer.from(output);
        done(null, file);
        done2();
      });
      return;
    }
    done(null, file);
  });
}

function smashFiles (config, options, done) {

  const root = config['input.root'] || '';
  const files = (config['input.files'] || []).map((file) => {
    return file.replace(/\{root\}/i, root);
  });

  const filename = config['output.file'] || null;
  const filepath = config['output.root'] || null;

  return gulp.src(files)
    .pipe(concat(filename))
    .pipe(wrapFile(config))
    .pipe(gulp.dest(filepath))
    .on('finish', () => {
      done();
    });
}

module.exports = function smash (src, options = {}) {

  let piped = false;
  let smashSrc = src;
  let smashOptions = options;

  if (typeof src !== 'string' && !(src instanceof Array)) {
    smashSrc = './**/.smash.json';
    smashOptions = src || {};
  }

  return gulp.src(smashSrc)
    .pipe(getConfig((config, done) => {
      piped = true;
      return smashFiles(config, smashOptions, done)
    }))
    .on('finish', () => {
      if (piped !== true) {
        logCannotFindSmashFiles(src);
      }
    });
};

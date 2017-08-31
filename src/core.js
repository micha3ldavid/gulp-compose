/* eslint-env node */
const path = require('path');
const gulp = require('gulp');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const through2 = require('through2');
const Buffer = require('buffer').Buffer;
const hasOwn = Object.hasOwnProperty;

const {
  logConfigParseError,
  logCannotFindSmashFiles,
  logCannotFindWrapperFile,
  logWrapperFileVariableParseError
} = require('./logging');

const {
  FILE_WRAPPERS,
  GULP_SRC_FILE_EXP,
  GULP_SRC_GLOBAL_FILE_EXP
} = require('./constants');

/**
 * Checks for a wrapper file to use after file concats.
 * @param {object} config - configuration (.smash.json) file contents.
 */

function getWrapperFile (config = {}) {
  const wrap = config.output.wrap;
  if (wrap && hasOwn.call(FILE_WRAPPERS, wrap)) {
    return FILE_WRAPPERS[wrap];
  }
  return wrap;
}

/**
 * Fetches the configuration file contents for an individual configuration as JSON.
 * @param {function} cb - callback function
 */

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

/**
 * Opens the wrapper file and calls your callback, providing you the wrapper file contents and a 'complete' callback to close the Stream when finished.
 * @param {string} src - file and pathname of the wrapper file. Can also be a key to a gulp-smash wrapper file template.
 * @param {function} cb - callback function which is provided with the file contents and a closeStream 'complete' to be called when finished.
 */

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

function parseWrapperFile (config, content) {

  const output = config.output || {};
  const variables = output.vars || {};
  const variableKeys = Object.keys(variables);

  return variableKeys.reduce((reduction, key) => {

    let value = variables[key]

    if (typeof value === 'object') {
      try {
        value = JSON.stringify(value);
      }
      catch (e) {
        logWrapperFileVariableParseError(key, err);
        value = ''
      }
    }
    return reduction.replace(
      new RegExp('[\'|\"]\{\{(vars.' + key + ')\}\}[\"|\']'),
      value
    )
  }, content);
}

function wrapFile (config) {
  return through2.obj((file, enc, closeStream) => {

    const wrapper = getWrapperFile(config);

    if (wrapper) {
      openWrapperFile(wrapper, (contents, closeWrapperStream) => {

        const output = config.output || {}
        const variables = output.vars || {}
        const variableKeys = Object.keys(variables)

        const fileContentParsed = parseWrapperFile(config, contents);
        const fileWithContent = fileContentParsed.replace(
          /['|"]\{\{content\}\}['|"]/i,
          file.contents.toString()
        );

        file.contents = Buffer.from(fileWithContent);

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

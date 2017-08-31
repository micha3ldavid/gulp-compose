/** DO NOT EDIT **/
/** THIS FILE WAS CREATED FROM GULP-SMASH **/
/** TO PROPERLY MODIFY FILE, EDIT SRC FILES AND RUN BUILD TASKS **/
/* eslint-disable */
(function handleJSEnvironment (root, factory) {

  const dependencyRefs = {"jquery":{"reference":"jQuery","require":"libs/jquery","define":"libs/jquery"}};
  const dependencyKeys = Object.keys(dependencies);

  if (typeof define === 'function' && define.amd) {
    const deps = dependencyKeys.map((key) => {
      return dependencyRefs[key].define || dependencyRefs[key];
    });
    define(deps, (...dependencies) => (
      factory.apply(root, ...dependencies)
    ));
  }
  else if (typeof module === 'object' && module.exports) {
    const deps = dependencyKeys.map((key) => {
      return dependencyRefs[key].require || dependencyRefs[key];
    });
    module.exports = factory.apply(root, deps);
  }
  else {
    const deps = dependencyKeys.map((key) => {
      const parts = (dependencyRefs[key].reference || dependencyRefs[key]).split('.');
      return parts.reduce((reduction, part) => {
        return reduction[part];
      }, root);
    });
    root.example = factory.apply(root, deps);
  }

}(typeof window !== 'undefined' ? window : this, (...dependencies) => {

  'use strict';

  
function one () {
  return 1;
}


function two () {
  return 2;
}


function three () {
  return 3;
}

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

function getWrapperFile (config = {}) {
  const wrap = config.output.wrap;
  if (wrap && hasOwn.call(FILE_WRAPPERS, wrap)) {
    return FILE_WRAPPERS[wrap];
  }
  return wrap;
}

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

}));
/* eslint-enable */

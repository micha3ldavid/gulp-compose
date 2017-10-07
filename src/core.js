/* eslint-env node */
const Buffer = require('buffer').Buffer;
const Composer = require('./composer');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const through2 = require('through2');
const path = require('path');
const gulp = require('gulp');

const {
  logConfigParseError,
  logCannotFindWrapperFile,
  logCannotFindComposeFiles,
  logWrapperFileVariableParseError,
} = require('./logging');

const {
  FILE_WRAPPERS,
  SRC_FILE_EXPRESSION,
  NOOP,
} = require('./constants');

function getWrapperFilePath (config = {}) {
  const { output = {} } = config;
  const { wrap } = output;
  if (wrap && Object.hasOwnProperty.call(FILE_WRAPPERS, wrap)) {
    return FILE_WRAPPERS[wrap];
  }
  return wrap;
}

function getConfigFile (callback) {
  return through2.obj((file, enc, done) => {
    try {
      const contents = file.contents.toString();
      const config = JSON.parse(contents);
      callback(config, () => {
        done(null, file);
      });
    }
    catch (err) {
      logConfigParseError(err);
      done(err, file);
    }
  });
}

function openWrapperFile (props = {}) {

  const {
    path = '',
    done = NOOP,
  } = props;

  let contents = null;

  return gulp.src(path)
    .pipe(through2.obj((file, env, done2) => {
      contents = file.contents.toString();
      done(contents, () => {
        done2(null, file);
      });
    }))
    .on('finish', () => {
      if (contents === null) {
        logCannotFindWrapperFile(file);
      }
    });
}

function parseWrapperFile (props = {}) {

  const {
    config = {},
    contents = '',
  } = props;

  const output = config.output || {};
  const variables = output.vars || {};
  const keys = Object.keys(variables) || [];

  return keys.reduce((reduction, key) => {

    let value = variables[key];

    if (typeof value === 'object') {
      try {
        value = JSON.stringify(value);
      }
      catch (err) {
        value = `{ "error": { "message": ${err.toString()} } }`;
        logWrapperFileVariableParseError(key, err);
      }
    }
    return reduction.replace(
      new RegExp('[\'|\"]\{\{(vars.' + key + ')\}\}[\"|\']'),
      value
    );
  }, contents);
}

function wrapFile (config = {}) {
  return through2.obj((file, enc, done) => {

    const path = getWrapperFilePath(config);

    if (path) {
      openWrapperFile({ path, done: (contents, done2) => {
        const output = config.output || {};
        const variables = output.vars || {};
        const variableKeys = Object.keys(variables) || [];
        const parsed = parseWrapperFile({ config, contents });
        const polished = parsed.replace(
          /['|"]\{\{content\}\}['|"]/i,
          file.contents.toString().replace(/\n/g, '\n\t')
        );

        file.contents = Buffer.from(polished);

        done2();
        done(null, file);
      }});
      return;
    }
    done(null, file);
  });
}

function concatFiles (props = {}) {

  const {
    config = {},
    done = NOOP,
    composer = null,
  } = props;

  const {
    root = '',
    files: rawFiles = [],
  } = config;

  const rootExp = /\{root\}/i;
  const files = rawFiles.map((file) => {
    return file.replace(rootExp, root);
  });

  const output = config.output || {};
  const file = output.file;
  const dest = output.dest;

  return gulp.src(files)
    .pipe(concat(file))
    .pipe(wrapFile(config))
    .pipe(gulp.dest(dest))
    .on('finish', () => {
      done();
    });
}

function compose (src, hook) {

  let path = src;
  let bind = hook;
  let stream = null;

  if (typeof path !== 'string' && !(path instanceof Array)) {
    path = SRC_FILE_EXPRESSION;
    bind = path;
  }

  if (typeof bind !== 'function') {
    bind = NOOP;
  }

  return gulp.src(path)
    .pipe(getConfigFile((config, done) => {
      const composer = bind(new Composer(config));
      stream = concatFiles({ composer, config, done });
    }))
    .on('finish', () => {
      if (stream === null) {
        logCannotFindComposeFiles(path);
      }
    })
};

module.exports = {
  compose,
  wrapFile,
  concatFiles,
  getConfigFile,
  openWrapperFile,
};

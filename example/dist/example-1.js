/** DO NOT EDIT **/
/** THIS FILE WAS CREATED FROM GULP-COMPOSE **/
/** TO PROPERLY MODIFY FILE, EDIT SRC FILES AND RUN BUILD TASKS **/
(function handleJSEnvironment (root, factory) {

  const dependencyRefs = {"jquery":{"reference":"jQuery","require":"jquery","define":"jquery"}};
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
    root.example_1 = factory.apply(root, deps);
  }

}(typeof window !== 'undefined' ? window : this, (...dependencies) => {

  'use strict';

  
	function one () {
	  return 1;
	}
	
	
	function three () {
	  return 3;
	}
	
	
	function two () {
	  return 2;
	}
	
	/* eslint-env node */
	const Buffer = require('buffer').Buffer;
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
	} = require('./constants');
	
	const hasOwn = Object.hasOwnProperty;
	
	function noop () {
	  /* do nothing */
	}
	
	function getWrapperFilePath (config = {}) {
	  const wrap = config.output.wrap;
	  if (wrap && hasOwn.call(FILE_WRAPPERS, wrap)) {
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
	    done = noop,
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
	      openWrapperFile({
	        path,
	        done: (contents, done2) => {
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
	        }
	      });
	      return;
	    }
	    done(null, file);
	  });
	}
	
	function concatFiles (props = {}) {
	
	  const {
	    options = {},
	    config = {},
	    done = noop,
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
	
	function compose (props = {}) {
	
	  const {
	    path = SRC_FILE_EXPRESSION,
	    options = {},
	    done = noop,
	  } = props;
	
	  let stream = null;
	
	  return gulp.src(path)
	    .pipe(getConfigFile((config, done2) => {
	      stream = concatFiles({
	        config,
	        options,
	        done: () => {
	          done2();
	          done(config);
	        }
	      });
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
	
}));

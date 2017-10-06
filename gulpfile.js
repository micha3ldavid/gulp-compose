/* eslint-env node */
const gulp = require('gulp');
const compose = require('./');
const globalConfig = {
  'gulp-minify': {
    ext: {
      min: '.min.js'
    }
  }
};

gulp.task('build-example', () => (
  compose({
    options: globalConfig,
    done: (config) => {
      console.info('done')
    }
  })
));

module.exports = gulp;

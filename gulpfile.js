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
  compose(globalConfig)
));

module.exports = gulp;

/* eslint-env node */
const gulp = require('gulp');
const smash = require('./src');
const globalConfig = {
  'gulp-minify': {
    ext: {
      min: '.min.js'
    }
  }
};

gulp.task('build-example', () => (
  smash(globalConfig)
));

module.exports = gulp;

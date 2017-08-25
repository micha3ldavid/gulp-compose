/* eslint-env node */
const gulp = require('gulp');
const smash = require('./src/core');
const globalConfig = {
  'gulp-minify': {
    ext: {
      min: '.min.js'
    }
  }
};

gulp.task('build-example', () => (
  smash({
    step: function (prevStep, nextStep) {
      if (lastStep === 'concat') {
        return babelify()
      }
    }
    finished: function () {}
  });
));

module.exports = gulp;

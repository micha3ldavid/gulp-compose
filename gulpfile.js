
const gulp = require('gulp');
const smash = require('./src/core');

gulp.task('build-example', () => (
  smash()
));

module.exports = gulp;

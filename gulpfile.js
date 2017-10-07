/* eslint-env node */
const gulp = require('gulp');
const compose = require('./');

gulp.task('build-example', () => (
  compose()
));

module.exports = gulp;

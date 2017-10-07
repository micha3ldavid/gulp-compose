/* eslint-env node */
const gulp = require('gulp');
const compose = require('./');

gulp.task('build-example', () => (
  return compose('./example', (composer) => {
    return composer.on('distribution.start', (stream, enc, done) => {})
  })
));

module.exports = gulp;

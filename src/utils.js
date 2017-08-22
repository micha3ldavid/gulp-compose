/* eslint-env node */
const { FILE_WRAPPERS } = require('./constants');
const hasOwn = Object.hasOwnProperty;

function findWrapperFile (config = {}) {
  const wrapper = config['file.wrapper'];
  if (wrapper && hasOwn.call(FILE_WRAPPERS, wrapper)) {
    return FILE_WRAPPERS[wrapper];
  }
  return wrapper;
}

function logCannotFindWrapperFile (src) {
  console.log(`gulp-smash:: Unable to find wrapper file: "${src}".`);
  console.log('gulp-smash:: You can provide your own file path or use one of our presets below.');
  console.log('gulp-smash:: File wrapper presets:', Object.keys(FILE_WRAPPERS));
}

function logCannotFindSmashFiles (src) {
  console.log(`gulp-smash:: Unable to find smash files: "${src}".`);
}

module.exports = {
  findWrapperFile,
  logCannotFindWrapperFile,
  logCannotFindSmashFiles,
};

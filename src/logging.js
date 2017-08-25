/* eslint-env node */
function logCannotFindWrapperFile (src) {
  console.log(`gulp-smash:: Unable to find wrapper file: "${src}".`);
  console.log('gulp-smash:: You can provide your own file path or use one of our presets below.');
  console.log('gulp-smash:: File wrapper presets:', Object.keys(FILE_WRAPPERS));
}

function logCannotFindSmashFiles (src) {
  console.log(`gulp-smash:: Unable to find smash files: "${src}".`);
}

function logConfigParseError (err) {
  console.log('gulp-smash:: Unable to parse configuration file.');
  console.log('gulp-smash:: Error:');
  console.log(err);
}

module.exports = {
  logCannotFindWrapperFile,
  logCannotFindSmashFiles,
  logConfigParseError
};

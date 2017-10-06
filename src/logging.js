/* eslint-env node */
const { FILE_WRAPPERS } = require('./constants')
const logPrefixer = 'gulp-compose::'

function logWrapperFileVariableParseError (variableKey, err) {
  console.log(`${logPrefixer} Unable to parse configuration var ${variableKey}.`);
  console.log(`${logPrefixer} Error:`);
  console.log(err);
}

function logCannotFindWrapperFile (src) {
  console.log(`${logPrefixer} Unable to find wrapper file: "${src}".`);
  console.log(`${logPrefixer} You can provide your own file path or use one of our presets below.`);
  console.log(`${logPrefixer} File wrapper presets:`, Object.keys(FILE_WRAPPERS));
}

function logCannotFindComposeFiles (src) {
  console.log(`${logPrefixer} Unable to find compose files: "${src}".`);
}

function logConfigParseError (err) {
  console.log(`${logPrefixer} Unable to parse configuration file.`);
  console.log(`${logPrefixer} Error:`);
  console.log(err);
}

module.exports = {
  logWrapperFileVariableParseError,
  logCannotFindComposeFiles,
  logCannotFindWrapperFile,
  logConfigParseError
};

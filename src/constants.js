/* eslint-env node */
const path = require('path');
const folder = 'file-wrappers';

const GULP_SRC_GLOBAL_FILE_EXP = './.smash.json';
const GULP_SRC_FILE_EXP = './**/.smash.json';

const FILE_WRAPPERS = {
  'environment.js': path.join(__dirname, folder, 'environment.js'),
  'closure.js': path.join(__dirname, folder, 'closure.js')
};

module.exports = {
  GULP_SRC_GLOBAL_FILE_EXP,
  GULP_SRC_FILE_EXP,
  FILE_WRAPPERS
};

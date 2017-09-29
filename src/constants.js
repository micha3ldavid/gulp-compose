/* eslint-env node */
const path = require('path');

const dir = __dirname;
const folder = 'file-wrappers';
const SRC_FILE_EXPRESSION = './**/.compose.json';

const FILE_WRAPPERS = {
  'environment.js': path.join(dir, folder, 'environment.js'),
  'closure.js': path.join(dir, folder, 'closure.js')
};

module.exports = {
  SRC_FILE_EXPRESSION,
  FILE_WRAPPERS
};

/* eslint-env node */
const path = require('path');
const folder = 'file-wrappers';
const FILE_WRAPPERS = {
  "js-env": path.join(__dirname, folder, 'js-env.js')
};

module.exports = { FILE_WRAPPERS };

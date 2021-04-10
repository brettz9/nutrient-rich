'use strict';

module.exports = {
  env: {
    browser: true
  },
  parserOptions: {
    ecmaVersion: 2020
  },
  settings: {
    polyfills: [
      'document.querySelector',
      'fetch',
      'Number.EPSILON',
      'Number.parseInt',
      'Object.entries'
    ]
  },
  overrides: [{
    files: 'build/**',
    extends: ['ash-nazg/sauron-node-script-overrides']
  }],
  extends: ['ash-nazg/sauron-overrides']
};

'use strict';

module.exports = {
  env: {
    browser: true
  },
  parserOptions: {
    ecmaVersion: 2022
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
    extends: ['ash-nazg/sauron-node-overrides'],
    parserOptions: {
      ecmaVersion: 2022
    }
  }],
  extends: ['ash-nazg/sauron-overrides']
};

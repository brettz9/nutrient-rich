'use strict';

module.exports = {
  env: {
    browser: true
  },
  settings: {
    polyfills: [
      'document.querySelector',
      'fetch',
      'Number.EPSILON',
      'Object.entries'
    ]
  },
  extends: ['ash-nazg/sauron-overrides']
};

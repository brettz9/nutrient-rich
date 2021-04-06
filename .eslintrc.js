'use strict';

module.exports = {
  env: {
    browser: true
  },
  settings: {
    polyfills: [
      'document.querySelector',
      'fetch',
      'Object.entries'
    ]
  },
  extends: ['ash-nazg/sauron-overrides']
};

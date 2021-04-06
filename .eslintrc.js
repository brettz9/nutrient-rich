'use strict';

module.exports = {
  settings: {
    polyfills: [
      'document.querySelector',
      'fetch',
      'Object.entries'
    ]
  },
  extends: ['ash-nazg/sauron-overrides']
};

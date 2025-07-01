import ashNazg from 'eslint-config-ash-nazg';

export default [
  {
    ignores: [
      'coverage/**',
      'vendor'
    ]
  },
  ...ashNazg(['sauron', 'browser']),
  {
    settings: {
      polyfills: [
        'document.querySelector',
        'fetch',
        'Number.EPSILON',
        'Number.parseInt',
        'Object.entries'
      ]
    }
  },
  ...ashNazg(['sauron', 'node']).map((cfg) => {
    return {
      ...cfg,
      files: ['build/**']
    };
  })
];

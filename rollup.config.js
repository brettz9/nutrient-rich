import resolve from '@rollup/plugin-node-resolve';

import commonjs from '@rollup/plugin-commonjs';
// import babel from 'rollup-plugin-babel';
// import {terser} from 'rollup-plugin-terser';

export default [{
  input: 'node_modules/hyperhtml-element/esm/index.js',
  output: {
    file: 'vendor/hyperhtml-element.js',
    format: 'es'
  },
  plugins: [
    resolve()
  ]
}, {
  // https://rollupjs.org/guide/en/#error-this-is-undefined
  context: 'window',
  input: 'node_modules/jquery/dist/jquery.min.js',
  output: {
    file: 'vendor/jquery.min.js',
    format: 'es'
  },
  plugins: [
    resolve(),
    commonjs()
  ]
}, {
  input: 'node_modules/datatables.net/js/jquery.dataTables.js',
  output: {
    file: 'vendor/jquery.dataTables.js',
    format: 'es'
  },
  plugins: [
    resolve(),
    commonjs()
  ]
}];

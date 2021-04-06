import resolve from '@rollup/plugin-node-resolve';

// import commonjs from '@rollup/plugin-commonjs';
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
}];

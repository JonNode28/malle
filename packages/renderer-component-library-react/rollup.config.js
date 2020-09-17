import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import postcssImport from 'postcss-import';
import postcssVariables from 'postcss-css-variables';
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import typescriptPlugin from 'rollup-plugin-typescript2'
import typescript from 'typescript';
import svgr from '@svgr/rollup'

import pkg from './package.json'

const externals = [
  ...Object.keys(pkg.peerDependencies),
  ...Object.keys(pkg.dependencies),
    'renderer-react',
    '/Users/jonathanpritchard/Projects/supersonicanaconda/packages/renderer-react/dist/index.es.js'
];
console.log('externals', externals);

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    //{ load(id) {console.log(id)} },
    external(externals),
    typescriptPlugin({
      typescript
    }),
    postcss({
      modules: true,
      plugins: [
        postcssImport({
          from: 'src'
        }),
        postcssVariables()
      ]
    }),
    url(),
    svgr(),
    babel({
      exclude: 'node_modules/**',
      plugins: [ '@babel/plugin-proposal-export-default-from' ]
    }),
    resolve(),
    commonjs({
      namedExports: {
        'recoil': ['RecoilRoot', 'useRecoilState', 'atom']
      }
    })
  ]
}

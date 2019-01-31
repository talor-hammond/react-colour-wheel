import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

// rollup.config.js
const config = {
  input: 'src/components/colourWheel/ColourWheel.js',
  external: ['react'],
  output: {
    file: 'build/ColourWheel.js',
    format: 'umd',
    name: 'countdown',
    globals: {
      react: 'React'
    }
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/react-dom/index.js': ['render']
      }
    }),
    terser()
  ]
}
export default config

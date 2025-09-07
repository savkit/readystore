import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const externalDeps = ['rxjs', '@angular/core'];

export default [
  // ESM modern
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true
    },
    external: externalDeps,
    plugins: [resolve(), commonjs(), typescript()]
  },

  // ESM5
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm5.js',
      format: 'es',
      sourcemap: true
    },
    external: externalDeps,
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            target: 'ES5',
            downlevelIteration: true,
            lib: ['ES2015', 'DOM']
          }
        }
      })
    ]
  },

  // CommonJS
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    external: externalDeps,
    plugins: [resolve(), commonjs(), typescript()]
  },

  // UMD (minified)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'ReadyStore',
      sourcemap: true,
      globals: {
        rxjs: 'rxjs',
        '@angular/core': 'ng.core'
      }
    },
    external: externalDeps,
    plugins: [resolve(), commonjs(), typescript(), terser()]
  }
];

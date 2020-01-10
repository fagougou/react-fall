import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export const getConfig = ({
  tsconfig = './tsconfig.json',
  output = [
    {
      file: `dist/${pkg.name}.js`,
      format: 'cjs',
      exports: 'named',
    },
    {
      file: `dist/${pkg.name}.es.js`,
      format: 'esm',
    },
  ],
} = {}) => {
  return {
    input: 'src/index.ts',
    external: ['react'],
    plugins: [
      typescript({
        tsconfig,
        clean: true,
      }),
    ],
    output,
  };
};

export default getConfig();

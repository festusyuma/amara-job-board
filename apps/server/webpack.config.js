const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

// @ts-check
/** @type {import('webpack').Configuration} */
module.exports = {
  output: {
    path: join(__dirname, 'dist'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      additionalEntryPoints: [
        { entryPath: join(__dirname, 'src/main.event.ts'), entryName: 'event' },
        { entryPath: join(__dirname, 'src/main.task.ts'), entryName: 'task' },
      ],
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true
    }),
  ],
};

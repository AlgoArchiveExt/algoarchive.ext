const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const DotEnv = require('dotenv-webpack');
const fs = require('fs');

const getContentScriptEntries = () => {
  const contentScripts = fs.readdirSync(path.resolve(__dirname, '..', 'src', 'content-scripts'));
  const entries = {};

  for (const script of contentScripts) {
    const scriptName = script.split('.')[0];
    entries[scriptName] = path.resolve(__dirname, '..', 'src', 'content-scripts', script);
  }

  return entries;
};

module.exports = {
  mode: 'production',
  entry: {
    'service-worker': path.resolve(__dirname, '..', 'src/service-workers', 'service-worker.ts'),
    popup: path.resolve(__dirname, '..', 'src/popup', 'popup.ts'),
    'getting-started': path.resolve(__dirname, '..', 'src/getting-started', 'getting-started.ts'),
    ...getContentScriptEntries(), // generate content script entries
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '..', 'src'),
    },
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: '.', to: '.', context: 'public' }, // copy all files from public folder to dist folder
        { from: 'src/**/*.css', to: '[name][ext]', context: '.' }, // copy all css files
        { from: 'src/**/*.html', to: '[name][ext]', context: '.' }, // copy all html files
      ],
    }),
    new DotEnv({
      prefix: 'import.meta.env.',
      safe: true,
    }),
  ],
  watch: true,
};

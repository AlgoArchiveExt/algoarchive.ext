const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    'service-worker': path.resolve(__dirname, '..', 'src/service-workers', 'service-worker.ts'),
    popup: path.resolve(__dirname, '..', 'src/popup', 'popup.ts'),
    content: path.resolve(__dirname, '..', 'src/scripts', 'content.ts'),
    'getting-started': path.resolve(__dirname, '..', 'src/getting-started', 'getting-started.ts'),
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
  ],
  watch: true,
};

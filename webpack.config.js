const path = require('path');

const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// fonts besides these are not included to keep bundle size low
const includedFonts = [
  'Work_Sans_300.woff',
  'fa-solid-900.woff2',
  'Work_Sans_500.woff',
  'Novecentosanswide-UltraLight-webfont.woff2',
];
const includedFontsRegex = new RegExp('(' + includedFonts.map(font => font.replace('.', '\\.')).join('|') + ')$');
console.log('included fonts regex:', includedFontsRegex);


module.exports = {
  mode: 'production',
  // option to exclude mermaid to keep bundle size low
  entry: (process.env.WITH_MERMAID) ? './static/index-with-mermaid.js' : './static/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'static'),
  },
  optimization: {
    minimizer: [
      new TerserJSPlugin(),
      new OptimizeCSSAssetsPlugin(),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: includedFontsRegex,
        use: 'url-loader',
      },
      {
        test: /\.(svg|woff|woff2|eot|ttf)$/,
        use: 'ignore-loader',
      },
    ],
  },
  externals: {
    jquery: 'jQuery',  // https://stackoverflow.com/a/57136296
  },
};

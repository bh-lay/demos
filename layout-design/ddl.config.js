const webpack = require('webpack');

const vendors = [
  'vue',
  'vue-class-component',
  'vue-router',
  'element-ui',
  'd3',
  'echarts',
  'brace',
  'awe-dnd',
  'raven.js',
  'vuex',
  ''
  // ...其它库
];

module.exports = {
  output: {
    path: 'build',
    filename: '[name].js',
    library: '[name]',
  },
  entry: {
    "lib": vendors,
  },
  plugins: [
    new webpack.DllPlugin({
      path: 'manifest.json',
      name: '[name]',
      context: __dirname,
    }),
  ],
};
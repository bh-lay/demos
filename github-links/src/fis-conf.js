/* global fis */

//CSS压缩
fis.match('*.css', {
  optimizer: fis.plugin('clean-css')
});

//发布位置
fis.match('**', {
  release: false,
});
fis.match('index.js', {
  release: '../index.js'
});
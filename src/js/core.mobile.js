/*
作者：max
时间：2017-3-13 08:24:37
说明：
*/
//设计稿必须是750的！
function adapt(designWidth, rem2px) {
  if (typeof devicePixelRatio === 'undefined' || devicePixelRatio === 1) {
    document.documentElement.style.fontSize = '16px';
  }
  else {
    var scale = 1 / devicePixelRatio;
    document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width,initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
    var d = window.document.createElement('div');
    d.style.width = '1rem';
    d.style.display = 'none';
    var head = window.document.getElementsByTagName('head')[0];
    head.appendChild(d);
    var defaultFontSize = parseFloat(window.getComputedStyle(d, null).getPropertyValue('width'));
    d.remove();
    document.documentElement.style.fontSize = window.innerWidth / designWidth * rem2px / defaultFontSize * 16 + 'px';
  }
}
adapt(750, 30);
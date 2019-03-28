/**
时间：2017-4-28 08:46:14
说明：1.要处理
      现代浏览器、低版本IE、高本版IE
      iframe内（主要是blur的问题）
      2.ie6就不用考虑了
      3.分为preview和uploadview
        preview上传的是file文件
        uploadview上传的是url
**/
!(function () {
  function previewImage(pic, file) {
    var oFReader;
    if (window.FileReader) {//chrome,firefox7+,opera,IE10,IE9，IE9也可以用滤镜来实现
      oFReader = new FileReader();
      oFReader.readAsDataURL(file.files[0]);
      oFReader.onload = function (oFREvent) {
        pic.src = oFREvent.target.result;//图片预览
        //console.log("FileReader: " + oFREvent.target.result);
      };
    }
    else if (document.all) {//IE8-
      file.select();//没这一句 IE9都获取不到路径有IE7也能获取到路径
      if (top !== this) {
        window.top.document.body.focus();//解决iframe中获取的值为空的问题
      }
      else {
        file.blur();//没有这一句会出现拒绝访问
      }
      var reallocalpath = document.selection.createRange().text;//IE下获取实际的本地文件路径

      if (window.ie6 !== undefined && window.ie6) {
        pic.src = reallocalpath; //IE6浏览器设置img的src为本地路径可以直接显示图片
      }
      else { //非IE6版本的IE由于安全问题直接设置img的src无法显示本地图片，但是可以通过滤镜来实现，IE10浏览器不支持滤镜，需要用FileReader来实现，所以注意判断FileReader先
        pic.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod="image",src="' + reallocalpath + '")';
        pic.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';//设置img的src为base64编码的透明图片，要不会显示红xx
      }
    }
    else if (file.files) {//firefox6-
      if (file.files.item(0)) {
        pic.src = file.files.item(0).getAsDataURL();
      }
    }
  }
  $.fn.extend({
    preview: function (json) {
      var ofile = document.getElementById(json.file);
      var oimg = this.get(0);
      if (this.length === 0) {
        return;
      }
      $(ofile).bind('change', function () {
        previewImage(oimg, ofile);
        if (typeof json.callback === 'function') {
          json.callback.call(this);
        }
      });
    }
  });
})();
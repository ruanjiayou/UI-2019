/**
时间：2017-4-28 11:58:13
说明：文件上传获取返回的url
      2017-5-4 14:41:44 IIS要设置跨域资源共享
      2017-5-11 09:48:53 去掉query配置项 增加multiple配置项
      2017-5-26 12:00:18 IE11中虽然支持h5 但input必须插入到document中！
**/
; (function ($) {
  var _config = {
    //内部变量
    loaded: 0,
    total: 0,
    per: 0,
    multiple: false,
    name: 'upload',
    //必传
    url: '',
    //可选
    max: { size: Infinity, message: '' },
    filter: [],
    onUpload: null,
    beforSend: null,
    callback: function () { }
  };
  function upload(options) {
    var fd = new FormData(),
      xhr = new XMLHttpRequest(),
      input;
    var config = $.extend({}, _config, options);
    input = $('<input type="file"/>').attr({ 'id': 'tempUpload', 'name': config.name, 'style': 'position: absolute;left:0;top:0; opacity: 0.01; filter: alpha(opacity=1);' }).get(0);
    document.body.appendChild(input);
    if (config.multiple) {
      input.multiple = 'multiple';
    }
    input.onchange = function () {
      var n = $(this).attr('name');
      if (config.beforSend instanceof Function) {
        config.beforSend();
      }
      for (var i = 0; i < input.files.length; i++) {
        fd.append(n, input.files[i]);
      }
      //http状态
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200 && config.callback) {
          config.callback(xhr.responseText);
        }
      };
      xhr.upload.onprogress = function (evt) {
        config.loaded = evt.loaded;
        config.total = evt.total;
        //上传进度
        config.per = Math.floor(100 * config.loaded / config.total);
        if (config.onUpload instanceof Function) {
          config.onUpload(config.per);
        }
      };
      xhr.open('post', config.url);
      xhr.send(fd);
    };
    input.click();
  }
  $.fn.extend({
    upload: function (options) {
      var oForm = null;
      this.bind('click', function () {
        if (options.before) {
          options.before();
        }
        //判断浏览器是否支持 FileReader
        var isH5 = false;
        try {
          if (FormData instanceof Function) {
            isH5 = true;
          }
        }
        catch (e) {
          $.log('不支持H5');
        }
        if (isH5) {
          upload(options);
        }
        else {
          if (oForm !== null) {
            oForm.parentNode.removeChild(oForm);
          }
          var config = $.extend(_config, options);
          oForm = $.createNode('form', { 'enctype': 'multipart/form-data', 'name': 'f', 'method': 'POST', 'target': 'hiddenIframe', 'action': config.url, 'style': 'position:absolute;left:0;top:0;filter:alpha(opacity=1);' });
          oForm.innerHTML = '<input id="__upload" name="' + config.name + '" type="file"/><input type="hidden" _name="ie" value="old"/>';
          $(this).attr('for', '__upload');
          var oIframe = $.createNode('iframe', { 'id': 'hiddenIframe', 'name': 'hiddenIframe', 'src': '' });
          document.body.appendChild(oForm);
          oForm.appendChild(oIframe);
          //load事件 upload.aspx 设置 response
          $(oIframe).on('load', function () {
            var txt = this.contentDocument.body.innerHTML || this.contentWindow.document.body.innerHTML;
            //console.log(txt);
            if (txt) {
              config.callback(txt);
            }

            //if(config.callback && top.UPDATE_DATA!==''){
            //    config.callback(top.UPDATE_DATA);
            //} 
            //oForm.parentNode.removeChild(oForm);
          });
          $(oForm).find('input').bind('change', function () {
            setTimeout(function () { oForm.submit(); }, 200);
          });
        }
      });//绑定事件结束
    }
  });
})(jQuery);
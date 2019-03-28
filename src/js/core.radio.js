/**
时间：2017-7-22 22:35:00
说明：将单选和复选框分开
      2017-7-22 22:55:21
      disabled类名固定
      evt是经过jQuery包装的
      2017-7-22 23:56:32
      使用了is判断多个类名和trigger触发自定义事件
      callback第一个参数是evt 第二个参数是input原生节点
**/
!(function ($) {
  function simulateInput(evt) {
    evt = evt || window.event;
    var jThis = $(this),
      mInput = jThis.children('input'),
      mName = mInput.attr('name'),
      mInputs = $('input[name="' + mName + '"]');
    evt.preventDefault();
    if (jThis.is('.disabled,.checked')) {
      return;
    }
    mInputs.parent().removeClass('checked');
    jThis.addClass('checked');
    mInput.attr('checked', true);
    jThis.trigger('callback', mInput);
  }
  $.fn.extend({
    iRadio: function (callback) {
      this.each(function () {
        var that = $(this);
        var wrapper;
        var css = '';
        //初始化处理 设置回调
        if (this.inited) {
          that.parent().unbind('callback').bind('callback', (callback || this.callback));
          return;
        }
        else {
          this.inited = true;
          wrapper = that.wrap('<label role="radiobtn">' + that.attr('text') + '</label>').parent();
          wrapper.bind('callback', (callback || this.callback));
        }
        //样式初始化
        css += that.prop('checked') ? 'checked' : '';
        css += that.attr('disabled') ? ' disabled' : '';
        wrapper.addClass(css);
        //事件绑定
        wrapper.click(function (e) {
          simulateInput.call(this, e);
        });
      });
    }
  });
})(jQuery);
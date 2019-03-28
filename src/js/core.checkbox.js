/**
 * @time 2017-7-23 00:28:11
 * @description 说明：将单选和复选框分开
 */
!(function ($) {
  function simulateCheckBox(evt) {
    evt = evt || window.event;
    var that = $(this),
      mInput = that.children('input'),
      isCheckAll = that.hasClass('check-all'),
      checkAll = [],
      isCheck = that.hasClass('checked'),
      mName = mInput.attr('name'),
      mInputs = $('input[name="' + mName + '"]'),
      i = 0,
      count = 0,
      len = mInputs.length;
    evt.preventDefault();
    if (that.hasClass('disabled')) {
      return;
    }
    if (isCheckAll) {
      //清空 全选 
      mInputs.prop('checked', !isCheck);
      if (isCheck) {
        mInputs.parent().removeClass('checked');
      }
      else {
        mInputs.parent().addClass('checked');
      }
    }
    else {
      //切换
      mInput.prop('checked', !isCheck).parent().toggleClass('checked');
      //被动 全选/清空效果
      for (; i < mInputs.length; i++) {
        if ($(mInputs[i]).hasClass('check-all')) {
          len--;
          checkAll.push(mInputs[i]);
        }
        else if ($(mInputs[i]).prop('checked')) {
          count++;
        }
      }
      if (count === len) {
        $(checkAll).prop('checked', true).parent().addClass('checked');
      }
      else {
        $(checkAll).prop('checked', false).parent().removeClass('checked');
      }
    }
    that.trigger('callback', isCheckAll ? mInputs : mInput);
  }
  $.fn.extend({
    iCheck: function (callback) {
      this.each(function () {
        var that = $(this),
          wrapper,
          css = '',
          txt;
        //初始化处理 设置回调
        if (this.inited) {
          that.parent().unbind('callback').bind('callback', (callback || this.callback));
          return;
        }
        else {
          this.inited = true;
          txt = that.attr('text') || '';
          wrapper = that.wrap('<label role="checkbtn">' + txt + '</label>').parent();
          wrapper.bind('callback', (callback || this.callback));
        }
        //样式初始化
        css += that.hasClass('check-all') ? 'check-all ' : '';
        css += that.prop('checked') ? 'checked ' : '';
        css += that.attr('disabled') ? ' disabled' : '';
        wrapper.addClass(css);
        //事件绑定
        wrapper.click(function (e) {
          simulateCheckBox.call(this, e);
          e.preventDefault();
          e.stopPropagation();
        });
      });
    }
  });
})(jQuery);
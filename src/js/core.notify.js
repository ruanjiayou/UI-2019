/**
 * @author max
 * @time 2017-8-9 20:40:23
 * @description loading插件
*/
// $.notify.showLoad(); 登录页加载中...
// $.notify.hideLoad({text: '正在获取数据!', timeout: 4000 }); 列表加载数据  $.loading.Hide(); 加载完成 $.loading.toast(); 超时
// $.notify.toast({ icon: 'warning.gif', text: '添加成功'}); 新增/删除
!(function ($) {
  $.notify =
    {
      template: '<div class="notify"><div class="loading-body"><img class="loading-icon" src="loading.gif"/><div class="loading-text"></div></div></div>',
      defaults: {
        selector: 'body',
        text: '加载中...',
        icon: '',
        html: false,
        content: '',
        mask: true,
        speed: 500,//fadeIn fadeOut速度
        duration: 1500//toast专用
      },
      showLoad: function (m) {
        var o = $(this.template),
          b = o.find('.loading-body'),
          i = o.find('.loading-icon'),
          t = o.find('.loading-text'),
          p;
        m = $.extend({}, this.defaults, m || {});
        if (m.content) {
          b.html(m.html ? m.content : '');
          if (m.html) {
            b.text(m.content);
          }
        }
        else {
          if (m.html) {
            t.html(m.text || '');
          }
          else {
            t.text(m.text || '');
          }
          if (m.icon) {
            i.attr('src', m.icon);
          }
        }
        //mask黑色遮罩白色背景 toast透明遮罩黑色背景
        if (m.mask) {
          o.addClass('loading-mask');
        }
        else {
          b.addClass('loading-toast');
        }
        p = $(m.selector).append(o);
        b.css({ 'margin-left': -b.outerWidth() / 2 + 'px', 'margin-top': -b.outerHeight() / 2 + 'px' });
        if (p.length) {
          var old = p[0].notify;
          delete p[0].notify;
          if (old) {
            old.fadeOut('fast');
          }
          p[0].notify = o;
          if (p.prop('tagName') === 'BODY') {
            o.addClass('loading-full');
          }
          o.css('display', 'none').fadeIn(m.speed || 'fast', function () {
            o.attr('style', '');
            if (m.callback) {
              m.callback.call(o);
            }
          });
        }
      },
      hideLoad: function (m) {
        m = m || $.extend({}, this.defaults);
        var p = $(m.selector || 'body'), o;
        if (p.length && p[0].notify) {
          o = $(p[0].notify);
          o.fadeOut(m.speed || 'fast', function () {
            o.remove();
            delete p[0].notify;
          });
        }
      },
      toast: function (m) {
        var d = this.defaults;
        this.showLoad({
          html: true,
          mask: false,
          fadeout: true,
          content: m.content,
          speed: m.speed || d.speed,
          callback: function () {
            var o = this;
            setTimeout(function () {
              o.remove();
            }, $.notify.defaults.duration);
          }
        });
      }
    };
}(jQuery));

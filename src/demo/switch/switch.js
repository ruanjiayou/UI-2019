!(function ($) {
  //var defaults = { animation: 'display'};
  function initTabs(config) {
    var oHeader = this.find('.tabs-header > div'),
      oContent = this.find('.tabs-content > div');
    oHeader.click(function (e) {
      var o = e.target;
      if (o === this) {
        o = $(this);
        oHeader.removeClass('active');
        o.addClass('active');
        oContent.hide().eq(o.index()).show();

      }
    });
  }
  $.fn.extend({
    tabs: initTabs
  });
}(jQuery));
/**
* menus
* unique 展开唯一性(没有三级) default 阻止默认
*/
!(function ($) {
  var defaults = {
    unique: false,
    stopDefault: true,
    itemClass: 'menu-item',
    animation: 'slide',
    activeClass: 'active'
  };
  function initMenu(config) {
    var that = this;
    var m = $.extend({}, defaults, config || {});
    that.click(function (e) {
      var o = $(e.target),
        c = o.next('ul');
      //不是菜单直接退出
      if (!o.hasClass(m.itemClass)) {
        return;
      }
      //阻止默认事件
      if (m.stopDefault) {
        e.preventDefault();
      }
      if (!o.hasClass(m.activeClass)) {
        that.find('.' + m.itemClass).removeClass(m.activeClass).each(function () {
          // 只能激活一个
          if (m.unique) {
            $(this).next('ul').slideUp();
          }
        });
      }
      c.slideToggle();
      //不能放前面
      o.addClass(m.activeClass);
    });
  }
  $.fn.extend({
    menus: initMenu
  });
}(jQuery));
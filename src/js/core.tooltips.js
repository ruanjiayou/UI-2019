/**
时间：2017-3-30 21:42:42
说明：tip提示效果
      less rem方式 如果只写pc端的另行修改
      2017-4-24 10:30:09 class控制结构的方式换为role属性控制结构。使用fade动画。
      2017-4-24 10:54:50 解决延迟与动画的矛盾问题。
      2017-5-10 14:14:16
        bootstrap的实现方式
        Tooltip类
            this.type  'focus'/'hover'
            this.enabled true/false
            this.timeout  //setTimeout funtction
            this.hoverState  'in'/'out'
            this.$element ?
            this.inState  //event.type focusin/focusout --> this.type focus/hover?
            this.options
         Tooltip.VERSION
         Tooltip.DURATION
         Tooltip.DEFAULTS = {
             animate: true,   //fade效果
             placement: 'top'/'left'/'right'/'bottom', //防止出边界
             selector: false,
             template: '',
             trigger: 'hover focus',
             title: '',
             delay: 0,   //最终竟然是 { show: delay, hide: delay }
             html: false,
             container: false,
             viewport:{
                 selector: 'body',
                 padding: 0
             }
         }
         prototype
            init()
            enter()
            leave()
            show()
            hide()
            setEnable()
            destroy()
            动态调整 offset view 等
            setContent()
            getDefaults()
            getPosition()
            
         
**/
!(function ($) {
  var css = {
    '[role="tooltip"]': 'position: absolute; left: 0; visibility: hidden; z-index: 2;',
    '[role="tooltip"] > [role="tip-content"]': 'max-width: 150px; border-radius: 4px; padding: 10px; background-color: #444; color: #fff; word-break: break-all;',
    '[role="tooltip"] > [role="arrow"]': 'position: absolute; left: 50%; top: 100%; width: 0; height: 0; margin-left: -4px; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #444;'
  };
  $.sheet(css);
  var otips = $.createNode('div', { 'role': 'tooltip' });
  otips.innerHTML = '<div role="tip-content"></div><div role="arrow"></div>';
  var timer = null;

  $(otips).on('mouseenter', function () {
    clearTimeout(timer);
    timer = null;
    $(this).stop(true, true);
  });
  $(otips).on('mouseleave', function () {
    timer = setTimeout(function () {
      $(otips).animate({ 'opacity': 0 }, function () {
        otips.style.visibility = 'hidden';
      });
    }, 300);
  });
  $(function () {
    document.body.appendChild(otips);
    $('[data-tooltip]').each(function () {
      var self = $(this);
      self.on('mouseenter', function () {
        this.parentNode.appendChild(otips);
        $(otips).children('div:eq(0)').html(self.attr('data-tooltip'));
        var targetW = this.offsetWidth;
        //var targetH = this.offsetHeight;
        var targetT = this.offsetTop;
        var targetL = this.offsetLeft;
        var L = targetL + targetW / 2 - otips.offsetWidth / 2;
        var T = targetT - otips.offsetHeight - 10;
        clearTimeout(timer);
        timer = null;
        $(otips).stop(true, true);
        $(otips).css({ 'visibility': 'visible', 'top': T + 'px', 'left': L + 'px', 'opacity': 0 }).animate({ 'opacity': 1 }, function () {

        });
      });
      self.on('mouseleave', function () {
        timer = setTimeout(function () {
          $(otips).animate({ 'opacity': 0 }, function () {
            otips.style.visibility = 'hidden';
          });
        }, 300);
      });
    });
  });
})(jQuery);
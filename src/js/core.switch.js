//2017-8-12 00:43:32 fix 垂直loop无效的bug
//2017-8-12 00:56:21 修复多次点击的bug
//切换类型 translate slide scroll fade
!(function ($) {
  function powerSwitch(config) {
    //参数处理
    var _config = {
      inited: false,
      container: null,         //容器 选择器或node节点
      headerSelector: '',      //映射 [映射选择器, 内容选择器]
      contentSelector: '',
      activeClass: 'active',   //当前项要添加的类名
      delayTime: 1500,         //自动切换的间隔时间(autoPlay)
      autoPlay: false,         //是否自动切换
      loop: false,             //无限循环
      direction: 'left',       //left top
      eventType: 'click',      //映射关联的触发事件类型(hover/click)
      animation: 'scroll',     //display visibility translate fade slide
      number: 1,               //容器每屏显示多少项
      activeIndex: 0,
      prevSelector: '.prev',   //上一*按钮的类名
      nextSelector: '.next',   //下一*按钮的类名
      beforSwitch: null,       //回调事件(index,nodeContent,nodeMap)
      afterSwitch: null
    };
    var i, k;
    if (typeof config === 'object') {
      for (k in config) {
        _config[k] = config[k];
      }
    }
    var self, othis;
    if (_config.container !== null) {
      self = $(config.container);
    }
    else {
      self = $(this);
    }
    othis = self.get(0);
    othis.config = _config;
    othis.timer = null;
    var contents = self.find(othis.config.contentSelector);
    var content = contents.get(0);
    //空容器补足
    for (i = contents.length % othis.config.number, k = othis.config.number; (i !== 0 && i < k); i++) {
      content.parentNode.appendChild(document.createElement(content.nodeName));
    }
    //用于无缝切换
    if (othis.config.loop) {
      content.parentNode.innerHTML += content.parentNode.innerHTML;
    }
    //临时辅助变量
    if (self.find(othis.config.contentSelector).length === 0) {
      $.log('没容器或没内容 想作死?');
      return;
    }
    //绑定事件
    self.find(othis.config.headerSelector).each(function (index) {
      this.index = index;
      $(this).on(othis.config.eventType, function () {
        othis.doAnimation(this.index);
      });
    });
    //上一个
    self.find(othis.config.prevSelector).on(_config.eventType, function () {
      othis.doAnimation(othis.config.activeIndex - 1);
    });
    //下一个
    self.find(othis.config.nextSelector).on(_config.eventType, function () {
      othis.doAnimation(othis.config.activeIndex + 1);
    });
    othis.doAnimation = function (index) {
      var self = $(this),
        hs = self.find(othis.config.headerSelector),
        cs = self.find(othis.config.contentSelector),
        len = Math.ceil(cs.length / this.config.number),
        headerNode, contentNode;
      index = (index + len) % len;
      headerNode = hs.get(index);
      contentNode = cs.get(index);
      if (this.config.loop) {
        if (index === Math.ceil(cs.length / 2 / this.config.number) + 1) {
          index = 1;
          if (this.config.direction == 'left')
            contentNode.parentNode.scrollLeft = 0;
          else
            contentNode.parentNode.scrollTop = 0;
        }
        headerNode = hs.get(index % (Math.ceil(cs.length / 2 / this.config.number)));
      }
      if (this.config.beforSwitch) {
        this.config.beforSwitch(index, headerNode, contentNode);
      }
      switch (this.config.animation) {
        case 'display':
          cs.css('display', 'none');
          contentNode.style.display = 'block';
          break;
        case 'scroll':
          var op = $(contentNode.parentNode);
          op.stop();
          if (this.config.direction === 'left') {
            op.animate({ 'scrollLeft': cs.get(index * this.config.number).offsetLeft });
          }
          else {
            op.animate({ 'scrollTop': cs.get(index * this.config.number).offsetTop });
          }
          break;
        case 'fade':
          cs.fadeOut('normal');
          $(cs.get(index)).fadeIn('normal', function () { $(this).css('display', 'block'); });
          break;
        case 'slide':
          var oc = $(contentNode);
          if (oc.css('display') === 'none') {
            oc.slideDown();
          }
          else {
            oc.slideUp();
          }
          break;
        default: break;
      }
      this.config.activeIndex = index;
      hs.removeClass(this.config.activeClass);
      if (headerNode) {
        $(headerNode).addClass(this.config.activeClass);
      }
      if (this.config.afterSwitch) {
        this.config.afterSwitch(index, headerNode, contentNode);
      }
    };
    //自动切换
    if (_config.autoPlay) {
      othis.timer = setInterval(function () {
        othis.doAnimation(othis.config.activeIndex + 1);
      }, othis.config.delayTime);
      self.on('mouseenter', function () {
        clearInterval(this.timer);
        this.timer = null;
      });
      self.on('mouseleave', function () {
        var oThis = this;
        oThis.timer = setInterval(function () {
          oThis.doAnimation(oThis.config.activeIndex + 1);
        }, oThis.config.delayTime);
      });
    }
    //解除插件的绑定
    othis.unInit = function () {
      $(this).find(othis.config.headerSelector).each(function () {
        $(this).unbind(othis.config.eventType);
      });
      $(this.config.prevSelector).unbind(othis.config.eventType);
      $(this.config.nextSelector).unbind(othis.config.eventType);
      clearInterval(othis.timer);
      othis.timer = null;
      $(othis).unbind('mouseenter');
      $(othis).unbind('mouseleave');
      othis.config = null;
    };
    //这个让使用者自己调用更好！
    othis.doAnimation(_config.activeIndex);
  }
  $.powerSwitch = powerSwitch;
  //$.fn.extend({
  //    transform: 
  //})
})(jQuery);

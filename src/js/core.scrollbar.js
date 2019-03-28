/**
  时间：2017-4-18 00:29:37
  说明：
**/
!(function () {
  //设置内容滚动
  function PreSet(percent) {
    var v = 0;
    var op = this.target;
    if (this.bVertical) {
      v = Math.floor((op.scrollHeight - op.offsetHeight) * percent);
      op.scrollTop = v;
    }
    else {
      v = Math.floor((op.scrollWidth - op.offsetWidth) * percent);
      op.scrollLeft = v;
    }

  }
  //设置滑块位置
  function setPos(d) {
    var l = 0;//滑块的宽或高
    var direction = 'top';
    var max = 0;//最大值
    if (this.bVertical) {
      l = this.bar.offsetHeight;
      max = this.offsetHeight;
    }
    else {
      l = this.bar.offsetWidth;
      max = this.offsetWidth;
      direction = 'left';
    }
    d = d < 0 ? 0 : (d > max - l ? max - l : d);
    if (this.target) {
      PreSet.call(this, d / (max - l));
    }
    $(this.bar).css(direction, d + 'px');
    if (this.onScroll) {
      this.onScroll(d / (max - l));
    }
  }
  //拖动滑块事件
  function drag(e) {
    Event.cancelDefault(e);
    var v = this.bVertical ? e.pageY - this.originPoint.y + this.originPoint.top : e.pageX - this.originPoint.x + this.originPoint.left;
    setPos.call(this, v);
  }
  //滚轮事件
  function wheel(e) {
    Event.cancelDefault(e);
    Event.stopBubble(e);
    var bDown = e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta < 0 : e.originalEvent.detail > 0;
    var v = this.bVertical ? this.bar.offsetTop : this.bar.offsetLeft;
    setPos.call(this, (bDown ? v + 10 : v - 10));
  }
  $.fn.extend({
    scroll: function (json) {
      var _json = {
        target: '',
        //preScrolling: null, 对外不可见
        onScroll: null,
        callback: null
      };
      for (var k in json) {
        _json[k] = json[k];
      }
      var tStart = 'mousedown',
        tMoving = 'mousemove',
        tStop = 'mouseup',
        tWheel = 'mousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
      var self = this;
      var oSlider = null;
      if (self[0] === undefined) {
        return;
      }
      if (!/\b(slider)\b/g.test(self.attr('role'))) {
        oSlider = $.createNode('div', { 'role': 'slider' });
        oSlider.innerHTML = '<div role="bar"></div>';
        oSlider.target = self[0];
        var o = $.createNode('div', { 'role': 'slider-window' });
        self[0].parentNode.replaceChild(o, self[0]);
        o.appendChild(self[0]);
        o.appendChild(oSlider);
        $(oSlider).bind('selectstart', function () { return false; });
      }
      else {
        oSlider = self[0];
      }

      oSlider.onScroll = _json.onScroll;
      oSlider.bVertical = true;
      oSlider.bar = $(oSlider).find('[role="bar"]').get(0);
      //mousedown mousemove mouseup
      $(oSlider.bar).bind(tStart, function (e) {
        oSlider.originPoint = { x: e.pageX, y: e.pageY, left: oSlider.bar.offsetLeft, top: oSlider.bar.offsetTop };
        var ot = function (t) {
          drag.call(oSlider, t);
        };
        $(document).bind(tMoving, ot);
        $(document).bind(tStop, function () {
          $(document).unbind(tMoving, ot);
          $(document).unbind(tStop, this.callee);
        });
      });
      //mousewheel
      if (oSlider.target) {
        var oh = oSlider.offsetHeight * oSlider.target.offsetHeight / oSlider.target.scrollHeight;
        $(oSlider.bar).css({ 'height': oh + 'px' });
        oSlider.target.scrollTop = 0;
        $(window).bind('resize', function () {
          //var per = oSlider.bar.offsetTop/(oSlider.offsetHeight - oSlider.bar.offsetHeight);
          var oh = oSlider.offsetHeight * oSlider.target.offsetHeight / oSlider.target.scrollHeight;
          $(oSlider.bar).css({ 'height': oh + 'px' });
        });
        $(oSlider.target).bind(tWheel, function (e) { wheel.call(oSlider, e); });
      }
      $(oSlider).bind(tWheel, function (e) { wheel.call(oSlider, e); });
    }
  });
})();
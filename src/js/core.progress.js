/**
时间：2017-4-11 21:45:42
说明：样式配置默认+可选方式
      需配合common.progress.less(jquery.js less.js core.js config.less common.less)
      统一使用0-100 不再使用小数
      2017-7-21 11:38:26
      补充 步骤的js
**/
//7.进度条组件 data-progress='inner/outer radius red/green/blue horizontal/vertical top/center/bottom [0,0.5]' data-role='bar'表示进度 i用来显示文字
//  容器 progress radius表示有圆角 inner和outer表示文字的位置 red/green/blue表示可选的进度条颜色 进度条position区间 [0,1]
// <div data-progress="inner radius blue [0,0.5]"><div role="bar"><i>50%</i></div></div>
!(function ($) {
  //限制0-100
  function Limit(percent) {
    return percent < 0 ? 0 : (percent > 100 ? 100 : percent);
  }
  function ShowText(txt) {
    if (this.config.txtNode) {
      this.config.txtNode.innerHTML = txt;
      this.config.txtNode.className = /^100/.test(txt) ? '' : 'finished';
    }
  }
  //{width:0,offset:0}
  function getArgs(data) {
    var offset = 0, width = 0;
    if (data.width) {
      width = this.Limit(data.width);
    }
    if (data.offset) {
      offset = data.offset;
    }
    if ($.type(data) === 'number') {
      width = this.Limit(100 * data);
    }
    var t = { direction: '', position: '' };
    switch (this.config.position) {
      case 'top':
        offset = this.Limit(offset);
        break;
      case 'center':
        offset = 50 - width / 2;
        break;
      case 'bottom':
        offset = 100 - width - offset;
        break;
      default: break;
    }
    if (this.config.direction === 'vertical') {
      t.direction = 'height';
      t.position = 'top';
    }
    else {
      t.direction = 'width';
      t.position = 'margin-left';
    }
    this.config.txtNode.innerHTML = width + '%';
    var temp = {};
    temp[t.direction] = width + '%';
    temp[t.position] = offset + '%';
    return temp;
  }
  //设置poison即时生效
  function progress(data) {
    var args = this.getArgs(data);
    $(this.config.barNode).css(args);
    if (data.callback) {
      data.callback.call(this, args);
    }
  }
  //设置position动画
  function animateProgress(data) {
    var args = this.getArgs(data);
    var oThis;
    $(this.config.barNode).animate(args, function () {
      if (data.callback) {
        data.callback.call(oThis, args);
      }
    });
  }
  //初始化
  $.progress = function (obj) {
    var self = $(obj);
    if (self.get(0) === void 0) {
      $.log('progress selector is empty!');
      return;
    }
    var oThis = self.get(0);
    oThis.Limit = Limit;
    oThis.ShowText = ShowText;
    oThis.getArgs = getArgs;
    oThis.progress = progress;
    oThis.animateProgress = animateProgress;
    oThis.config = {
      barNode: null,
      txtNode: null,
      //前缀后缀(prefix suffix)： TODO
      //txt: "",
      direction: 'horizontal',
      position: 'top',
      offset: 0,
      width: 0,
      callback: null
    };
    oThis.config.barNode = self.children('[role="bar"]').get(0);
    oThis.config.txtNode = $.createNode('i', { 'role': 'txt' });
    //方向与位置初始化
    var attr = self.attr('data-progress');
    if (/\b(vertical)\b/g.test(attr)) {
      oThis.config.direction = 'vertical';
    }
    if (/\b(center)\b/g.test(attr)) {
      oThis.config.position = 'center';
    }
    if (/\b(bottom)\b/g.test(attr)) {
      oThis.config.position = 'bottom';
    }
    //inner outer判断
    if (/\b(txt)\b/g.test(attr)) {
      if (/\b(inner)\b/.test(attr)) {
        oThis.config.barNode.appendChild(oThis.config.txtNode);
      }
      if (/\b(outer)\b/.test(attr)) {
        oThis.appendChild(oThis.config.txtNode);
      }
    }
    //尺寸
    if (attr.match(/\[(\s*\d+(\.\d+)?)\s*,\s*(\d+(\.\d+)?)\s*\]/)) {
      oThis.config.offset = parseFloat(oThis.Limit(RegExp.$1));
      oThis.config.width = parseFloat(oThis.Limit(RegExp.$3));
    }
    oThis.ShowText(oThis.config.width);
    oThis.progress({ offset: oThis.config.offset, width: oThis.config.width });
    return oThis;
  };
})(jQuery);

//步骤 
!(function ($) {
  $.fn.extend({
    steps: function (json) {
      var o = this;
      if (o === undefined) {
        $.log(json.container + ' Not Found!');
        return;
      }
      if (o.stepData === undefined) {
        o.stepData = { container: '#steps', itemClass: 'step', currentClass: 'current', finishClass: 'finish', currentIndex: -1, before: null, after: null };
      }
      for (var k in json) {
        o.stepData[k] = json[k];
      }
      if (o.inited === true) {
        return o;
      }
      o.inited = true;
      //事件
      o.pre = function () {
        var self = $(this);
        var oItems = self.children('.' + this.stepData.itemClass);//所有步骤子项
        var index = this.stepData.currentIndex;//下标
        if (index === -1) {
          return this;//步骤在未开始
        }
        if (index !== oItems.length) {
          var oc = $(oItems[index]).removeClass(o.stepData.currentClass);
          var ocDs = oc.children('div');
          if ($.type(this.stepData.before) === 'function') {
            this.stepData.before(index, -1, ocDs[0], ocDs[1]);
          }
        }
        o.stepData.currentIndex = --index;
        if (index !== -1) {
          var oDs = $(oItems[index]).removeClass(this.stepData.finishClass).addClass(this.stepData.currentClass).children('div');//title+descript(可能没有)
          if ($.type(this.stepData.after) === 'function') {
            this.stepData.after(index/*下标 -1~length*/, -1/* -1:index-- 1:index++*/, oDs[0]/*title*/, oDs[1]/*descript*/);//回调
          }
        }

      };
      o.next = function () {
        var self = $(this);
        var oItems = self.children('.' + this.stepData.itemClass);//所有步骤子项
        var index = this.stepData.currentIndex;//下标
        if (index === oItems.length) {
          return this;//步骤已到头
        }
        if (index !== -1 && index !== oItems.length) {
          var oc = $(oItems[index]).removeClass(this.stepData.currentClass).addClass(this.stepData.finishClass);
          var ocDs = oc.children('div');
          if ($.type(this.stepData.before) === 'function') {
            this.stepData.before(index, 1, ocDs[0], ocDs[1]);
          }
        }
        this.stepData.currentIndex = ++index;
        if (index < oItems.length) {
          var oDs = $(oItems[index]).addClass(this.stepData.currentClass).children('div');//title+descript(可能没有)
          if ($.type(this.stepData.after) === 'function') {
            this.stepData.after(index/*下标 -1~length*/, 1, oDs[0]/*title*/, oDs[1]/*descript*/);//回调
          }
        }
        return this;
      };
      o.goto = function (index) {
        var self = $(this);
        var oItems = self.children('.' + this.stepData.itemClass);
        for (var i = 0; i < oItems.length; i++) {
          var addClass = i < index ? this.stepData.finishClass : (i === index ? this.stepData.currentClass : '');
          $(oItems[i]).removeClass(this.stepData.currentClass + ' ' + this.stepData.finishClass).addClass(addClass);
        }
      };
      o.goto(o.stepData.currentIndex);
      return o;
    }
  });
})(jQuery);
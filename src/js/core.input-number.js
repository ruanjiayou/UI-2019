/**
作者：max
时间：2017-3-13 17:06:44
说明：通过属性钩子来确定html结构
      核心数值处理函数与callback可以灵活自定义
**/
!(function () {
  //核心数值处理函数 可自定义传入
  function core(v) {
    v = parseInt(v);
    if (isNaN(v)) {
      v = 1;
    }
    return v;
  }
  //数值计算处理函数 需call input保证this指向
  function operation(type) {
    var d = this.d,
      tnumber = d.core(this.value);
    if (isNaN(tnumber)) {
      tnumber = d.min;
    }
    tnumber = (type === -1) ? tnumber - d.step : tnumber + d.step;
    return tnumber;
  }
  //有效性和边界处理 this 要指向 input
  function limit(v) {
    var d = this.d,//参数
      tnumber,
      minus,
      plus;
    if (v) {
      tnumber = v;
    }
    else {
      tnumber = d.core(this.value);
    }
    //UI样式
    minus = $(this.parentNode).find(d.minusSelector).removeClass(d.disableClass);
    plus = $(this.parentNode).find(d.plusSelector).removeClass(d.disableClass);
    if (isNaN(tnumber)) {
      tnumber = d.min;
    }
    if (tnumber <= d.min) {
      tnumber = d.min;
      minus.addClass(d.disableClass);
    }
    if (tnumber >= d.max) {
      tnumber = d.max;
      plus.addClass(d.disableClass);
    }
    this.value = tnumber;
    //回调函数
    if (d.callback) {
      d.callback.call(this, this.value);
    }
    return this;
  }
  //初始化
  function InputNumber(selector, json) {
    //参数处理
    var defaultJson =
    {
      step: 1,    //默认加减的步长为1
      min: 1,     //默认最小值为1,设置参数时min不能小于0
      max: 99999,  //默认最大值为99999,设置参数时max不能小于min
      disableClass: 'disabled',
      minusSelector: 'label[data-role="minus"]',//减按钮的默认选择器
      plusSelector: 'label[data-role="plus"]',   //加按钮的默认选择器
      inputSelector: 'input[data-role="number"]',       //inputd的默认选择器
      callback: null
    },
      k,
      oInput,
      o,
      input,
      plusBtn,
      minusBtn;
    defaultJson.core = core;
    for (k in json) {
      defaultJson[k] = json[k];
    }
    //节点与绑定事件
    o = $(selector);
    input = o.children(defaultJson.inputSelector);
    plusBtn = o.children(defaultJson.plusSelector);
    minusBtn = o.children(defaultJson.minusSelector);
    if ($.type(selector) === 'string') {
      o = $(selector);
    }
    else if ($.type(selector.length) === 'number') {
      o = selector;
    }
    else {
      o = $(selector);
    }
    if (input.length === 0) {
      $.log('input加减没有取到input！');
      return;
    }
    oInput = input.get(0);
    oInput.d = defaultJson;
    limit.call(oInput);
    o.bind('selectstart', function () { return false; });
    //减事件
    minusBtn.click(function () {
      if ($(this).hasClass(oInput.d.disableClass)) {
        return;
      }
      limit.call(oInput, operation.call(oInput, -1));
    });
    //加事件
    plusBtn.click(function () {
      if ($(this).hasClass(oInput.d.disableClass)) {
        return;
      }
      limit.call(oInput, operation.call(oInput, 1));
    });
    //键盘按键处理
    input.bind('keyup', function (e) {
      //小键盘0-9 96-105 功能键下方0-9 48-57 e.keyCode 8 13 35-40
      if (e.keyCode === 8 || (e.keyCode <= 40 && e.keyCode >= 35)) {
        return;
      }
      limit.call(this);
    });
    //keyup没有对退格键做处理
    input.bind('blur', function () {
      limit.call(this);
    });
    //设置value 不会触发callback
    oInput.SetValue = function (v) {
      return limit.call(this, v);
    };
    return oInput;
  }
  //函数取别名
  window.initNumberInput = InputNumber;
  $.fn.extend({
    input: {
      number: function (json) {
        this.each(function () {
          InputNumber.call(this, json);
        });
      }
    }
  });
})();
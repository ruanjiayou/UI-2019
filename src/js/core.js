/**
 * @description core.js
 * @time 2017-3-11 23:15:41
 */
/*
对基本常用的方法封装
.Browser  变量
.Event    变量
.Cookie   变量
.type     函数
.node     函数
.url
处理url中的参数
兼容低版本IE不支持origin
url介绍：
    协议://用户名:密码@子域名.域名.顶级域名:端口号/目录/文件名.文件后缀?参数=值#标志
    协议：http(s) ftp file mailto telnet等
.css
.toast    直接效果
.loading  直接效果
2017-3-14 09:04:42 
    有个想法：所有的字面量、单独方法都挂到 Core空间中
                getType()
                version
                browser
                os
                cookie .....
                event ......
              Sheet前面要加C
2017-3-15 16:53:03
    js4ie还是自己手动加比较好 毕竟相对路径不一样 本地测试不能用相对根路径
2017-8-6 22:28:44
    基于jQuery 但保证无jQuery时基本没问题(工具函数)
*/
// Android阻止微信自动放大字体 不如 max-height: 9999px;
/*
;(function() {
    if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
        handleFontSize();
    } else {
        if (document.addEventListener) {
            document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
        } else if (document.attachEvent) {
            document.attachEvent("WeixinJSBridgeReady", handleFontSize);
            document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
        }
    }

    function handleFontSize() {
        // 设置网页字体为默认大小
        WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 });
        // 重写设置网页字体大小的事件
        WeixinJSBridge.on('menu:setfont', function() {
            WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 });
        });
    }
})();
*/
//$处理 extend方法
!(function () {
  //获取变量类型 -m 可以直接用jQuery中的 $.type()方法
  var getType = function (o) {
    var _t;
    return ((_t = typeof (o)) === 'object' ? o === null && 'null' || Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase();
  };
  function v() {
    return v.fn.init();
  }
  //工具类函数
  if (getType(window.$) !== 'function') {

    v.fn = v.prototype = {
      //扩展的原型对象
      init: function () {               // 在初始化原型方法中返回实例的引用  
        this.length = 0;
        return this;
      }
    };
    window.$ = window.jQuery = v;
    v.fn.init.prototype = v.fn = v.prototype;
    $.type = getType;
    $.extend = function () {
      var arg = Array.prototype.slice.call(arguments),
        op,
        i,
        k;
      switch ($.type(arg[0])) {
        case 'object':
          op = arg.length === 1 ? $ : arg.shift();
          for (i = 0; i < arg.length; i++) {
            for (k in arg[i]) {
              op[k] = arg[i][k];
            }
          }
          break;
        default: break;
      }
    };
    $.fn.extend = function (o) {
      for (var k in o) {
        this[k] = o[k];
      }
    };
  }
}());
//
/**
* console.log方法封装
* @static
* @description ie有时候不支持原生log，会报错
*/
!(function ($) {
  $.extend({
    log: function (o) {
      try {
        /*eslint-disable */
        console.log(o);
        /*eslint-enable */
      }
      catch (e) {
        alert('不支持log!');
      }
    }
  });
}(jQuery));

/**
* 浏览器检测
* @static
* @description 返回一个浏览器信息对象 包括version和browser
*/
!(function ($) {
  //浏览器检测
  var Browser = {
    init: function () {
      this.browser = this.searchString(this.dataBrowser) || 'An unknown browser';
      this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || 'an unknown version';
      this.OS = this.searchString(this.dataOS) || 'an unknown OS';
    },
    searchString: function (data) {
      var i = 0,
        dataString,
        dataProp;
      for (i = 0; i < data.length; i++) {
        dataString = data[i].string,
          dataProp = data[i].prop;
        this.versionSearchString = data[i].versionSearch || data[i].identity;
        if (dataString) {
          if (dataString.indexOf(data[i].subString) !== -1) {
            return data[i].identity;
          }
        }
        else if (dataProp) {
          return data[i].identity;
        }
      }
    },
    searchVersion: function (dataString) {
      var index = dataString.indexOf(this.versionSearchString);
      if (index === -1) {
        return;
      }
      return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },
    dataBrowser: [
      {
        string: navigator.userAgent,
        subString: 'Chrome',
        identity: 'Chrome'
      },
      {
        string: navigator.userAgent,
        subString: 'OmniWeb',
        versionSearch: 'OmniWeb/',
        identity: 'OmniWeb'
      },
      {
        string: navigator.vendor,
        subString: 'Apple',
        identity: 'Safari',
        versionSearch: 'Version'
      },
      {
        prop: window.opera,
        identity: 'Opera'
      },
      {
        string: navigator.vendor,
        subString: 'iCab',
        identity: 'iCab'
      },
      {
        string: navigator.vendor,
        subString: 'KDE',
        identity: 'Konqueror'
      },
      {
        string: navigator.userAgent,
        subString: 'Firefox',
        identity: 'Firefox'
      },
      {
        string: navigator.vendor,
        subString: 'Camino',
        identity: 'Camino'
      },
      {		// for newer Netscapes (6+)
        string: navigator.userAgent,
        subString: 'Netscape',
        identity: 'Netscape'
      },
      {
        string: navigator.userAgent,
        subString: 'MSIE',
        identity: 'Internet Explorer',
        versionSearch: 'MSIE'
      },
      {
        string: navigator.userAgent,
        subString: 'Gecko',
        identity: 'Mozilla',
        versionSearch: 'rv'
      },
      {		 // for older Netscapes (4-)
        string: navigator.userAgent,
        subString: 'Mozilla',
        identity: 'Netscape',
        versionSearch: 'Mozilla'
      }
    ],
    dataOS: [
      {
        string: navigator.platform,
        subString: 'Win',
        identity: 'Windows'
      },
      {
        string: navigator.platform,
        subString: 'Mac',
        identity: 'Mac'
      },
      {
        string: navigator.userAgent,
        subString: 'iPhone',
        identity: 'iPhone/iPod'
      },
      {
        string: navigator.platform,
        subString: 'Linux',
        identity: 'Linux'
      }
    ]
  };
  Browser.init();
  $.extend({
    browser: Browser
  });
  /*
  if(Browser.browser=="Internet Explorer" && Browser.version < 10){
      var js4ie = document.createElement("script");
      js4ie.src = "js4ie.js";
      document.getElementsByTagName("head")[0].appendChild(js4ie);
  }
  */
}(jQuery));
/**
* cookie相关操作
* @static
* @description init() setKey() getKey()
*/
!(function ($) {
  var Cookie = {
    data: {},
    init: function () {
      var cookieArr = document.cookie.split(';'),
        temp,
        i,
        s = '';
      for (i = 0; i < cookieArr.length; i++) {
        temp = cookieArr[i].split('=');
        s = temp[0].trim();
        if (s !== '') {
          this.data[temp[0].trim()] = temp[1];
        }
      }
      return this;
    },
    setKey: function (k, v) {
      switch (arguments.length) {
        case 1:
          if (typeof k === 'object') {
            for (var attr in k) {
              this.data[attr] = k[attr];
              document.cookie = attr + '=' + k[attr] + '; ';
            }
          }
          break;
        case 2:
          if (typeof k === 'string' && k !== '' && typeof v === 'string') {
            this.data[k] = v;
            document.cookie = k + '=' + v + '; ';
          }
          break;
        default: $.log('setKey函数参数不匹配！'); break;
      }
      return this;
    },
    getKey: function (k) {
      if (this.data[k] === undefined || this.data[k] === null) {
        return '';
      }
      else {
        return this.data[k];
      }
    },
    clearKey: function (k) {
      var exp = new Date();
      //exp.setTime(exp.getTime() + Days*24*60*60*1000);
      exp.setTime(exp.getTime() - 1);
      document.cookie = k + '=x;expires=' + exp.toGMTString();
      delete this.data[k];
      return this;
    }
  };
  $.extend({
    cookie: function () {
      return Cookie.init();
    }
  });
}(jQuery));
/**
* url操作封装
* @static
* @param {string} url - url地址
*/
!(function ($) {
  function CUrl(url) {
    this.mQueryString = {};
    this.url = url ? url : window.location.href;
    var a = this.url.indexOf('?'),
      b = this.url.indexOf('#'),
      str = '',
      i,
      Arr;
    if (b < 0) {
      b = this.url.length;
    }
    str = this.url.substring(a + 1, b);
    Arr = str.split('&');
    for (i = 0; i < Arr.length; i++) {
      a = Arr[i].split('=');
      if (a.length === 2 && a[0]) {
        if (/^(\d+\.)?\d+$/.test(a[1])) {
          a[1] = parseFloat(a[1]);
        }
        this.mQueryString[a[0]] = a[1];
      }
    }
  }
  CUrl.prototype.isUrl = function (v) {
    return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|\/|\?)*)?$/i.test(v);
  };
  CUrl.prototype.hasKey = function (key) {
    //if条件中 '' null undefined都会被隐式转为false
    if (key && this.mQueryString[key]) {
      return true;
    }
  };
  CUrl.prototype.getValue = function (key) {
    return this.mQueryString[key] || '';
  };
  CUrl.prototype.setValue = function () {
    //通过arguments来 可以是应json 也可以是两个字符串
    var kv = {}, key;
    if (arguments.length === 1) {
      kv = arguments[0];
    }
    else if (arguments[0]) {
      kv[arguments[0]] = arguments[1];
    }
    for (key in kv) {
      this.mQueryString[key] = kv[key];
    }
    return this;
  };
  CUrl.prototype.query = function (key) {
    return this.getValue(key);
  };
  //这个方法有必要？
  CUrl.prototype.toUrl = function () {
    //TODO
  };
  $.extend({
    url: function (url) {
      return new CUrl(url);
    }
  });
}(jQuery));

/**
* 下载文件
* @static
*/
!(function ($) {
  var t = {
    _isIE11: function () {
      var iev = 0,
        ieold = (/MSIE (\d+\.\d+);/.test(navigator.userAgent)),
        trident = !!navigator.userAgent.match(/Trident\/7.0/),
        rv = navigator.userAgent.indexOf('rv:11.0');

      if (ieold) {
        iev = Number(RegExp.$1);
      }
      if (navigator.appVersion.indexOf('MSIE 10') !== -1) {
        iev = 10;
      }
      if (trident && rv !== -1) {
        iev = 11;
      }

      return iev === 11;
    },
    _isEdge: function () {
      return /Edge\/12/.test(navigator.userAgent);
    },
    _getDownloadUrl: function (text) {
      var BOM = '\uFEFF',
        csvData;
      // Add BOM to text for open in excel correctly
      if (window.Blob && window.URL && window.URL.createObjectURL) {
        csvData = new Blob([BOM + text], { type: 'text/csv' });
        return URL.createObjectURL(csvData);
      } else {
        return 'data:attachment/csv;charset=utf-8,' + BOM + encodeURIComponent(text);
      }
    },
    has: function (browser) {
      if (browser === window.browser) {
        return window.version;
      }
      else {
        return false;
      }
    },
    download: function (filename, text) {
      var oWin, BOM, csvData, link, click_ev;
      if (this.has('Internet Explorer') && this.has('Internet Explorer') < 10) {
        // has module unable identify ie11 and Edge
        oWin = window.top.open('about:blank', '_blank');
        oWin.document.write('sep=,\r\n' + text);
        oWin.document.close();
        oWin.document.execCommand('SaveAs', true, filename);
        oWin.close();
      } else if (this.has('Internet Explorer') === 10 || this._isIE11() || this._isEdge()) {
        BOM = '\uFEFF',
          csvData = new Blob([BOM + text], { type: 'text/csv' });
        navigator.msSaveBlob(csvData, filename);
      } else {
        link = document.createElement('a');
        link.href = this._getDownloadUrl(text);
        link.target = '_blank';
        link.download = filename;
        document.body.appendChild(link);
        if (this.has('Safari')) {
          // # First create an event
          click_ev = document.createEvent('MouseEvents');
          // # initialize the event
          click_ev.initEvent('click', true /* bubble */, true /* cancelable */);
          // # trigger the evevnt/
          link.dispatchEvent(click_ev);
        } else {
          link.click();
        }
        document.body.removeChild(link);
      }
    }
  };
  $.extend({
    download: function (filename, txt) {
      t.download(filename, txt);
    }
  });
}(jQuery));

/**
* 将样式json生成为内联样式表
* @static
* @description 使用方式：<script>new CSheet().addCSSRulers({'.temp':'background-color: #ccc; color: #c00;'});</script>
*/
!(function ($) {
  /**
   * 增加样式表
   * @constructor
   * @param {object} rulers - 样式json
   * @param {object} win - 文档作用域
   * @returns {object} 样式表对象
  */
  function CSheet(rulers, win) {
    this.style = (function () {
      var doc = document,
        style;
      if (win) {
        doc = win.document;
      }
      style = doc.createElement('style');
      doc.getElementsByTagName('head')[0].appendChild(style);
      //style.appendChild(doc.createTextNode(''));/* For Safari */
      return style;
    })();
    this.sheet = this.style.styleSheet || this.style.sheet;
    if (rulers) {
      this.addCSSRulers(rulers);
    }
    return this;
  }
  CSheet.prototype.addCSSRulers = function (rulerJson) {
    for (var k in rulerJson) {
      this.addCSSRuler(k, rulerJson[k]);
    }
    return this;
  };
  CSheet.prototype.addCSSRuler = function (selector, ruler) {
    try {
      if (this.sheet.insertRule) {
        this.sheet.insertRule(selector + ' {' + ruler + '}', this.sheet.cssRules.length);
      }
      else if ('addRule' in this.sheet) {
        this.sheet.addRule(selector, ruler, -1);
      }
      return this;
    }
    catch (e) {
      $.log('浏览器无法识别这种样式：' + selector + ' ' + ruler);
    }

  };
  CSheet.prototype.empty = function () {
    return this;
  };
  $.extend({
    sheet: function (rulers, win) {
      return new CSheet(rulers, win);
    }
  });
}(jQuery));

/**
* 创建Node节点
* @static
* @since 2017-8-9 14:03:50
* @constructor
* @param {string} tag - 标签名
* @param {object} attrs - 属性json
* @returns {object} node节点
*/
!(function ($) {
  $.extend({
    createNode: function (tag, attrs, txt) {
      tag = tag.toLowerCase();
      var res = document.createElement(tag);
      $(res).attr(attrs);
      if ($.type(txt) === 'string') {
        if (tag === 'input' || tag === 'select' || tag === 'textarea') {
          res.value = txt;
        }
        else {
          //res.appendChild(document.createTextNode(txt));
          res.innerHTML = txt;
        }
      }
      return res;
    }
  });
}(jQuery));

//测试发现 IE edge中  window.event ? window.event.returnValue = false : e.preventDefault(); 有问题
//换成    e? e.preventDefault() : window.event.returnValue = false;
//可以绑定多个事件 IE7/8执行是倒着的 解决办法：handlers数组
var Event = {
  //绑定事件
  addEvent: function (o, type, fn) {
    var handler = fn;
    if (o.addEventListener) {
      o.addEventListener(type, handler, false);
    }
    else if (o.attachEvent) {
      handler = function () {
        fn.call(o);
      };
      o.attachEvent('on' + type, handler);
    }
  },
  //取消绑定
  delEvent: function (o, type, fn) {
    if (o.removeEventListener) {
      o.removeEventListener(type, fn, false);
    }
    else {
      if (o.detachEvent) {
        o.detachEvent('on' + type, fn);
      }
    }
  },
  //取消默认函数
  cancelDefault: function (e) {
    if (window.event) {
      window.event.returnValue = false;
    }
    else {
      e.preventDefault();
    }
  },
  //取消冒泡
  stopBubble: function (e) {
    if (window.event) {
      window.event.cancelBubble = true;
    }
    else {
      e.stopPropagation();
    }
  }
};

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

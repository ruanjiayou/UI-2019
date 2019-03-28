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
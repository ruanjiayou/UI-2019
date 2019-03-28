//获取变量类型 o.type() number/object/string/function
Object.prototype.type = function () {
  var _t;
  return ((_t = typeof (this)) === "object" ? this === null && "null" || Object.prototype.toString.call(this).slice(8, -1) : _t).toLowerCase();
};
// 清除两边的空格  
String.prototype.trim = function () {
  return this.replace(/(^\s*)|(\s*$)/g, '');
};
// 合并多个空白为一个空白  
String.prototype.ResetBlank = function () {
  var regEx = /\s+/g;
  return this.replace(regEx, ' ');
};
//字符串比较大小
String.prototype.compare = function (str) {
  let a = this.length, b = str.length, i = 0;
  for (i = 0; i < a && i < b; i++) {
    if (this.charCodeAt(i) !== str.charCodeAt(i))
      return this.charCodeAt(i) - str.charCodeAt(i);
  }
  return a - b;
}
// 保留数字  
String.prototype.GetNum = function () {
  return this.replace(/[^\d]/g, '');
};

// 保留中文  
String.prototype.GetCN = function () {
  var regEx = /[^\u4e00-\u9fa5\uf900-\ufa2d]/g;
  return this.replace(regEx, '');
};

// String转化为Number  
String.prototype.ToInt = function () {
  return isNaN(parseInt(this)) ? this.toString() : parseInt(this);
};

// 得到字节长度  
String.prototype.GetLen = function () {
  var regEx = /^[\u4e00-\u9fa5\uf900-\ufa2d]+$/;
  if (regEx.test(this)) {
    return this.length * 2;
  } else {
    var oMatches = this.match(/[\x00-\xff]/g);
    var oLength = this.length * 2 - oMatches.length;
    return oLength;
  }
};

// 获取文件全名  
String.prototype.GetFileName = function () {
  var regEx = /^.*\/([^\/\?]*).*$/;
  return this.replace(regEx, '$1');
};

// 获取文件扩展名  
String.prototype.GetExtensionName = function () {
  var regEx = /^.*\/[^\/]*(\.[^\.\?]*).*$/;
  return this.replace(regEx, '$1');
};

//替换所有
String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
  if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
    return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
  } else {
    return this.replace(reallyDo, replaceWith);
  }
};
//格式化字符串 add By 刘景宁 2010-12-09   
String.Format = function () {
  if (arguments.length == 0) {
    return '';
  }

  if (arguments.length == 1) {
    return arguments[0];
  }

  var reg = /{(\d+)?}/g;
  var args = arguments;
  var result = arguments[0].replace(reg, function ($0, $1) {
    return args[parseInt($1) + 1];
  });
  return result;
};
// 数字补零  
Number.prototype.LenWithZero = function (oCount) {
  var strText = this.toString();
  while (strText.length < oCount) {
    strText = '0' + strText;
  }
  return strText;
};

// Unicode还原  
Number.prototype.ChrW = function () {
  return String.fromCharCode(this);
};
//是否存在 [].has(1) [].has('') [].has({}) [].has(function(item){})
Array.prototype.has = function (item) {
  var i = this.length;
  switch (item.type()) {
    case 'object':
      let res = false;
      while (i--) {
        for (let k in item) {
          res = item[k] === this[i][k] ? true : false;
          if (res === false) break;
        }
        if (res) return res;
      }
      break;
    case 'function':
      while (i--) {
        if (true === item(this[i]))
          return true;
      }
      break;
    default: //string number
      while (i--) {
        if (this[i] === item)
          return true;
      }
      break;
  }
  return false;
};
//排序插入 console.log(['0','1','2','4'].insert('3'));  console.log([{href: '788', title:'a'},{href: '788/2', title: 'b'}].insert({href: '788/1', title: 'c'}, 'href'));
Array.prototype.insert = function (item, key) {
  var i = this.length;
  switch (item.type()) {
    case 'object':
      if (key.type() === 'string') {
        while (i--) {
          if (this[i][key].compare(item[key]) <= 0)
            break;
        }
      }
      break;
    case 'string':
      while (i--) {
        if (this[i].compare(item) <= 0)
          break;
      }
      break;
    default: break;
  }
  this.splice(++i, 0, item);
  return this;
};
// 数字数组由小到大排序  
Array.prototype.Min2Max = function () {
  var oValue;
  for (var i = 0; i < this.length; i++) {
    for (var j = 0; j <= i; j++) {
      if (this[i] < this[j]) {
        oValue = this[i];
        this[i] = this[j];
        this[j] = oValue;
      }
    }
  }
  return this;
};

// 数字数组由大到小排序  
Array.prototype.Max2Min = function () {
  var oValue;
  for (var i = 0; i < this.length; i++) {
    for (var j = 0; j <= i; j++) {
      if (this[i] > this[j]) {
        oValue = this[i];
        this[i] = this[j];
        this[j] = oValue;
      }
    }
  }
  return this;
};

// 获得数字数组中最大项  
Array.prototype.GetMax = function () {
  var oValue = 0;
  for (var i = 0; i < this.length; i++) {
    if (this[i] > oValue) {
      oValue = this[i];
    }
  }
  return oValue;
};

// 获得数字数组中最小项  
Array.prototype.GetMin = function () {
  var oValue = 0;
  for (var i = 0; i < this.length; i++) {
    if (this[i] < oValue) {
      oValue = this[i];
    }
  }
  return oValue;
};

// 获取当前时间的中文形式  
Date.prototype.GetCNDate = function () {
  var oDateText = '';
  oDateText += this.getFullYear().LenWithZero(4) + new Number(24180).ChrW();
  oDateText += this.getMonth().LenWithZero(2) + new Number(26376).ChrW();
  oDateText += this.getDate().LenWithZero(2) + new Number(26085).ChrW();
  oDateText += this.getHours().LenWithZero(2) + new Number(26102).ChrW();
  oDateText += this.getMinutes().LenWithZero(2) + new Number(20998).ChrW();
  oDateText += this.getSeconds().LenWithZero(2) + new Number(31186).ChrW();
  oDateText += new Number(32).ChrW() + new Number(32).ChrW() + new Number(26143).ChrW() + new Number(26399).ChrW() + new String('26085199682010819977222352011620845').substr(this.getDay() * 5, 5).ToInt().ChrW();
  return oDateText;
};

//1.冒泡排序  冒泡排序是最简单的排序算法， 冒泡排序的基本思想是从后往前（或从前往后）两两比较相邻元素的值，若为 逆序，则交换它们，直到序列比较完。我们称它为一趟冒泡。每一趟冒泡都会将一个元素放置到其最终位置上。
Array.prototype.BubbleSort = function () {
  var n = this.length;
  for (var i = 0; i < n; ++i)
    for (var j = n - 1; j > i; --j) {
      if (this[j] < this[j - 1]) {
        var tmp = this[j];
        this[j] = this[j - 1];
        this[j - 1] = tmp;
      }
    }
}
// 实现 ECMA-262, Edition 5, 15.4.4.19
// 参考: http://es5.github.com/#x15.4.4.19
if (!Array.prototype.map) {
  Array.prototype.map = function (callback, thisArg) {

    var T, A, k;

    if (this == null) {
      throw new TypeError(" this is null or not defined");
    }

    // 1. 将O赋值为调用map方法的数组.
    var O = Object(this);

    // 2.将len赋值为数组O的长度.
    var len = O.length >>> 0;

    // 3.如果callback不是函数,则抛出TypeError异常.
    if (Object.prototype.toString.call(callback) != "[object Function]") {
      throw new TypeError(callback + " is not a function");
    }

    // 4. 如果参数thisArg有值,则将T赋值为thisArg;否则T为undefined.
    if (thisArg) {
      T = thisArg;
    }

    // 5. 创建新数组A,长度为原数组O长度len
    A = new Array(len);

    // 6. 将k赋值为0
    k = 0;

    // 7. 当 k < len 时,执行循环.
    while (k < len) {

      var kValue, mappedValue;

      //遍历O,k为原数组索引
      if (k in O) {

        //kValue为索引k对应的值.
        kValue = O[k];

        // 执行callback,this指向T,参数有三个.分别是kValue:值,k:索引,O:原数组.
        mappedValue = callback.call(T, kValue, k, O);

        // 返回值添加到新数组A中.
        A[k] = mappedValue;
      }
      // k自增1
      k++;
    }

    // 8. 返回新数组A
    return A;
  };
}

//扩展Date格式化  
Date.prototype.Format = function (format) {
  var o = {
    "M+": this.getMonth() + 1, //月份           
    "d+": this.getDate(), //日           
    "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时           
    "H+": this.getHours(), //小时           
    "m+": this.getMinutes(), //分           
    "s+": this.getSeconds(), //秒           
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度           
    "S": this.getMilliseconds() //毫秒           
  };
  var week = {
    "0": "\u65e5",
    "1": "\u4e00",
    "2": "\u4e8c",
    "3": "\u4e09",
    "4": "\u56db",
    "5": "\u4e94",
    "6": "\u516d"
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(format)) {
    format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return format;
}
Date.prototype.Diff = function (interval, objDate) {
  //若参数不足或 objDate 不是日期类型則回传 undefined  
  if (arguments.length < 2 || objDate.constructor != Date) { return undefined; }
  switch (interval) {
    //计算秒差                                                          
    case 's': return parseInt((objDate - this) / 1000);
    //计算分差  
    case 'n': return parseInt((objDate - this) / 60000);
    //计算時差  
    case 'h': return parseInt((objDate - this) / 3600000);
    //计算日差  
    case 'd': return parseInt((objDate - this) / 86400000);
    //计算周差  
    case 'w': return parseInt((objDate - this) / (86400000 * 7));
    //计算月差  
    case 'm': return (objDate.getMonth() + 1) + ((objDate.getFullYear() - this.getFullYear()) * 12) - (this.getMonth() + 1);
    //计算年差  
    case 'y': return objDate.getFullYear() - this.getFullYear();
    //输入有误  
    default: return undefined;
  }
};

//检测是否为空  
Object.prototype.IsNullOrEmpty = function () {
  var obj = this;
  var flag = false;
  if (obj == null || obj == undefined || typeof (obj) == 'undefined' || obj == '') {
    flag = true;
  } else if (typeof (obj) == 'string') {
    obj = obj.trim();
    if (obj == '') {//为空  
      flag = true;
    } else {//不为空  
      obj = obj.toUpperCase();
      if (obj == 'NULL' || obj == 'UNDEFINED' || obj == '{}') {
        flag = true;
      }
    }
  }
  else {
    flag = false;
  }
  return flag;
}

//test trim()
var str1 = " 12ww ";
console.log(str1.trim());
//test ResetBlank
var str2 = "My   Name    is  ruan";
console.log(str2.ResetBlank());
//test GetNum
var str3 = "123ww";
console.log(str3.GetNum());

var test = (function (a) {
  this.a = a;
  return function (b) { return this.a + b; }
}(function (a, b) { return a; }(1, 2)));
console.log(test(4));

var a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], sign = 1;
a.sort(function (a, b) {
  sign = (Math.random() > 0.5) ? 1 : -1;
  return sign;
});
console.log(a);

var a = Array(100).join(",").split(",").map(function (item, index) {
  return index;
});
console.log(a);
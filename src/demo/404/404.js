function Sheet(rulers) {
  this.style = (function () {
    var style = document.createElement("style");
    document.getElementsByTagName("head")[0].appendChild(style);
    //style.appendChild(document.createTextNode(""));/* For Safari */
    return style;
  })();
  this.sheet = this.style.styleSheet || this.style.sheet;;
  if (rulers) this.addCSSRulers(rulers);
  return this;
}
Sheet.prototype.addCSSRulers = function (rulerJson) {
  for (var k in rulerJson)
    this.addCSSRuler(k, rulerJson[k]);
  return this;
}
Sheet.prototype.addCSSRuler = function (selector, ruler) {
  if (this.sheet.insertRule)
    this.sheet.insertRule(selector + " {" + ruler + "}", this.sheet.cssRules.length);
  else if ("addRule" in this.sheet)
    this.sheet.addRule(selector, ruler, -1);
  return this;
}
Sheet.prototype.empty = function () {
  return this;
}
//创建Node节点
function NewObject(tag, attrs, txt) {
  var res = document.createElement(tag);
  if (attrs != null)
    for (var k in attrs) {
      if (k == "className") {
        res.className = attrs[k];
        continue;
      }
      if (typeof attrs[k] == "object" && k == "style");//$(res).css(attrs[k]);
      else res.setAttribute(k, attrs[k]);//$(res).attr(k, attrs[k]);
    };
  if (txt != null) {
    if (tag == "input" || tag == "select" || tag == "textarea")
      res.value = txt;
    else
      res.appendChild(document.createTextNode(txt));
  }
  return res;
}
window.onload = function () {
  //1.插入样式
  new Sheet({
    "html": "background-color: #f3f3f3; color: #888; display: table; font-family: Helvetica, 'Helvetica Neue', Arial, sans-serif; height: 100%; width: 100%;",
    "body": " display: table-cell; vertical-align: middle; margin: 2em auto;",
    "button": "font-size: 16px; padding: 6px 10px; border: none; border-radius: 2px; min-width: 80px; background-color: #009a61; text-align: center; color: #fff; cursor: pointer;",
    "button:hover,button:active": "background-color: #008151;",
    ".box": "margin: -100px auto 0; padding: 40px; background-color: #fff; width: 540px;",
    ".figure": "float: right; line-height: 0;margin: 0;",
    ".footer": "margin: 15px 0 0; color: #999; text-transform: uppercase; font-size: 13px;",
    ".footer a": "color: #999; text-decoration: none;",
    ".footer a:hover": "color: #999;text-decoration:underline;",
    ".txt-center": "text-align: center;",
    ".clearfix:before, .clearfix:after": "content: '';display: table",
    ".clearfix:after": "clear: both;"
  });
  //2.插入HTML
  //var odiv = NewObject("div",{"className": "toast hidden"});
  //odiv.appendChild(NewObject("div"));
  //document.body.appendChild(odiv);
  ////3.绑定事件
  //odiv.addEventListener('animationend', function(){
  //    this.className = this.className.replace(/\b(fadeout)\b/,"")+" hidden";
  //});
  ////提供接口API
  //window.ShowToast = function(txt,fn){
  //    var oc = odiv.getElementsByTagName("div")[0];
  //    if(txt){
  //        oc.innerHTML = txt;
  //    }
  //    if(/\b(fadeout)\b/.test(odiv.className)==false) odiv.className = odiv.className.replace(/\bhidden\b/,"")+" fadeout";
  //    if(txt && fn) fn();
  //}
}
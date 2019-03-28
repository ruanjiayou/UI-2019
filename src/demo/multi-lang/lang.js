window.langLib = {
  'zh-cn': {
    'page-title': '多语言测试网站',
    'app-title': '手电筒APP',
    'app-intro': '这是一款非常实用的APP，手电筒，闪光，SOS',
    'app-user': '开发者：哈乐沃德',
  },
  'en': {
    'page-title': 'Multi language test site',
    'app-title': 'flash light App',
    'app-intro': 'This is a functional app, flash light ,sos',
    'app-user': 'Developer: Hello world',
  }
}


function langTest(lang) {
  var lang = lang || 'en';
  var tranLib = langLib[lang];

  var container = $('#lang-test');
  var text = container.html();
  var returnText = text;

  var reg = new RegExp('\\{\\{\(.*?)\\}\\}', 'ig');
  //var match=reg.exec(text);
  while ((match = reg.exec(text)) != null) {
    var langAttr = match[1] || '';
    var langStr = tranLib[langAttr] || '';
    returnText = returnText.replace('{{' + langAttr + '}}', langStr);
    //console.log(match);
  }
  container.html(returnText);
  //console.log(match);


}


function langSwitch(lang) {
  var lang = lang || 'en';
  var langItems = $('[il8]');
  var tranLib = langLib[lang];

  langItems.each(function () {
    var
      _this = $(this),
      il8 = _this.attr('il8');

    var langAttr = tranLib[il8] || '';
    _this.text(langAttr);
  })
}

//module
langMo = (function () {


}())

function langDetect() {
  var naviLan = navigator.language;
  lan = naviLan.toLowerCase();
  console.log(lan);
  if (!langLib[lan]) {
    return 'en';
  }
  return lan;
}

$(function () {
  langTest();
  langSwitch(langDetect());

})
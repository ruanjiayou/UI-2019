/**
时间：2017-4-7 11:00:03
说明：先拿来用吧 只依赖jQuery
      2017-4-15 20:41:28 默认用的 window.top 是大问题 dlgCate变量无法访问了
      样式也丢失 default中要补上 还有 依赖所有样式~~ 只是功能和样式无关！
      2017-4-17 14:52:44 开始修改
      2017-4-17 17:31:21 修改完成
**/
/*
参数说明
    title 对话框标题(默认"提示")
    window 新增参数
    size 对话框尺寸(默认{width:400,height:300})
    node  对话框内容(传入#id/.class/ElementNode)
    url  不为空node就是iframe
    draggable 对话框是否可以拖动(默认false)
    autoresize 响应窗口自动调整(默认true)
    PreOpen 打开对话框前执行的函数(默认null)
    Closed  关闭对话框后执行的函数(默认null)
    AfterConfirm 确认后执行的函数(默认null)
*/
//对话框
!(function () {
  /**
   * 对话框插件
   * @constructor 
   * @param {object} json - 配置项
   * @returns {object} 对话框实例
   * 
  */
  function Dialog(json) {
    var obj = {
      //背景遮罩div节点
      oMask: null,
      //对话框框架盒子
      oDialogBox: null,
      //对话框标题
      oTitle: null,
      oTitleText: null,
      //对话框关闭按钮
      oClose: null,
      oView: null,
      //窗口尺寸
      oSize: { x: 0, y: 0, width: 400, height: 300 },
      //鼠标按下时距离对话框左上角的位置
      p2corner: { x: 0, y: 0 },
      //用于获取节点，并转为闭包节点
      D: function (v) {
        if (typeof v === 'string') {
          this.node = $(v)[0];
        }
        else {
          this.node = v;
        }
        return this.node;
      },
      Init: function (json) {
        var _json =
        {
          selector: '',
          title: '标题',
          url: '',
          window: window,
          size: { width: 400, height: 300 },
          draggable: true, //对话框是否可拖拽标记
          autoresize: true,//是否响应页面调整事件
          PreOpen: null,   //事件回调
          Closed: null,    //事件回调
          AfterConfirm: null//事件回调
        },
          k;
        for (k in json) {
          _json[k] = json[k];
        }
        for (k in _json) {
          this[k] = _json[k];
        }
        this.oMask = this.D($.createNode('div', { 'data-dialog': 'mask' }));

        //1.对话框框架层
        this.oDialogBox = this.D($.createNode('div', { 'data-dialog': 'dialog' }));
        this.oDialogBox.onselectstart = function () { return false; };
        //2.标题和关闭按钮层
        this.oTitle = this.D($.createNode('h2', { 'data-dialog': 'title' }));
        this.oTitleText = $.createNode('div', { 'className': 'txt-omit' }, this.title);
        this.oTitle.appendChild(this.oTitleText);
        this.oDialogBox.appendChild(this.oTitle);
        this.oClose = this.D($.createNode('div', { 'data-dialog': 'close' }));
        this.oDialogBox.appendChild(this.oClose);
        $(this.oClose).bind('click', function () { obj.Close(); });
        //3.对话框视图view层
        this.oView = this.D($.createNode('div', { 'data-dialog': 'view' }));
        this.oDialogBox.appendChild(this.oView);
        if (this.draggable === true) {
          $(this.oTitle).bind('mousedown', this.MouseDown);
        }
        else {
          $(this.oTitle).unbind('mousedown', this.MouseDown);
        }
        //窗口调整事件
        $(this.window).bind('resize', function () { obj.Center(); });
      },
      Open: function (json) {
        $.log(new Date().getTime());
        for (var k in json) {
          this[k] = json[k];
        }
        //主要用于打开窗口前的设置宽高 对话框样式
        if (this.PreOpen !== null) {
          this.PreOpen();
        }
        //换成.html().append() 会丢失事件
        this.oTitleText.innerHTML = this.title;
        $(this.oDialogBox).css('opacity', 0).animate({ 'opacity': 1 });
        $(this.window.document.body).append(this.oMask).append(this.oDialogBox);
        //this.oView.innerHTML = '';
        if (this.selector === '') {
          this.oView.appendChild($.createNode('iframe', { 'data-dialog': 'iframe', 'src': this.url, 'frameborder': 0 }));
        }
        else {
          $(this.oView).append($(this.selector));
        }
        //4.设置尺寸
        this.SetSize(this.size);
        this.Center();
        this.window.CloseDialog = function (isConfirm) { obj.Close(isConfirm); };
      },
      //设置窗口尺寸：大小和位置
      SetSize: function (rect) {
        for (var k in rect) {
          this.oSize[k] = rect[k];
        }
        $(this.oDialogBox).css({ 'left': this.oSize.x + 'px', 'top': this.oSize.y + 'px', 'width': this.oSize.width + 'px' });
        $(this.oView).css({ 'height': (this.oSize.height - this.oTitle.offsetHeight) + 'px' });
      },
      Center: function () {
        var winW = this.window.innerWidth ? this.window.innerWidth : this.window.document.documentElement.clientWidth,
          winH = this.window.innerHeight ? this.window.innerHeight : this.window.document.documentElement.clientHeight;
        this.oSize.x = (winW - this.oSize.width) / 2;
        this.oSize.y = (winH - this.oSize.height) / 2;
        this.Limit();
      },
      MouseDown: function (e) {
        var x = e.x ? e.x : e.pageX,
          y = e.y ? e.y : e.pageY,
          od = obj.window.document,
          odiv = $.createNode('div', { 'style': 'position: absolute;left:0;top:0;width:100%;height:100%;' });
        obj.oView.appendChild(odiv);
        //x += od.documentElement.scrollLeft;
        //y += od.documentElement.scrollTop;
        obj.p2corner.x = x - parseInt(obj.oDialogBox.style.left);
        obj.p2corner.y = y - parseInt(obj.oDialogBox.style.top);
        //计算按下鼠标时以对话框左上角为原点 鼠标点击位置的坐标
        $(od).bind('mousemove', obj.Move);
        $(od).bind('mouseup', function () {
          obj.oView.removeChild(odiv);
          var op = this.callee;
          $(od).unbind('mousemove', obj.Move);
          $(od).unbind('mouseup', op);
          od.onmousemove = null;
          od.onmouseup = null;
        });
      },
      Move: function (e) {
        //var win = obj.window;
        var screen_x = e.x ? e.x : e.pageX,
          screen_y = e.y ? e.y : e.pageY,
          sl = 0,
          st = 0,
          t = obj.window,
          newleft,
          newtop;
        while (t !== t.parent) {
          sl += t.document.documentElement.scrollLeft;
          st += t.document.documentElement.scrollTop;
          t = t.parent;
        }
        newleft = sl + screen_x - obj.p2corner.x;
        newtop = st + screen_y - obj.p2corner.y;
        //var windowW = win.innerWidth ? win.innerWidth : win.document.documentElement.clientWidth;
        //var windowH = win.innerHeight ? win.innerHeight : win.document.documentElement.clientHeight;
        obj.oSize.x = newleft;
        obj.oSize.y = newtop;
        obj.Limit();
      },
      Limit: function () {
        //标题必须在窗口内
        var winW = obj.window.innerWidth ? obj.window.innerWidth : obj.window.document.documentElement.clientWidth,
          winH = obj.window.innerHeight ? obj.window.innerHeight : obj.window.document.documentElement.clientHeight;
        if (obj.oSize.x < 0) {
          obj.oSize.x = 0;
        }
        if (obj.oSize.y < 0) {
          obj.oSize.y = 0;
        }
        if (obj.oSize.x + 40 > winW) {
          obj.oSize.x = winW - 40;
        }
        if (obj.oSize.y + 40 > winH) {
          obj.oSize.y = winH - 40;
        }
        $(obj.oDialogBox).css({ 'left': obj.oSize.x + 'px', 'top': obj.oSize.y + 'px' });
      },
      Close: function (isConfirm) {
        //1 关闭对话框前的操作
        //if (this.Closing) this.Closing();
        //3 关闭对话框后的操作：callback 如关闭虚拟键盘
        if (this.Closed) {
          this.Closed(isConfirm);
        }
        //2 关闭对话框：body滚动条还原，遮罩层隐藏，对话框不可见，解除绑定
        this.oMask.parentNode.removeChild(this.oMask);
        this.oDialogBox.parentNode.removeChild(this.oDialogBox);
        this.window.CloseDialog = null;
      }
    };
    obj.Init(json);
    return obj;
  }
  $.extend({
    dialog: Dialog
  });
  //对话框样式
  $.sheet({
    '[data-dialog="mask"]': 'position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: #000; filter: alpha(opacity=38); opacity: 0.38; z-index: 3;',
    '[data-dialog="dialog"]': 'position: fixed; left: 100%; border-radius: 5px; background-color: #fff; z-index: 15;',
    '[data-dialog="title"]': 'position: relative; height: 50px; line-height: 50px; margin: 0; padding-left: 10px; padding-right: 40px; border-top-left-radius: 5px; border-top-right-radius: 5px; background-color: #096; color: #fff; cursor: pointer; font-size: 16px; font-weight: 400;-moz-user-select: none;-webkit-user-select: none; -ms-user-select: none;-khtml-user-select: none; user-select: none;',
    '[data-dialog="close"]': 'position: absolute; right: 0; top: 0; width: 25px; height: 25px; margin-top: 12px; margin-right: 12px; background: url(/images/dialog-close.png) center center no-repeat; cursor: pointer;',
    '[data-dialog="close"]:hover': 'background-image: url(/images/dialog-close-hover.png);',
    '[data-dialog="view"]': 'position: relative; overflow: hidden;',
    '[data-dialog="iframe"]': 'position: absolute; width: 100%; height: 100%; overflow: hidden;'
  });
}());
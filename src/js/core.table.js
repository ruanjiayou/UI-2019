/**
作者：max
时间：2017-7-4 12:00:30
说明：table增加简单的sort功能 如果有需要自己修改这个文件
      .caret 代表是有排序的 desc是默认的降序 asc是升序
      2017-7-17 14:23:31 增加控制显示列
                         后台加载所有column、前端初始化单选复选
                         依赖单选复选js
      2017-7-18 10:13:23  排序碰到获取不到caret的情况 $('<span class="caret desc"></span>')
      根据th的data-column生成显示列列表 (自动disable 如 序号、操作列)
      2017-7-18 15:03:26
        控制显示列的格式 字段列表 html中写好 不用后台生成
        tpl字符串挂在table上
        name和data-column属性必须有！
        立即执行函数传入了 jQuery和initRadioCheck
**/
//table表头排序
!(function () {
  $.extend(true, {
    table: {
      sort: function (config) {
        var headers = $(config.selector).children('th');
        if (config.param.OrderBy) {
          headers.parent().find('[data-column="' + config.param.OrderBy + '"]').append(headers.find('.caret').attr('class', config.param.OrderMethod === 'asc' ? 'caret asc' : 'caret desc'));
        }
        //切换排序字段和方式
        headers.click(function () {
          var self = $(this),
            descend = false,                     //排序方式
            caret = self.parent().find('.caret'),//排序符号
            column = self.attr('data-column');   //排序字段
          if (void (0) === column) {
            return;
          }
          if (self.children('.caret').length === 0) {
            self.append(caret.attr('class', 'caret desc'));
          }
          else {
            descend = caret.hasClass('desc');
            caret.removeClass('asc desc').addClass(descend ? 'asc' : 'desc');
          }
          if (config.callback) {
            config.callback(column, descend ? 'asc' : 'desc');
          }
        });
      }
    }
  });
})();

//table字段显示控制
!(function ($) {
  function drag(o, table) {
    function getMousePos(e) {
      return {
        x: e.pageX || e.clientX + $(document).scrollLeft(),
        y: e.pageY || e.clientY + $(document).scrollTop()
      };
    }
    //获取元素位置 
    function getElementPos(el) {
      return {
        x: el.offsetParent ? el.offsetLeft + arguments.callee(el.offsetParent)['x'] : el.offsetLeft,
        y: el.offsetParent ? el.offsetTop + arguments.callee(el.offsetParent)['y'] : el.offsetTop
      };
    }
    //获取元素尺寸 

    function getElementSize(el) {
      return {
        width: el.offsetWidth,
        height: el.offsetHeight
      };
    }
    //禁止选择 
    document.onselectstart = function () {
      return false;
    };
    //判断是否有挪动 
    var MOVE = {};
    MOVE.isMove = false;

    //就是创建的标杆 
    var div = $.createNode('div', { 'style': 'width:100%;border-bottom: 1px solid red;' });

    o.onmousedown = function (event) {
      //获取列表顺序 
      var lis = o.getElementsByTagName('li');
      for (var i = 0; i < lis.length; i++) {
        lis[i]['pos'] = getElementPos(lis[i]);
        lis[i]['size'] = getElementSize(lis[i]);
      }
      event = event || window.event;
      var t = event.target || event.srcElement;
      if (t.tagName.toLowerCase() === 'a') {
        t = t.parentNode;
      }
      if (t.tagName.toLowerCase() === 'li') {
        var p = getMousePos(event);
        var el = t.cloneNode(true);
        $(el).css({ 'position': 'absolute', 'left': t.pos.x + 'px', 'top': t.pos.y + 'px', 'width': t.size.width + 'px', 'height': t.size.height + 'px', 'border': '1px solid #d4d4d4', 'background': '#d4d4d4', 'opacity': 0.7, 'z-index': 99, 'cursor': 'move' });
        document.body.appendChild(el);

        document.onmousemove = function (event) {
          event = event || window.event;
          var current = getMousePos(event);
          el.style.left = t.pos.x + current.x - p.x + 'px';
          el.style.top = t.pos.y + current.y - p.y + 'px';
          //document.body.style.cursor = 'move';
          //判断插入点 
          for (var i = 0; i < lis.length; i++) {
            if (current.y > lis[i]['pos']['y'] && current.y < lis[i]['pos']['y'] + lis[i]['size']['height'] / 2) {
              if (t !== lis[i]) {
                MOVE.isMove = true;
                o.insertBefore(div, lis[i]);
              }
            } else if (current.y > lis[i]['pos']['y'] + lis[i]['size']['height'] / 2 && current.y < lis[i]['pos']['y'] + lis[i]['size']['height']) {
              if (t !== lis[i]) {
                MOVE.isMove = true;
                o.insertBefore(div, lis[i].nextSibling);
              }
            }
          }
        };
        //移除事件 
        document.onmouseup = function () {
          event = event || window.event;
          //document.body.style.cursor = '';
          document.onmousemove = null;
          if (MOVE.isMove) {
            o.replaceChild(t, div);
            MOVE.isMove = false;
            move(o, table);
          }
          document.body.removeChild(el);
          el = null;
          document.onmouseup = null;
        };
      }
    };
  }
  //渲染数据
  function render(data) {
    var oHeader = $(this).find('.header').get(0);
    var oTBody = $(this).find('tbody').get(0);
    while (oTBody.firstChild) {
      oTBody.removeChild(oTBody.firstChild);
    }
    oTBody.appendChild(oHeader);
    $(this).find('tbody').append($.template(this.tpl).render(data));
  }
  //移动字段顺序
  function move(oul, otable) {
    var otr = $(otable).find('tr');
    $(oul).find('input').each(function () {
      var column = $(this).attr('name');
      var index = -1;
      if (column) {
        otr.first().children('th').each(function (_index) {
          if (column === $(this).attr('data-column')) {
            index = _index;
            this.parentNode.appendChild(this);
          }
        });
        otr.each(function () {
          $(this).append($(this).children('td:eq(' + index + ')'));
        });
      }
    });
  }
  //动态修改模板
  function dealTpl(tpl, index, isShow) {
    var op = $(tpl);
    op.children('td:eq(' + index + ')').css('display', isShow ? '' : 'none');
    return op.prop('outerHTML');
  }
  $.extend(true, {
    table: {
      setColumn: function (param) {
        //selector, ctrl
        var oCtrl = $(param.ctrl);
        var o = $(param.selector)[0];
        if (o === undefined) {
          return;
        }
        //拖拽移动列
        drag(oCtrl[0], o);
        o.tpl = param.tpl || o.tpl || '';
        o.render = function (data, callback) {
          render.call(this, data);
          if (callback) {
            callback.call(this);
          }
        };
        //下拉框上可以一直点击
        oCtrl.click(function (e) {
          e.stopPropagation();
        });
        oCtrl.find('[type="checkbox"]').iCheck(function (e, imp) {
          imp = $(imp);
          var index = $(this).parents('ul').find('label').index(this);
          var isShow = imp.is(':checked');
          //修改tpl
          o.tpl = dealTpl(o.tpl, index, isShow);
          //显示隐藏
          $(o).find('colgroup,tr').each(function () {
            $(this).children(':eq(' + index + ')').css('display', isShow ? '' : 'none');
          });
        });
      }
    }
  });
})(jQuery);

//table模板引擎
!(function ($) {
  function Template(tpl) {
    this.tpl = tpl;
    this.reg = /\{\{([0-9a-zA-Z]+)\}\}/g;
    return this;
  }
  Template.prototype.setTpl = function (tpl) {
    this.tpl = tpl;
  };
  Template.prototype.render = function (data) {
    var i = 0,
      m,
      res = '',
      temp;
    if (!data.length) {
      data = [data];
    }
    for (; i < data.length; i++) {
      temp = this.tpl;
      while ((m = this.reg.exec(this.tpl)) !== null) {
        temp = temp.replace(m[0], (data[i][m[1]] ? data[i][m[1]] : ''));
      }
      res += temp;
    }
    return res;
  };
  $.extend({
    template: function (tpl) {
      return new Template(tpl);
    }
  });
})(jQuery);
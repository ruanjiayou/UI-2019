/**
时间：2017-3-30 19:42:35
说明：分页样式
      JSON.parse 遵循严格的json规范
      pagination(".pagination");
      修改url默认传参 低版本IE需要依赖core.url.js
      2017-4-24 10:58:52 data-role改为role h5是有role属性的
      2017-4-27 12:02:40 data-*才是自定义属性 ！
      2017-5-3 11:21:25  增加query和sort部分
      2017-7-5 16:11:48  增加pagination-list
      2017-7-6 13:39:24  gotoPage 去掉 增加 createURL
                         到底是否要a的href中写url 有利于SEO 语义好 那爬虫的负载有点重 链接就应该是可以右键可以拖拽打开的！！！
                         高看了映射 其实不需要；href还是有需要的 排序查询搜索 都要用 buildQuery href不需要 init 后 无需事件
      2017-7-6 14:18:20  参考 立即执行函数传入jQuery对象
                         使用$.extend
                         返回 new的对象 this中可存信息
                         取消映射
                         {}是引用类型
                         config conf数据是一致的 参数字段是固定的 要改自己一起改
                         gotoPage 改为接受json参数 增加q查询字段
                         self 换为 that
    2017-8-3 15:30:16
    
**/
!(function ($) {
  //传入页码自动构建url
  pagination.prototype.createURL = function (pageNum) {
    var url = window.location.origin + window.location.pathname + '?',
      conf = this.config;
    //排序
    if (conf.OrderBy) {
      url += 'OrderBy=' + conf.OrderBy + '&';
    }
    if (conf.OrderMethod === 'asc') {
      url += 'OrderMethod=asc&';
    }
    //越界判断
    pageNum = pageNum <= 0 ? 1 : (pageNum > conf.pages ? conf.pages : pageNum);
    //查询
    if (conf.q !== '') {
      url += 'q=' + conf.q + '&';
    }
    //自定义
    url += 'index=' + pageNum + '&' + 'perpage=' + conf.perpage + '&' + (conf.buildQuery() || '');
    return url;
  };
  //页码跳转 url跳转或ajax获取
  // {} perpage searchString OrderBy OrderMethod index 搜索 排序 分页量
  pagination.prototype.gotoPage = function (param) {
    var conf = $.extend(this.config, param);
    if (conf.go !== null) {
      this.init();
      conf.go(conf);
    }
    else {
      window.location.href = this.createURL(conf.index);
    }
  };
  //根据url创建html结构
  pagination.prototype.createItem = function (pageNum) {
    if (pageNum === undefined) {
      return '<li><label class="txt">...</label></li>';
    }
    var res = '<li><a href="{url}" {class} {page}>' + pageNum + '</a></li>';
    var url = this.createURL(pageNum);
    return res.replace('{class}', (pageNum === this.config.index ? 'class="active"' : '')).replace('{url}', url).replace('{page}', 'data-page="' + pageNum + '"');
  };
  //初始化分页组件 结构与数据
  pagination.prototype.init = function () {
    var config = this.config,
      that = this.that;
    //初始化信息
    that.find('[data-pagination="index"]').html(config.index);
    that.find('[data-pagination="pages"]').html(config.pages);
    that.find('[data-pagination="items"]').html(config.items);
    that.find('[data-pagination="perpage"]').val(config.perpage);
    //首页、上一页、下一页、尾页 设置href
    var btnHome = that.find('[data-pagination="home"]').attr({ 'href': this.createURL(1), 'data-page': 1 }).removeClass(config.disableClass),
      btnPrev = that.find('[data-pagination="prev"]').attr({ 'href': this.createURL(config.index - 1), 'data-page': (config.index > 1 ? config.index - 1 : 1) }).removeClass(config.disableClass),
      btnNext = that.find('[data-pagination="next"]').attr({ 'href': this.createURL(config.index + 1), 'data-page': (config.index < config.pages ? config.index + 1 : config.pages) }).removeClass(config.disableClass),
      btnLast = that.find('[data-pagination="last"]').attr({ 'href': this.createURL(config.pages), 'data-page': config.pages }).removeClass(config.disableClass);
    if (config.index === 1) {
      btnHome.addClass(config.disableClass);
      btnPrev.addClass(config.disableClass);
    }
    if (config.index === config.pages) {
      btnNext.addClass(config.disableClass);
      btnLast.addClass(config.disableClass);
    }
    var pageList = that.find('[data-pagination="list"]').html('');
    if (pageList.length !== 0) {
      //距离左侧offset 靠近末尾时距离右侧offset
      var index = config.index <= config.mOffset + 2 ? config.mOffset + 2 : (config.index < config.pages - 2 ? config.index : config.pages - config.mOffset - 1),
        min = index - config.mOffset > 2 ? index - config.mOffset : 3,
        max = index + config.mOffset < config.pages ? index + config.mOffset : config.pages - 1,
        res = '';
      res += this.createItem(1);
      //页数必须大于2
      if (config.pages > 2) {
        res += min > 3 ? this.createItem() : this.createItem(2);
      }
      for (var k = min; k <= max; k++) {
        res += this.createItem(k);
      }
      //后半部的...
      if (max < config.pages - 1) {
        res += this.createItem();
      }
      //页数必须大于1
      if (config.pages > 1) {
        res += this.createItem(config.pages);
      }
      pageList.append(res);
    }
  };
  function pagination(config) {
    //可配置的url默认传参
    this.config = {
      index: 1,
      pages: 1,
      items: 0,
      perpage: 10,
      mOffset: 2,//有pagination-list时才有用
      disableClass: 'disabled',
      OrderBy: '',    //要排序的字段
      q: '',          //搜索字符
      go: null,       //ajax回调
      OrderMethod: '',//desc asc 默认desc
      buildQuery: function () { }
    };
    var _this = this,
      that = $(config.selector);
    if (that.length === 0) {
      return;
    }
    this.that = that;
    //处理数据 json从隐藏域来或从url来 config 实际数据
    this.config = $.extend(this.config, config, JSON.parse(that.find('[data-pagination="data"]').val()));
    this.init();
    that.click(function (e) {
      var o = $(e.target);
      if (o.hasClass(_this.config.disableClass) || o.hasClass('active')) {
        e.preventDefault();
      }
    });
    //页码列表
    that.find('[data-pagination="list"]').parents('ul').click(function (e) {
      //goto 调用ajax
      var page = $(e.target).attr('data-page');
      if (_this.config.go !== null && page) {
        e.preventDefault();
        if (!$(e.target).hasClass('active') && !$(e.target).hasClass('disabled')) {
          _this.config.index = parseInt(page);
          _this.init();
          _this.config.go();
        }

      }
    });

    that.find('[data-pagination="pageth"]').on('keyup', function (e) {
      if (e.keyCode === 13 && /^\d+$/g.test(this.value)) {
        _this.gotoPage({ index: parseInt(this.value) });
      }
    });
    that.find('[data-pagination="goto"]').click(function () {
      var v = that.find('[data-pagination="pageth"]').val();
      if (/^\d+$/g.test(v)) {
        _this.gotoPage({ index: parseInt(v) });
      }
      else {
        alert('请输入正确的页码！');
      }
    });
    that.find('[data-pagination="perpage"]').on('change', function () {
      _this.gotoPage({ perpage: parseInt(this.value), pages: Math.ceil(_this.config.items / _this.config.perpage) });
    });
    return this;
  }
  window.pagination = function (config) {
    return new pagination(config);
  };
  $.fn.extend({
    pagination: function (config) {
      return new pagination(config);
    }
  });
})(jQuery);
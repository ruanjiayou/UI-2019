!(function ($) {
  //插入样式规则
  $.sheet({
    '.card': ' margin: 10px 0; border: 1px solid #ccc; border-radius: 5px;',
    '.card .ui': 'padding: 12px;',
    '.card .code': 'position: relative;display: none',
    '.card .btn-copy': 'position: absolute;right:30px;top:20px;line-height: 35px;z-index: 2;display: inline-block;padding: 0 18px;cursor: pointer;text-align: center;white-space: nowrap;border: 1px solid #ccc;background-color:#FFF;border-radius:5px;',
    '.card pre': ';max-height: 300px;overflow:auto;margin: 0;',
    '.card .preview-comment': 'padding:12px;border-top: 1px solid #eee;background-color: rgb(190, 135, 224);color:#ff0;',
    '.card .preview-comment .important': 'background-color:red;color:yellow;padding:3px;border-radius:3px;',
    '.card .preview-code': 'display: block;width:100%; border: 1px solid #ccc; cursor: pointer; text-align: center; padding: 6px 0;margin-bottom: -1px; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; border-left-width: 0; border-right-width: 0; background-color: #eee;color:#999',
    '.card .preview-code:hover, .card .preview-code:focus': 'color: #333;'
  });
  window.Clipboard = window.Clipboard || (function () { });
  $(function () {
    $('.ui').each(function () {
      var op = $(this).parent();
      var oComment = op.children('.preview-comment');
      if (oComment.length !== 0)
        $('<div class="code"><button class="btn-copy">复制</button></div>').insertBefore(oComment);
      else
        op.append('<div class="code"><button class="btn-copy">复制</button></div>');
      op.append('<label class="preview-code">显示代码</label>');
      var txt = $(this).html();
      //处理空格缩进 ui转code  
      if (/^(\s*)/.test(txt)) txt = txt.replace(new RegExp('([\\n\\r]*)\\s{' + RegExp.$1.length + '}', 'g'), '\n').trim();
      op.children('.code').append($('<pre><code class="language-html"></code></pre>')).find('code').html(txt.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&apos;'));
      op.find('.btn-copy').data('zclip-text', txt).click(function (e) {
        $(this).trigger('copy', e);
      }).bind('copy', function (e) {
        $.log('?');
        e = e.clipboardData || window.event.dataTransfer;
        e.clipboardData.clearData();
        e.clipboardData.setData('text/plain', $(this).data('zclip-text'));
        e.preventDefault();
      });

      op.find('pre').scroll(function (e) {
        e.stopPropagation();
        e.preventDefault();
        return false;
      });
      //显示隐藏代码事件
      op.children('.preview-code').click(function () {
        var pre = $(this).parent().children('.code');
        if ('none' === pre.css('display')) {
          $(this).text('隐藏代码');
          pre.slideDown();
        }
        else {
          $(this).text('显示代码');
          pre.slideUp();
        }
      });
    });
  });
})(jQuery);
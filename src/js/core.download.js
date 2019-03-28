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
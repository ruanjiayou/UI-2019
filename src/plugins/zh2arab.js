/**
时间：2017-5-9 16:48:54
说明：中文数字转阿拉伯数字
**/
(function(sp){
    function zh2arab(){
        
    }
    //zh2arab.prototype.zhNumberReg = new RegExp(/([零|一|二|三|四|五|六|七|八|九|十|百|千|万|亿]+)/g);
    var map = {
        "一":1,
        "二":2,
        "三":3,
        "四":4,
        "五":5,
        "六":6,
        "七":7,
        "八":8,
        "九":9
    };
    function getNum(str,recusor){
        str = str.replace("零","");
        var res = 0, temp, t;
        if(str.search("亿")!=-1){
            temp = str.split("亿");
            str = temp[1];
            res += 100000000*getNum(temp[0],true);
        }
        if(str.search("万")!=-1){
            temp = str.split("万");
            str = temp[1];
            res += 10000*getNum(temp[0],true);
        }
        if(str.search("千")!=-1){
            temp = str.split("千");
            str = temp[1];
            res += 1000*getNum(temp[0],true);
        }
        if(str.search("百")!=-1){
            temp = str.split("百");
            str = temp[1];
            res += 100*getNum(temp[0],true);
        }
        if(str.search("十")!=-1){
            temp = str.split("十");
            if(temp.length==2){
                res += temp[0]!='' ? 10*map[temp[0]] : 10;
            }
            else{
                res +=10;
            }
            str = temp[1];
        }
        if(str.length==1){
            res += map[str];
        }
        else{
            for(var i=0;i<str.length;i++){
                res += map[str[i]]*Math.pow(10,str.length-i-1);
            }
        }
        return res;
    }
    //z 中文小写 /([零|一|二|三|四|五|六|七|八|九|十|百|千|万|亿]+)/g
    //Z 中文大写 /([零|壹|贰|叁|肆|伍|陆|柒|捌|玖|拾|佰|仟|万|亿]+)/g
    //d arab模式 /(\d+)/g
    //s 中文小写混合Arab /([零|一|二|三|四|五|六|七|八|九|十|百|千|万|亿|\d]+)/g
    //g 全混 /([零|一|二|三|四|五|六|七|八|九|十|百|千|万|亿|\d|壹|贰|叁|肆|伍|陆|柒|捌|玖|拾|佰|仟]+)/g
    zh2arab.prototype.parse = function(str,pattern){
        var patterns = {
            z: /([零|一|二|三|四|五|六|七|八|九|十|百|千|万|亿]+)/g,
            Z: /([零|壹|贰|叁|肆|伍|陆|柒|捌|玖|拾|佰|仟|万|亿]+)/g,
            d: /(\d+)/g,
            s: /([零|一|二|三|四|五|六|七|八|九|十|百|千|万|亿|\d]+)/g,
            g: /([零|一|二|三|四|五|六|七|八|九|十|百|千|万|亿|\d|壹|贰|叁|肆|伍|陆|柒|捌|玖|拾|佰|仟]+)/g
        };
        var reg = patterns.s;
        if(pattern!=null){
            switch(pattern){
                case 'z': reg = patterns.z;break;
                case 'Z': reg = patterns.Z;break;
                case 'd': reg = patterns.d;break;
                case 's': reg = patterns.s;break;
                case 'g': reg = patterns.g;break
                default:break;
            }
        }
        if(reg.test(str)){
            return getNum(RegExp.$1);
        }
        else{
            return '';
        }
    };
    var o = new zh2arab();
    sp.zh2int = function(str){
        return o.parse(str);
    }
})($);
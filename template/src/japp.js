/* japp.js, (c) 2016 mawentao */
var JApp=function(baseUrl)
{
    this.init = function() {
		require.config({
			baseUrl: baseUrl,
    		packages: [
				{name:'er', location:'../libs/er', main:'main'}
    		]
		});
        require(['jappengine'], function(jappengine,mwt){
			jappengine.start();
        });
    };
};

// 自动调节父窗口的iFrame的高度
// (移动门户的iframe在移动端需要自适应高度)
function autoRizeIframeHeight()
{/*{{{*/
    var pIframe = parent.document.getElementById("mobile-portal-iframe");
    if (pIframe) {
        var h = document.body.scrollHeight + 40;
        pIframe.style.height = h + "px";
        console.log('autoRizeIframeHeight: '+h+'px');
    }
}/*}}}*/


/* 文本块 */
function _textblock(cls,msg,domid)
{/*{{{*/
    var iconmap = {
        loading : 'icon icon-loading fa fa-spin',
        info    : 'sicon-info',
        success : 'sicon-check',
        warning : 'fa fa-frown-o',
        danger  : 'icon icon-report'
    };
    var icon = iconmap[cls];
    var code = ''; 
    if (cls=='loading') {
        var m = msg ? msg : '数据加载中...';
        code = '<span style="font-size:12px;color:#aaa"><i class="'+icon+'"></i> '+m+'</span>';
    } else {
        code = '<div class="mwt-wall mwt-wall-'+cls+'" style="text-align:center;color:#aaa;padding-top:40px;">'+
            '<i class="'+icon+'" style="font-size:24px;"></i><br>'+
            '<div style="display:inline-block;margin-left:10px;font-size:13px;">'+msg+'</div>'+
        '</div>';
    }
    if (domid) jQuery('#'+domid).html(code);
    return code;
}/*}}}*/

textblock = {
    loading : function(msg,domid) {return _textblock('loading',msg,domid);},
    info    : function(msg,domid) {return _textblock('info',msg,domid);},
    success : function(msg,domid) {return _textblock('success',msg,domid);},
    warning : function(msg,domid) {return _textblock('warning',msg,domid);},
    danger  : function(msg,domid) {return _textblock('danger',msg,domid);},
    help    : function(msg,domid) {
        var code = '<i class="sicon-question" pop-title="'+msg+'" pop-cls="mwt-popover-danger"></i>';
        if (domid) jQuery('#'+domid).html(code);
        return code;
    }
};

// 指标显示格式化
function metric_format(num,fmt)
{/*{{{*/
    switch (parseInt(fmt)) {
        case 100:   //!< 百分比
            return parseInt(num*10000)/100 + '%';
        default:    //!< 其他(保留0~n位小数)
            return number_format(num,fmt);
    }
}/*}}}*/




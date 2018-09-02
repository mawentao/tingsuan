/* japp.js, (c) 2016 mawentao */
var conf = {
    // 日志级别 0:关闭;>=1:WARN;>=2:INFO;>=3DEBUG;
    loglevel: 3
};
/* JApp定义 */
var JApp=function(baseUrl)
{
    this.init = function() {
		require.config({
			baseUrl: baseUrl,
    		packages: [
				{name:'frame', location:'frame', main:'main'}
    		]
		});
        require(['jappengine'], function(jappengine,corelog,coreajax,mwt){
			jappengine.start();
        });
    };
};

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
        code = '<div class="mwt-wall mwt-wall-'+cls+'">'+
            '<i class="'+icon+'" style="font-size:16px;float:left;margin-top:1px;"></i>'+
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

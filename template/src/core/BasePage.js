define(function(require){

// 页面基类
var BasePage=function(opt)
{
    this.id='index';
    if (opt) {
        if(opt.id) this.id=opt.id;
    }
    var thiso=this;

    // 以全屏浮层方式打开
    this.pop=function(query) {
        var render = this.id.replace('/','-');

        var dialog = new mwt.Dialog({
            render : 'dialog-'+render,
            title  : '我的对话框',
            fullscreen: true
        });
        dialog.on('open',function(){
            thiso.open(query,'dialog-'+render+'-dialog-body');
        });
        dialog.open();
    };


/*
    this.container;
    this.pageid = mwt.genId('page-');
    this.query = {};

    if (opt) {
        if(opt.container) this.container=opt.container;
        if(opt.pageid) this.pageid=opt.pageid;
        if(opt.query) this.query=opt.query;
    }
    this.init=function(style,clsname,renderfun){
        var domid = this.pageid;
        if (!mwt.$(domid)) {
            var s = style ? ' style="'+style+'"' : '';
            var c = clsname ? ' class="'+clsname+'"' : '';
            var code = '<div id="'+domid+'"'+c+s+'></div>';
            jQuery('#'+this.container).html(code);
            if (renderfun) renderfun(domid,this.query);
        }
        return domid;
    };

    // 格式化查询参数
    this.formatQuery=function(query) {
        for (var k in this.query) {
            if (isset(query[k])) this.query[k] = query[k];
        }
        return this.query;
    };

    // 跳转
    this.jump=function(urlbase) {
        var ps = [];
        for (var k in this.query) {
            ps.push(k+'='+this.query[k]);
        }
        if (!urlbase) urlbase = '#/order';
        window.location = urlbase+'~'+ps.join('&');
    };

    // 回退
    this.close=function() {
        jQuery('#'+this.pageid).hide();
        if (window.history.length>1) {
            window.history.go(-1);
        } else {
            window.location = '#/';
        }
    };
*/
};

return BasePage;

});

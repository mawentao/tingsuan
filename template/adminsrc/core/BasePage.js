define(function(require){

// 控制器基类
var BasePage=function(opt)
{
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
        if (!urlbase) urlbase = '#/';
        window.location = urlbase+'~'+ps.join('&');
    };
};

return BasePage;

});

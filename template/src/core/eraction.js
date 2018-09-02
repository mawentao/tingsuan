define(function(require){
    var ErAction=require("er/Action");
    var frame=require('frame');
    var o = new ErAction();
    o.on("enter",function(){
        //1. 解析UrlPath
        var erurl = this.context.url;
        var path  = erurl.getPath();
        var pagePath = 'page'+(path=='/'?'/index':path);
        //2. 执行页面
        var cm = pagePath+'/page';
        require([cm],function(c){
            c['open'](erurl.getQuery(),frame.getContainer());
        });
    });
    return o;
});

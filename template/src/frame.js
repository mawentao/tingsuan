define(function(require){
    /**
     * 页面框架, 负责页面整体布局和导航菜单管理
     * 框架接口:
     *     init()                : 框架初始化
     **/
    var container = 'frame-body';
    var o={};

    // 重置页面内容
    o.clear=function() 
    {/*{{{*/
        //1. 终止所有ajax请求
        ajax.abortAll();
        //2. 重置页面
        jQuery('#frame-foot').hide();
        var code = '<div class="global-loading">'+
            '<i class="icon icon-loading fa fa-spin fa-2x"></i>'+
        '</div>';
        jQuery('#'+container).html(code);
    };/*}}}*/

    // 获取页面容器(DomID)
    o.getContainer=function()
    {/*{{{*/
        o.clear();
        return container;
    }/*}}}*/

    // 添加到append
    o.appendDiv=function(code) 
    {
        jQuery('#append_parent').append(code);
    }

    o.getLogo = function() {
        return dz.siteurl+'/source/plugin/datacube/template/static/logo.png';
    };

    o.getCopyright=function(color) {
        if (!color) color = '#aaa';
        var url = dz.siteurl+'/plugin.php?id=datacube';
        var logo = o.getLogo();
        return '<a href="'+url+'" '+
          'style="display:block;padding:20px 0 10px;text-align:center;color:'+color+';font-size:13px;text-decoration:none;">'+
            '<img src="'+logo+'" style="width:16px;height:16px;vertical-align:text-bottom"> '+
            'Powered By 数立方'+
        '</a>';
    };

    return o;
});

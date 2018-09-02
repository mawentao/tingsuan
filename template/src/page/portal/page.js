define(function(require){
    /* page.js, (c) 2018 mawentao */
    var portalModel = require('model/portal');
    var BasePage = require('core/BasePage');
    var o=new BasePage({
        id: 'portal'
    });

    o.open=function(query,domid) {
        jQuery('body').css({background:'#FFF',color:'#333'});
        var p = query.p ? query.p : '';
        if (p=='') {
            var msg = '页面找不到或已删除';
            textblock.danger(msg,domid);
            return;
        }
        //1. 获取门户配置
        var config = portalModel.get(p);
        if (!config || !config.global) {
            var msg = '页面找不到或已删除';
            textblock.danger(msg,domid);
            return;
        }
        setPageTitle(config.global.title);

        //2. 初始化页面布局
        var code = '<div id="body-'+domid+'"></div>'+
            '<div id="foot-'+domid+'" class="h5foot mwt-border-top">aaa</div>';
        jQuery('#'+domid).html(code);

        //3. 初始化
        var m = query.m ? query.m : '0';
        var arr = m.split('-');
        var m0 = arr[0];
        var m1 = arr[1] ? arr[1] : 0;
        var im = config.nav[m0];
        if (!im.config.items && !im.config.link) {
            im = config.nav[m0].submenu[m1];
        }
        require('./area_body').init('body-'+domid,im.config);
        require('./area_foot').init('foot-'+domid,config,p,m0);
    };

    return o;
});

define(function(require){
    /* page.js, (c) 2018 mawentao */
    var BasePage = require('core/BasePage');
    var o=new BasePage({
        id: 'uc'
    });

    var menus = [
        '最新练习','高分练习'
    ];

    o.open=function(query,domid) {
        activeNav('uc');
        var navi = query.i ? query.i : 0;
        var nav = [];
        for (var i=0;i<menus.length;++i) {
            var active = i==navi ? ' class="mwt-active"' : '';
            var code = '<li style="padding-left:5px;"'+active+'>'+
                '<a href="#/uc~i='+i+'">'+menus[i]+'</a>'+
            '</li>';
            nav.push(code);
        }


        var code = '<div id="uccard-'+domid+'" class="spacebg" style="height:150px;"></div>'+
            '<div class="mwt-tabhead mwt-border-bottom" '+
              'style="position:fixed;top:150px;left:0;right:0;height:42px;z-index:2;">'+
                '<ul>'+nav.join('')+'</ul>'+
            '</div>'+
            '<div id="ucmenu-'+domid+'" style="margin:192px 0 50px;background:#fff;" class="mwt-flow"></div>';
        jQuery('#'+domid).html(code);
        
        require('./usercard').init('uccard-'+domid);
        require('./flow').init('ucmenu-'+domid,(navi==0?'begin_time':'accuracy'));
    };

    return o;
});

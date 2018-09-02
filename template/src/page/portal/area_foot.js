define(function(require){
    /* area_foot.js, (c) 2018 mawentao */

    var url = '';
    var navList = [];

    // 获取弹出子菜单
    function getSubMenu(i)
    {
        var ls = [];
        var im = navList[i];
        for (var k=0;k<im.submenu.length;++k) {
            var sim = im.submenu[k];
            var code = '<li><a href="'+url+i+'-'+k+'">'+sim.title+'</a>';
            ls.push(code);
        }
        var code = '<div class="mwt-border-top">'+
            '<ul class="mwt-nav">'+ls.join('')+'</ul>'+
        '</div>';
        return code;
    }


    var o={};

    o.init=function(domid,config,p,m0) 
    {
        url = '#/portal~p='+p+'&m=';
        navList = config.nav;
        var ls = [];
        for (var i=0;i<config.nav.length;++i) {
            var im = config.nav[i];
            if (im.config.items || im.config.links) {

            }
            var active = m0==i ? ' active' : '';
            // 没有子菜单
            if (!im.submenu || !im.submenu.length) {
                var code = '<a href="'+url+i+'" class="mwt-col-fill foot-item'+active+'">'+im.title+'</a>';
                ls.push(code);
            }
            // 有子菜单
            else {
                var code = '<a href="javascript:;" name="foot-menu" id="foot-menu-'+i+'" data-i="'+i+'" '+
                    'class="mwt-col-fill foot-item'+active+'">'+
                        im.title+' <i class="icon icon-bar" style="font-size:13px;"></i>'+
                    '</a>';
                ls.push(code);
            }
        }
        var code = '<div class="mwt-row mwt-row-flex">'+
            ls.join('')+
        '</div>';
        jQuery('#'+domid).html(code);
        jQuery('[name=foot-menu]').unbind('click').click(function(){
            var i = jQuery(this).data('i');
            var n = navList[i].submenu.length;
            var h = 35.6*n;
            if (h>500) h=500;
            mwt.showPop('foot-menu-'+i,'submenu-'+i,'100%',h,function(domid){
                var jdom = jQuery('#'+domid);
                jdom.css({left:0,right:0,padding:0,overflow:'auto'});
                if (jdom.html()=='') {
                    var code = getSubMenu(i);
                    jdom.html(code);
                }
            });
        });
    };

    return o;
});

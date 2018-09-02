define(function(require){
	/* 左右布局 */
	var layout = new mwt.BorderLayout({
    	render : 'frame-body',
    	items : [
        	{id:'frame-west',region:'west',width:180,collapsible:true,split:true,html:''},
        	{id:'frame-center',region:'center',style:'padding:5px 10px 20px;font-size:13px;',html:''}
    	]
	});

	// 初始化左部导航
    function init_nav(controlconf) {
		var controller=controlconf.controller;
		var navitems=controlconf.menu;
        var code = '<ul class="leftmenu" id="nav-'+controller+'">';
		for (var j=0; j<navitems.length; ++j) {
			var item = navitems[j];
			var href = item.action ? '#/'+controller+'/'+item.action : "javascript:;";
			var hassubmenu = (item.submenu && item.submenu.length>0);
			var cls = hassubmenu ? 'class="menu-open"' : '';
			var icon = item.icon ? item.icon : 'fa fa-th-large';
			var style = item.style ? item.style : '';
			var liid = item.action ? 'id="navitem-'+controller+'-'+item.action+'"' : '';
			code += "<li "+cls+" style='"+style+"'>"+
					"<a name='navitem' class='lm-menu' href='"+href+"' "+liid+">"+
						'<i class="'+icon+'" style="padding-left:0;"></i>&nbsp;'+item.name+"</a>";
			// 子菜单
			if (hassubmenu) {
				code += "<ul class='submenu'>";
				for (var k=0; k<item.submenu.length; ++k) {
					var im = item.submenu[k];
					var href = im.action ? '#/'+controller+'/'+im.action : "javascript:;";
					var style = im.style ? im.style : '';
					liid = im.action ? 'id="navitem-'+controller+'-'+im.action+'"' : '';
					icon = im.icon ? im.icon : 'fa fa-caret-right';
					code += "<li style='"+style+"'><a name='navitem' class='lm-item' href='"+href+"' "+liid+">"+
							'<i class="'+icon+'" style="padding-left:0;"></i>&nbsp;'+im.name+"</a></li>";
				}   
				code += "</ul>";
			}
			code += "</li>";
		}
		code += '<li class="clearfix"></li></ul>';
        jQuery("#frame-west").html(code);
		//2. bunddle event
        jQuery(".lm-menu").unbind('click').click(function(){
            var child = jQuery(this).parent().children(".submenu");
            if (child) {
                var dsp = child.css("display");
                if (!dsp) {
                    //alert(dsp);
                } else if ("none" == dsp) {
                    jQuery(this).parent().removeClass("menu-close");
                    jQuery(this).parent().addClass("menu-open");
                } else {
                    jQuery(this).parent().removeClass("menu-open");
                    jQuery(this).parent().addClass("menu-close");
                }   
            }
        });
    }


    var o={};
	o.init=function(conf,controller,action){
		layout.init();
		init_nav(conf);
		// 选中action
		jQuery('[name="navitem"]').removeClass('active');
		jQuery('#navitem-'+controller+'-'+action).addClass('active');
	};
	return o;
});

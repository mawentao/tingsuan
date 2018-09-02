/**
 * 页面框架, 负责页面整体布局和导航菜单管理
 * 框架接口:
 *     init()                : 框架初始化
 *     addcontroller(conf)   : 添加控制器配置
 *     active()              : 选中菜单/导航
 *     showpage()            : 显示主页区域
 **/
define(function(require){
    var controller_confs={};  //!< 控制器配置列表
	var controller_active;    //!< 当前激活的控制器
    var o={};

    // 从链接地址中提取controller
	function parse_controller_from_href(href)
	{
		var idx = href.lastIndexOf('#/');
		if (idx<0) return '';
		var tmp = href.substr(idx+2);
		var arr = tmp.split('/');
		return arr[0];
	}

    // 框架初始化函数
    o.init = function() {
    };

    // 添加控制器配置
    o.addcontroller = function(conf) {
		controller_confs[conf.controller] = conf;
    };

    // 选中菜单
    o.active = function(controller,action) {
		//1. 未切换controller只需选中action
		if (controller_active==controller) {
			jQuery('[name="navitem"]').removeClass('active');
			jQuery('#navitem-'+controller+'-'+action).addClass('active');
			return;
		}
		//2. 清理布局
		jQuery('#frame-body').html('');
		if (!controller_confs[controller]) return;  //!< 未添加过此controller的配置
		var conf = controller_confs[controller];
        //3. 选中顶部导航菜单
        jQuery("#menu-"+controller).addClass('active');
		//4. 显示controller布局
		// 左导航布局
		if (conf.menu && conf.menu.length>0) {
		    require('./left_center_layout').init(conf,controller,action);
		} else {
			var code = '<div id="frame-center" style="left:0;"></div>';
			jQuery('#frame-body').html(code);
		}
        controller_active = controller;
    };

    // 显示页面
    o.showpage = function(code) {
        jQuery("#frame-center").html(code);
    };

    return o;
});

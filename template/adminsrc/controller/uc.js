define(function(require){
    /* 个人中心 */
	var posnav=require('common/posnav');
    var copyright=require('common/copyright');
    var BaseController = require('core/BaseController');
    var o = new BaseController('uc');

    o._before_action=function(erurl){};
    o._after_action=function(erurl){};
    o.conf = {
        controller: o.controller,
        // 左部菜单
        menu: [
			{name:'个人中心', icon:'sicon-grid', submenu:[
				{name:'我的资料',icon:'icon icon-log',action:'profile'},
				{name:'修改密码',icon:'icon icon-lock',action:'changepass'}
			]}
        ]
    };

	// 默认action
	o.indexAction=function() {
		window.location='#/uc/profile';
	};

	// 基本资料
	o.profileAction=function(){
		require('./login').check();
		var posarr = [{name:'个人中心',href:'#/uc'},{name:'我的资料',href:'#/uc/profile'}];
        var code = posnav.get(posarr)+
            '<div id="form-div"></div>'+
            copyright.get();
        require('frame').showpage(code);
        require('view/uc/profile/page').execute();
	};

	// 修改密码 
	o.changepassAction=function(){
		require('./login').check();
		var posarr = [{name:'个人中心',href:'#/uc'},{name:'修改密码',href:'#/uc/changepass'}];
        var code = posnav.get(posarr)+
            '<div id="form-div"></div>'+
            copyright.get();
        require('frame').showpage(code);
        require('view/uc/changepass/page').execute();
	};

	return o;
});

/* jappengine.js, (c) 2016 mawentao */
/* 全局变量 */
var ajax,log,frame,posnav,dict;

define(function(require){
	ajax=require('core/ajax');
	log=require('core/log');
    frame=require('frame');
    posnav=require('common/posnav');
    dict=require('common/dict');

	require('core/eraction');
	var urlmap=require('core/urlmap');

    // 注册controller配置(所有controller必须在此配置)
    var controllers = [ 
        require('controller/admin'),
//        require('controller/login'),
        require('controller/uc'),
        require('controller/index')
    ];

	var o={};
	o.start=function(){
		urlmap.start();
        var reg = new RegExp("Action$");
        for (var i=0;i<controllers.length;++i) {
            var c = controllers[i];
            if (c.controller) {
                //1. 添加urlmap
                urlmap.addmap("/"+c.controller+"/index");
                for (var f in c) {
                    if (reg.test(f) && typeof(c[f])=='function') {
                        var action = f.replace(reg,'');
                        urlmap.addmap("/"+c.controller+"/"+action);
                    }
                }
                //2. 在frame中添加controller配置
                if (c.conf) {
                    require('frame').addcontroller(c.conf);
                }
            }
        }
	};
	return o;
});

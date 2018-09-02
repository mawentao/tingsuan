/* jappengine.js, (c) 2016 mawentao */
/* 全局变量 */
var ajax,dict;
/* JappEngine */
define(function(require){
	ajax=require('core/ajax');			//!< ajax
    var urlmap=require('core/urlmap');

    var pages = [
        require('page/exercise/page'),    //!< 练习
        require('page/exercise/doing/page'), //!< 做练习
        require('page/exercise/result/page'), //!< 练习结果
        require('page/uc/page'),    //!< 个人中心
        require('page/index/page')  //!< 默认首页
    ];

	var o={};
	o.start=function(){
		urlmap.start();
        for (var i=0;i<pages.length;++i) {
            var page = pages[i];
            urlmap.addmap("/"+page.id);
        }
	};
	return o;
});

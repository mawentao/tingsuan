define(function(require){
    /*url伪地址路由映射, (c) 2016 mawentao */
    require('core/eraction');
    var urlmapping={};
    var o={};

    // 启动ER
	o.start=function(){
		require("er/main").start();
		this.addmap("/");
		this.addmap("/index");
	};

	// 添加路由path
	o.addmap = function(path) {
        var ridx=path.lastIndexOf('~');
        if (ridx>=0) {
            path = path.substr(0,ridx);
        }
        var pathList = []; 
        pathList.push(path);
        for (var i=0; i<pathList.length; ++i) {
            var p = pathList[i];
            if (!urlmapping[p]) {
                var item = {path:p, type:'core/eraction'};
                require("er/controller").registerAction(item);
				urlmapping[p] = true;
                var pagePath = "page"+(p=='/'?'/index':p);
				mwt.log_debug("map url path [#"+p+"] to javascript "+pagePath+"/page.js#open");
            }
        }   
    };

    return o;
});

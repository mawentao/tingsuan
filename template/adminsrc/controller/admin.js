define(function(require){
    /* 管理中心 */
    var BaseController = require('core/BaseController');
    var o = new BaseController('admin');

    o._before_action=function(erurl){};
    o._after_action=function(erurl){};
    o.conf = {
        controller: o.controller,
        // 左部菜单
        menu: [
            {name:'帮助中心', icon:'fa fa-question-circle', submenu:[
                {name:'框架使用',action:'start'},
                {name:'框架详解',icon:'fa fa-info',action:'introduction'},
                {name:'隐藏的导航',action:'',style:"display:none"}
            ]}  
        ]
    };
    
    
    o.indexAction=function() {
        window.location='#/admin/start';
    };


    // 框架使用
    o.startAction=function(erurl){
        var posarr = [{name:'框架使用',href:'#/admin/start'}];
        var code = posnav.get(posarr)+'<div id="admin-start-div" class="gridfill">框架使用</div>';
        frame.showpage(code);
    };

    // 框架详解
    o.introductionAction=function(erurl){
        var code = '框架详解'+
            '<h3>JApp(前端框架)目录介绍</h3><ul>'+
                '<li>controller：所有控制器js代码文件，在控制器中必须指定conf。</li>'+
                '<li>view：强烈建议把具体页面的代码放在此目录下。</li>'+
                '<li>core：JSApp核心代码，请不要更改代码，除非你了解里面的逻辑。</li>'+
                '<li>frame：页面框架代码，可以切换frame.css应用不同的风格或扩展自己的风格。</li>'+
                '<li>japp.js：JSApp核心类，以及一些全局变量定义。</li>'+
                '<li>jappengine.js：JSApp启动引擎。</li>'+
            '</ul>'+

            '<h3>JApp(前端框架)启动过程</h3><ol>'+
                '<li>启动伪url路由解析器</li>'+
                '<li>根据注册的controller配置，向urlmap添加controller配置的所有path</li>'+
                '<li>在frame中添加注册的controller配置</li>'+
            '</ol>'+

            '<h3>frame详解</h3><ul>'+
                '<li>frame初始化: 创建顶部导航菜单(根据全局变量navlist,在插件后端配置navlist), 及 user区</li>'+
                '<li>url切换与frame联动: 切换controller会联动顶部导航菜单(导航菜单项可以与controller绑定); '+
                    '根据controller的menu配置来决定布局,如果有定义左部导航菜单则会渲染出左部导航; '+
                    '左部导航菜单项可以与action绑定'+
                '</li>'+
            '</ul>';
        frame.showpage(code);
    };

    return o;
});

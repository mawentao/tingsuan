define(function(require){
    /* 默认controller */
    var BaseController = require('core/BaseController');
    var o = new BaseController('index');
    
    o._before_action=function(erurl){};
    o._after_action=function(erurl){};

    o.indexAction=function() {
        window.location = '#/admin';
    };  
    return o;
});

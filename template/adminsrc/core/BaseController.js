define(function(require){

// 控制器基类
var BaseController=function(controllerName)
{
    this.controller='';
    if(controllerName) this.controller=controllerName;

    // 执行Action
    this._do_action=function(action,erurl) {
        this._before_action(erurl);
        this[action+'Action'](erurl);
        this._after_action(erurl);
    };

    this._before_action=function(erurl){}
    this._after_action=function(erurl){}

};

return BaseController;

});

define(function(require){
	var ajax=require("ajax");
    var dict=require("./dict");
	var store,grid;
    var o={};
    o.init = function(){
		store = new mwt.Store({
            proxy: new mwt.HttpProxy({
                url: ajax.getAjaxUrl("admin&action=authQuery")
            })
        });
		grid = new MWT.Grid({
            render      : 'grid-div',
            store       : store,
            pagebar     : true,
            pageSize    : 20,
            multiSelect : false, 
            bordered    : false,
			position    : 'fixed',
            striped     : true,     //!< 斑马纹
			bodyStyle   : '',
			tbarStyle   : 'margin-bottom:10px;',
			tbar: [
				{label:"权限",id:"auth-sel",type:'select',value:'-1',
                 options:dict.get_auth_options({text:'不限',value:'-1'}),
                 handler:o.query},
				{type:'search',id:'so-key',width:300,handler:o.query,placeholder:'查询用户名'},
				'->',
				{label:'添加用户 <i class="sicon-arrow-right"></i>',handler:function(){
					var url = "admin.php?frames=yes&action=members&operation=add";
					window.open(url);
				}}
			],
            cm: new MWT.Grid.ColumnModel([
              {head:"用户ID",   dataIndex:"uid",      width:100, sort:true},
              {head:"用户名",   dataIndex:"username", width:120, sort:true},
			  {head:"用户邮箱", dataIndex:"email",    width:200, sort:true},
			  /*{head:"用户组", dataIndex:"groupid", width:120, sort:true,render:function(v,item){
				return item.groupname;
			  }},*/
              {head:"权限", dataIndex:"auth",width:140,sort:true,render:function(v,item){
                return dict.get_auth(v);
			  }},
              {head:'',dataIndex:"uid",align:'left',render:function(v,item){
                var setbtn = '<a name="setbtn" data-id="'+v+'" href="javascript:;">设置</a>';
                var btns = [setbtn];
                return btns.join("&nbsp;|&nbsp;");
              }}
            ])
        });
        grid.create();
		store.on('load',function(){
			jQuery('[name=setbtn]').unbind('click').click(function(){
				var uid = jQuery(this).data('id');
				require('./dialog').open(uid);
			});
		});
		o.query();
    };

	o.query=function() {
		store.baseParams = {
            auth : mwt.get_select_value("auth-sel"),
            key  : mwt.get_value("so-key")
        };
        grid.load();
	};

    return o;
});

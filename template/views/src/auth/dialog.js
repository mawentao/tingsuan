define(function(require){
	var ajax=require("ajax");
    var dict=require("./dict");
	var uid,form,dialog;

	function init() {
		var trs = [];
        var authopts = dict.get_auth_options();
		for (var i=0;i<authopts.length;++i) {
			var im=authopts[i];
			var code = '<tr>'+
			    '<td><label><input type="radio" name="form-auth" value="'+im.value+'">'+im.text+'</label></td>'+
	        '</tr>';
			trs.push(code);
		}
		// dialog
		dialog = new MWT.Dialog({
            title  : '权限设置',
            width  : 400,
            height : "auto",
            top    : 50,
            form   : form,
            bodyStyle: 'padding:10px;',
            body   : '<table class="mwt-formtab">'+trs.join('')+'</table>',
            buttons: [
                {label:"确定",cls:'mwt-btn-primary',handler:submit},
                {label:"取消",type:'close',cls:'mwt-btn-danger'}
            ]
        });
		dialog.create();
		// 打开窗口事件
		dialog.on('open',function(){
			mwt.set_radio_value('form-auth',0);
		});
	}

	// 提交表单
	function submit() {
		var data = {
			uid  : uid,
			auth : mwt.get_radio_value('form-auth')
		};
		ajax.post('admin&action=authSet',data,function(res){
			if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
			else {
				dialog.close();
				require('./grid').query();
			}
		});
	}

	var o={};
	o.open=function(_uid) {
		uid=_uid;
		if (!dialog) init();
		dialog.open();
	};
	return o;
});


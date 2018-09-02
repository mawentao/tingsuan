<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title></title>
  <link rel="stylesheet" href="<%plugin_path%>/template/libs/mwt/4.0/mwt.min.css" type="text/css">
  <link rel="stylesheet" href="<%plugin_path%>/template/views/misadmin.css" type="text/css">
  <script src="<%plugin_path%>/template/libs/jquery/1.11.2/jquery.min.js"></script>
  <script src="<%plugin_path%>/template/libs/mwt/4.0/mwt.min.js"></script>
  <%js_script%>
</head>
<body>
<form method="post" action="admin.php?action=plugins&operation=config&identifier=tingsuan&pmod=z_nav"
      accept-charset="utf-8" onsubmit="return checkpost();">
  <table class="tb tb2" id="listbody">
    <tr><th colspan="15" class="partition">导航菜单设置</th></tr>
    <tr><td colspan="15">
      <div style="height:30px;line-height:30px;"><a href="javascript:;" onclick="toggle_all()">全部展开</a> | 
      <a href="javascript:;" onclick="toggle_all(true)">全部折叠</a></div>
    </td></tr>
    <tr class='header'>
      <th width='30'></th>
      <th width='60'>显示顺序</th>
      <th width='200'>标题</th>
      <th width='70'>图标</th>
      <th width='350'>链接</th>
      <th width='100'>新窗口打开</th>
      <th width='60'>可用</th>
      <th></th>
    </tr>
  </table>
  <table class="tb tb2">
    <tr><td width="30"></td><td colspan='15'>
      <div><a id="addrowbtn" href="javascript:;" onclick="return false;" class="addtr">添加菜单</a></div>
    </td></tr>
    <tr>
      <td colspan="3">
		<input type="hidden" id="reset" name="reset" value="0"/>
        <input type="submit" id='subbtn' class='btn' value="提交"/>
        &nbsp;&nbsp;
		<input type="submit" class='btn' onclick="jQuery('#reset').val(1);" value="恢复默认设置"/>
      </td>
    </tr>
  </table>
</form>
<script>
	// 初始化页面
    var jq=jQuery.noConflict();
    jq(document).ready(function($) {
		for (var i=0;i<v.navmenu.length;++i) {
			var im = v.navmenu[i];
			addrow('listbody',0,im);
			var parentidx = menuidx;
			if (im.subitems && im.subitems.length>0) {
				for (var k=0;k<im.subitems.length; ++k) {
					addrow(parentidx,1,im.subitems[k]);
				}
			}
		}
		jQuery('#addrowbtn').click(function(){addrow('listbody',0);});
		init_icon_dialog();
    });

    // 添加菜单
	var menuidx=0;
	function addrow(domid,issub,item) {
		++menuidx;
		if (!item) {
		    item = {displayorder:0, text:'新菜单', icon:'fa fa-list', href:'', newtab:0, enable:1};
		}
		var zd = issub ? '' : '<a name="menugroupa" data-idx="'+menuidx+'" href="javascript:;">[-]</a>';
		var cs = issub ? 'board' : 'parentboard';
		var parentid = domid=='listbody' ? 0 : domid;
		var newtab_checked = item.newtab==1 ? 'checked' : '';
		var enable_checked = item.enable==1 ? 'checked' : '';
		var code = '<tr id="menu-'+menuidx+'">'+
			  '<td>'+zd+
				'<input type="hidden" name="menuid[]" value="'+menuidx+'">'+
				'<input type="hidden" name="parentid[]" value="'+parentid+'">'+
			  '</td>'+
			  '<td class="td25"><input type="text" class="txt" name="displayorder[]" value="'+item.displayorder+'"></td>'+
			  '<td><div class="'+cs+'"><input type="text" class="txt" name="text[]" value="'+item.text+'"></div></td>'+
			  '<td><input name="icon[]" id="icon-'+menuidx+'" type="hidden" style="width:40px;" value="'+item.icon+'">'+
				  '<i name="iconbtn" class="'+item.icon+'" data-idx="'+menuidx+'"></i></td>'+
			  '<td><input type="text" name="href[]" value="'+item.href+'" class="txt" style="width:300px;"></td>'+
			  '<td><input type="hidden" name="newtab[]" id="newtab-'+menuidx+'" value="'+item.newtab+'">'+
				  '<input type="checkbox" name="newtab-cbx" data-idx="'+menuidx+'" '+newtab_checked+'></td>'+
			  '<td><input type="hidden" name="enable[]" id="enable-'+menuidx+'" value="'+item.enable+'">'+
				  '<input type="checkbox" name="enable-cbx" data-idx="'+menuidx+'" '+enable_checked+'></td>'+
			  '<td><a href="javascript:;" name="delbtn" data-idx="'+menuidx+'" style="cursor:pointer;">删除</a></td>'+
			'</tr>';
		if (!issub) {
			code = '<tbody>'+code+'</tbody>';
			code += '<tbody id="menu-body-'+menuidx+'"></tbody>'+
				'<tbody id="subaddbody-'+menuidx+'"><tr><td></td>'+
				  '<td colspan="9"><div class="lastboard"><a class="addtr" name="subaddbtn" href="javascript:;" data-menuidx="'+menuidx+'">添加子菜单</a></div></td>'+
				'</tr></tbody>';
		}
		if (domid!='listbody') domid="menu-body-"+domid;
		jQuery('#'+domid).append(code);
		if (!issub) {
			// 添加子菜单
			jQuery('[name="subaddbtn"]').unbind('click').click(function(){
				var idx = jQuery(this).data('menuidx');
				addrow(idx,1);
			});
			// 折叠
			jQuery('[name="menugroupa"]').unbind('click').click(function(){
				var idx = jQuery(this).data('idx');
				var dp = jQuery('#menu-body-'+idx).css('display');
				if (dp=='none') {
					jQuery('#menu-body-'+idx).show();
					jQuery('#subaddbody-'+idx).show();
					jQuery(this).html("[-]");
				} else {
					jQuery('#menu-body-'+idx).hide();
					jQuery('#subaddbody-'+idx).hide();
					jQuery(this).html("[+]");
				}
			});
		}
		// 删除
		jQuery('[name="delbtn"]').unbind('click').click(function(){
			var idx = jQuery(this).data('idx');
			jQuery('#menu-'+idx).remove();
			jQuery('#menu-body-'+idx).remove();
			jQuery('#subaddbody-'+idx).remove();
		});
		// 勾选新窗口打开
		jQuery('[name=newtab-cbx]').unbind('click').click(function(){
			var idx = jQuery(this).data('idx');
            var ckd = jQuery(this).is(':checked');
            var v = ckd ? 1 : 0;
            set_value('newtab-'+idx,v);
		});
		// 勾选可用
		jQuery('[name=enable-cbx]').change(function(){
            var idx = jQuery(this).data('idx');
            var ckd = jQuery(this).is(':checked');
            var v = ckd ? 1 : 0;
            set_value('enable-'+idx,v);
        });
		// 图标选择
		jQuery('[name=iconbtn]').click(function(){
            var jthis = jQuery(this);
            var idx = jthis.data("idx");
            open_icon_dialog(function(ic){
				//alert(ic);
                jQuery('#icon-'+idx).val(ic);
                jthis.attr('class',ic);
            })  
        }); 
	}

	// 全部折叠或全部展开
	function toggle_all(hide) {
		jQuery('[name="menugroupa"]').each(function(){
			var idx = jQuery(this).data('idx');
			if (hide) {
				jQuery('#menu-body-'+idx).hide();
				jQuery('#subaddbody-'+idx).hide();
				jQuery(this).html("[+]");
			} else {
				jQuery('#menu-body-'+idx).show();
				jQuery('#subaddbody-'+idx).show();
				jQuery(this).html("[-]");
			}
		});
	}

	// 提交检查
	function checkpost() {
		var res = true;
		var keys = ['text','href'];
		for (var i=0; i<keys.length; ++i) {
			jQuery('[name="'+keys[i]+'[]"]').each(function(){
				var jts = jQuery(this);
				var v = jts.val();
				if (v.trim()=='') {
					jts.focus();
					res = false;
				}
			});
			if (!res) return res;
		}
		return res;
	};

	// 图标选择对话框
	var dialog,callback;
	function init_icon_dialog() {
		var icons = [ 
            'fa fa-home','icon icon-home','fa fa-tv',
            'fa fa-question-circle','sicon-question',
			'fa fa-th-large','fa fa-th','fa fa-caret-right','fa fa-list','fa fa-list-ol','fa fa-list-ul',
			'fa fa-star','fa fa-star-o','fa fa-tag','fa fa-tags',
			'fa fa-car','fa fa-taxi','fa fa-bus','fa fa-user','fa fa-users','fa fa-street-view','fa fa-cny',
			'fa fa-dollar','fa fa-warning',
			'fa fa-cube','fa fa-cubes','fa fa-database','fa fa-file-text-o','fa fa-list-alt','fa fa-table',
			'fa fa-globe',
			'icon icon-score','sicon-compass','fa fa-commenting','fa fa-commenting-o','fa fa-info-circle','fa fa-wrench',
			'fa fa-line-chart','fa fa-pie-chart','fa fa-cloud'
    	];
		var code = ""; 
        for (var i=0;i<icons.length;++i) {
            code += '<i class="'+icons[i]+'" name="iconselitem" '+
                'style="font-size:16px;padding:8px;line-height:30px;cursor:pointer;border:solid 0px #ddd;color:#333;"></i>';
        }
		dialog = new MWT.Dialog({
            title  : '选择图标',
            width  : 390,
            top    : 50, 
            bodyStyle: 'padding:10px 20px;',
            body   : code
        });
		dialog.on('open', function(){
            jQuery("[name=iconselitem]").unbind('click').click(function(){
                selected_icon = jQuery(this).attr('class');
                dialog.close();
                if (callback) callback(selected_icon);
            });
        });
	}
	function open_icon_dialog(callfun) {
		if (callfun) callback=callfun;
		dialog.open();
	}
</script>
</body>
</html>

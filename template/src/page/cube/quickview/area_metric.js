define(function(require){
	/* 指标筛选区域 */
    var cubeInfo;
    var domid;

	var o={};

	o.init=function(_domid,_cubeInfo) {
        domid = _domid;
        cubeInfo = _cubeInfo;
		var cubeid = cubeInfo.cubeid;
        var metrics = [];
        for (var i=0;i<cubeInfo.metrics.length;++i) {
            var mitem = cubeInfo.metrics[i];
            var code = '<li><label><input type="checkbox" name="cbx-'+domid+'" value="'+mitem.mid+'" checked> '+
                '<span>'+mitem.mname+'</span></label></li>';
            metrics.push(code);
        }
		var code = '<ul class="cube-metric-ul">'+
            '<li><label style="color:#8A1B13;"><input type="checkbox" id="alls-'+domid+'" checked> <span>全选</span></label></li>'+
            metrics.join('')+
        '</ul>';
		jQuery('#'+domid).html(code);
        jQuery('#alls-'+domid).unbind('change').change(function(){
            var ckd = jQuery(this).is(':checked');
            jQuery('[name=cbx-'+domid+']').prop('checked',ckd);
        });
	};

    // 获取选择的指标列表
    o.get=function() {
        var metrics = mwt.get_checkbox_values('cbx-'+domid);
        if (metrics.length==0) {
            mwt.notify('请至少选择一个指标',1500,'danger');
            throw new Error('请至少选择一个指标');
        }
        return metrics;
    };

	return o;
});

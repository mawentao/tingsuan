define(function(require){
/**
 * 视图组件
 **/
var ChartView=function(opt)
{
	this.listeners={};
	this.filter_form;		//!< 筛选器
	this.data;				//!< 数据
	this.changeData;		//!< 筛选器联动变化数据
	var render='';
	var cubeid=0;			//!< cube
	var cubicid=0;			//!< cubic
	var cubicInfo;			//!< cubic详情
	var cvid='ChartTable';  //!< 视图组件
	var dimFilterMap={};    //!< 联动控件组
	var topDomId,titleDomId,filterDomId,chartid,loadingDomId;
    var thiso=this;

	if (opt) {
		if(isset(opt.render)) render=opt.render;
		if(isset(opt.cubeid)) cubeid=opt.cubeid;
		if(isset(opt.cubicid)) cubicid=opt.cubicid;
		topDomId = 'top-'+render;					//!< top区ID
		titleDomId = 'cubic-title-'+cubicid;		//!< 标题区ID
		filterDomId = 'filter-'+render;				//!< 筛选器区ID
		chartid = 'chart-'+render;					//!< 主体区ID
		loadingDomId = 'loading-'+render;			//!< loading蒙层
		if(isset(opt.data)) this.data=opt.data;
		if(isset(opt.cvid)) cvid=opt.cvid;
	}
	
	// 维度筛选器
	this.init_filters=function(list)
	{/*{{{*/
		var domid = filterDomId;
		var code = '<i class="fa fa-filter"></i>';
		for (var i=0;i<list.length;++i) {
			var im = list[i];
			code += '<div class="filter-item">'+
				'<label>'+im.dimname+'</label>'+
				'<span id="'+domid+im.dimid+'"></span>'+
			'</div>';
		}
		jQuery('#'+domid).html(code);

		var fds = {};
		for (var i=0;i<list.length;++i) {
			var im = list[i];
			fds[i] = '';
			var defalut_value = isset(im.default_value) ? im.default_value : -1;
			// 日期选择器
			if (im.dimtable=='date') {
				fds[i] = new MWT.DaterangepickerField({
					render : domid+im.dimid,
					format : 'yy/mm/dd',
					style  : 'width:160px;float:left;background-image:none !important;'
				});
			}
			// 通用选择器
			else {
				fds[i] = new MWT.SelectField({
            		render  : domid+im.dimid,
					options : im.data,
					value   : defalut_value
				});
			}
			
			this.filter_form.addField(im.dimkey,fds[i]);
		}
		this.filter_form.create();
		////////////////////////////////////////////////////////
		// 日期维度的默认值需特殊处理
		for (var i=0;i<list.length;++i) {
			var im = list[i];
			if (im.dimtable=='date') {
				var defalut_value = isset(im.default_value) ? im.default_value : -1;
				fds[i].setValue(defalut_value);
			}
            /////////////////////////////////
            // 处理筛选器联动
			var table = im.dimtable;
			var filter = { dim: im, fd : fds[i]};
			isset(dimFilterMap[table]) ? dimFilterMap[table].push(filter) : dimFilterMap[table] = [filter];
			fds[i].on('change',(function(){
				var args = i;
				return function() {
                    thiso.query();
                    var isassoc = isAssoc(list[args].dimid);
                    if(isassoc) {
                        thiso.changeData = {
                            dimtable: list[args].dimtable,
                            value: fds[args].value
                        };
                        thiso.fire('change');
                    }
				}
			})());   //!< 值变换后,自动query
            /////////////////////////////////
		}
		////////////////////////////////////////////////////////
	}/*}}}*/

	// 初始化
	this.init=function() 
	{/*{{{*/
		//1. 初始化布局
		var code = '<div class="box-topbar mwt-border-bottom" id="'+topDomId+'">'+
			'<div class="box-title"  id="'+titleDomId+'"></div>'+   	//!< 标题
			'<div class="box-filter" id="filter-'+render+'"></div>'+	//!< 筛选项
		'</div>'+
		'<div class="box-body"   id="'+chartid+'"></div>'+				//!< 主体
		'<div class="box-loading" id="'+loadingDomId+'"></div>';		//!< loading蒙层
		jQuery('#'+render).html(code);
		////////////////////////////////////////////////////////////
		// 如果设置了本地数据,就直接显示本地数据了(report)
		if (this.data) {
			jQuery('#'+topDomId).hide();
			var jloading = jQuery('#'+loadingDomId);
			jloading.show();
			var thiso = this;
			setTimeout(function(){
				jloading.hide();
				thiso.showData();
			},1500);
			return;
		}
		////////////////////////////////////////////////////////////
		//2. 显示Title
		cubicInfo = require('model/cubic').get(cubicid);
		this.showTitle();

		//3. 初始化filter
		var filters = [];
		ajax.post('cubeapi&action=query_filters',{cubeid:cubeid,cubicid:cubicid},function(res){
			if (res.retcode==0) { filters = res.data; }
		},true);
		this.filter_form = new MWT.Form();
		if (filters.length>0) {
			this.init_filters(filters);
		}

		//4. 查询
		this.query();
	};/*}}}*/

	// 查询数据
	this.query = function() 
	{/*{{{*/
		var queryAPI = 'cubicapi&action=query_data';
		var params = this.filter_form.getData();
		//params.cubeid = cubeid;
		params.cubicid = cubicid;
		///////////////////////////////////////////
		// 非cubic还是走老的cube查询逻辑
		if (!params.cubicid) {
			params.cubeid = cubeid;
			queryAPI = 'cubeapi&action=query';
		}
		///////////////////////////////////////////
		var thiso=this;
		var jloading = jQuery('#'+loadingDomId);
		jloading.show();
		ajax.post(queryAPI,params,function(res){
			setTimeout(function(){
				jloading.hide();
				if (res.retcode!=0) {
					autoAlignTop();
					jQuery('#'+chartid).html('<span class="empty">'+res.retmsg+'</span>');
				} else {
					thiso.data = res.data;
					thiso.showData();
				}
			},1000);
		});
	};/*}}}*/

	// 显示标题
	this.showTitle=function() 
	{/*{{{*/
		var jom = jQuery('#'+titleDomId);
		var align = 'left';
		switch (parseInt(cubicInfo.title_align)) {
			case 2: align='center'; break;
			case 3: align='right'; break;
		}
        var code = '<a href="javascript:;"><i class="fa fa-cube"></i> '+cubicInfo.title+'</a>';
		jom.html(code).css({'text-align':align});
		if (cubicInfo.title_show==1) jom.show();
		else jom.hide();
	};/*}}}*/

	// 设置视图组件
	this.setCvid=function(newcvid) 
	{/*{{{*/
		cvid = newcvid;
		this.showData();
	};/*}}}*/

	// chart顶部距离对齐
	function autoAlignTop() 
	{/*{{{*/
		var topHeight = jQuery('#'+topDomId).height();
		if (topHeight==0) topHeight=10;
		jQuery('#'+chartid).css({'top':topHeight+'px'});
	};/*}}}*/

	// 显示数据
	this.showData=function()
	{
		//1. chart顶部距离
		autoAlignTop();
		//2. 根据选择的视图渲染
		try {
			switch (cvid) {
				case 'ChartTable': require('./chart_table').show(chartid,this.data,cubeid); break;
				case 'ChartLine': require('./chart_line_bar').show(chartid,this.data,cubeid,'line'); break;
				case 'ChartBar': require('./chart_line_bar').show(chartid,this.data,cubeid,'bar'); break;
				case 'ChartBarStack': require('./chart_line_bar').show(chartid,this.data,cubeid,'bar','one'); break;
				case 'ChartScatter': require('./chart_scatter').show(chartid,this.data,cubeid); break;
				case 'ChartPie': require('./chart_pie').show(chartid,this.data,cubeid); break;
				case 'ChartFunnel': require('./chart_funnel').show(chartid,this.data,cubeid); break;
				case 'ChartRadar': require('./chart_radar').show(chartid,this.data,cubeid); break;
				case 'ChartIndex': require('./chart_index').show(chartid,this.data,cubeid); break;
				case 'ChartRank': require('./chart_rank').show(chartid,this.data,cubeid); break;
				default:
					throw new Error('unknow cube view: ['+cvid+']');
					break;
			}
		} catch (e) {
			if (e.name=='Error') {
				require('./util').showExceptionMsgInBox(chartid,e.message);
			}
			throw e;
		}
	};

	// 筛选器联动
	this.filterAssoc=function(data){
		if(!isset(dimFilterMap[data.dimtable])){
			return;
		}
		var filters = dimFilterMap[data.dimtable];
		for(var index=0; index<filters.length; index++) {
			var filter = filters[index];
            var isassoc = isAssoc(filter.dim.dimid);
            //不关联字段直接pass
            if(!isassoc){
            	continue;
			}
			//跟原值不一致才触发修改事件，防止递归触发
			var fd = filter.fd;
			if(fd.value != data.value) {
                fd.setValue(data.value);
                fd.fire('change');
            }
        }
	};

	function isAssoc(dimid){
		return !in_array(dimid, cubicInfo.not_assoc_dims);
	}
};
MWT.extends(ChartView,MWT.Event);

return ChartView;
});

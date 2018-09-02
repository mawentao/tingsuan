define(function(require){
	/* 指标看板 (一个日期维度,1-N个指标)  */
	var util=require('./util');
	var o={};

	o.show=function(domid,data,cubeid) { 
		//1. 抽取日期维度key
		var dateColKey = '';
		for (var ck in data.annex.headmap) {
			var colInfo = data.annex.headmap[ck];
			if (colInfo['dimtable']=='date') {
				dateColKey = ck;
			}
			else if (colInfo['dimtable']) {
				util.showExceptionMsgInBox(domid,'指标看板必须选择日期分组，且不能选择其他分组');
				return;
			}
		}
		if (dateColKey=='') {
			util.showExceptionMsgInBox(domid,'指标看板必须选择日期分组，且不能选择其他分组');
			return;
		}
		//2. 抽取日期列表按时间倒序
		var dateList = [];
		var dateMap = {};
		for (var i=0;i<data.root.length;++i) {
			var row = data.root[i];
			var dateColValue = row[dateColKey];
			dateList.push(dateColValue);
			dateMap[dateColValue] = row;
		}
		if (dateList.length==0) {
			util.showExceptionMsgInBox(domid,'查询数据为空');
			return;
		}
		dateList = dateList.sort(function(a,b){return a<b ? 1 : -1;});
		//3. 抽取指标
		var metrics = [];
		for (var ck in data.annex.headmap) {
			var colInfo = data.annex.headmap[ck];
			if (colInfo['mkey']) {
				metrics.push(colInfo);
			}
		}
		//4. 对照,环比,同比日期
		var daten = dateList.length;
		var dateratio = [dateList[0],dateList[0],dateList[0]];
		if (daten>1) dateratio[1]=dateList[1];
		dateratio[2] = dateList[daten-1];
		//5. 显示看板
		show_panels(domid,metrics,dateMap,dateratio);
	};

	// 画指标看板(多个)
	function show_panels(domid,metrics,datamap,days)
	{/*{{{*/
		// 自动布局c * r 格
		var n = metrics.length;
		var width = jQuery('#'+domid).width();
		var height = jQuery('#'+domid).height()-30;
		var wh = width/height;
		var c=r=1;
		var maxc = parseInt(width/250);	//!< 最大列数(指标看板最小宽度为250)
		if (maxc<1) maxc=1;
		while (c*r<n) {
			if (c/r<wh && c<maxc) ++c;
			else ++r;
		}
		// render table
		var code = '<table class="chart-index-tab"><tr>';
		for (var i=0;i<metrics.length;++i) {
			if (i!=0 && i%c==0) code +='</tr><tr>';
			var mim = metrics[i];
			var mkey = mim.mkey;
			var mformat = mim.mformat;   //!< 指标的格式化
			var v1 = (datamap[days[0]] && datamap[days[0]][mkey]) ? datamap[days[0]][mkey] : 'NaN';
			var v2 = (datamap[days[1]] && datamap[days[1]][mkey]) ? datamap[days[1]][mkey] : 'NaN';
			var v3 = (datamap[days[2]] && datamap[days[2]][mkey]) ? datamap[days[2]][mkey] : 'NaN';

			code += '<td>'+mim.mname+'<i class="sicon-question" pop-title="'+mim.mdesc+'" pop-cls="mwt-popover-danger"></i>'+
				'<br><span class="sub">'+util.get_format_date_index(days[0])+': </span><em>'+metric_format(v1,mformat)+'</em>'+
				'<p class="sub">'+util.get_format_date_index(days[1])+'环比:'+
					'<span class="submetric">'+metric_format(v2,mformat)+'</span>'+compare_index(v1,v2)+'</p>'+
				'<p class="sub">'+util.get_format_date_index(days[2])+'同比:'+
					'<span class="submetric">'+metric_format(v3,mformat)+'</span>'+compare_index(v1,v3)+'</p>'+
			'</td>';
		}
		code += '</tr></table>';
		jQuery('#'+domid).html(code);
		mwt.popinit();

	}/*}}}*/

	
	// 指标对比
	function compare_index(a,b) 
	{/*{{{*/
		var ratio = '-';
		var cls = 'flat';
		if (a!='NaN' && b!='NaN') {
			var df = a-b;  //!< 差值
			if (df>0) cls = 'rise';
			if (df<0) cls = 'fall';
			if (b!=0) ratio = metric_format(Math.abs(df/b),100);
		}
		return '<span class="ratio '+cls+'">'+ratio+'</span>';
	}/*}}}*/

	return o;
});

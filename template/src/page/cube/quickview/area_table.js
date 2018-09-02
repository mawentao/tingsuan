define(function(require){
    // 表格显示
    var cubeInfo;
    var domid;
    var timeSeq,timeMap,headmap;
    var cellnum=5;
    var pidx = -1;
    
    // 获取格式化的日期
    function getDayLabel(day)
    {/*{{{*/
        var weekarr = ['日','一','二','三','四','五','六'];
        var dt = new Date(day);
        var week = dt.getDay();
        var tm = strtotime(day);
        return date('m.d',tm)+'(周'+weekarr[week]+')';
    }/*}}}*/


    // 获取前n天的日期
    function getBeforeDay(day, beforeDays)
    {/*{{{*/
        var tm = strtotime(day);
        tm = tm + 86400*beforeDays;
        return date('Y-m-d',tm);
    }/*}}}*/

    // 获取某天的指标值
    function getValueOnDay(day,mkey)
    {/*{{{*/
        var item = timeMap[day];
        if (item && item.data && item.data[mkey]) {
            return item.data[mkey];
        }
        return 'NaN';
    }/*}}}*/

    // 计算变化
    function getDlt(a,b)
    {/*{{{*/
        if (a=='NaN' || b=='NaN' || b==0) return '<em>NaN</em>';
        var cls = '';
        var dlt = a-b;
        if (dlt<0) cls="fall";
        else if (dlt>0) cls="rise";
        var percent = parseInt(dlt*10000 / b);
        return '<em class="'+cls+'">'+(percent==0 ? '-' : percent/100+'%')+'</em>';
    }/*}}}*/

    // 显示数据
    function showData() 
    {/*{{{*/
        if (!timeSeq) return;
        var day0 = timeSeq[pidx];
        var day1 = getBeforeDay(day0,-1);
        var day7 = getBeforeDay(day0,-7);

        var data = timeMap[day0];
        var trs = [];
        for (var mkey in headmap) {
            var head = headmap[mkey];
            if (!head.mid) continue;
            var v0 = getValueOnDay(day0,mkey);
            var v1 = getValueOnDay(day1,mkey);
            var v7 = getValueOnDay(day7,mkey);
            var tr = '<tr>'+
                '<td><em>'+metric_format(v0,head.mformat)+'</em><br>'+head.mname+'</td>'+
                '<td class="rt">'+getDlt(v0,v1)+'<br>'+metric_format(v1,head.mformat)+'</td>'+
                '<td class="rt">'+getDlt(v0,v7)+'<br>'+metric_format(v7,head.mformat)+'</td>'+
            '</tr>';
            trs.push(tr);
        }

        var code = '<tr><th>'+getDayLabel(day0)+'</th><th class="rt">日环比</th><th class="rt">周同比</th></tr>'+
                trs.join('');
        jQuery('#tbody-'+domid).html(code);
    };/*}}}*/

	var o={};

	o.init=function(_domid,_cubeInfo) {
        domid = _domid;
        cubeInfo = _cubeInfo;
		var cubeid = cubeInfo.cubeid;
        var code = '<table class="quick-view-tab" style="margin-top:10px;">'+
            '<tr><td class="cell" style="padding:0;" colspan="99" id="tbar-'+domid+'"></td></tr>'+
            '<tbody id="tbody-'+domid+'"></tbody>'+
        '</table>';
		jQuery('#'+domid).html(code);
        /*
        var bar = new mwt.Bar({
            render: "tbar-"+domid,
            style : 'background:#f1f1f1;',
            items  : [
                {id:'time-fz-radbtn',type:'radiobtn',value:'0',style:'width:200px;',class:'mwt-btn-default',
                 options:[{text:'分日期',value:'0'},{text:'日期汇总',value:'1'},{text:'日均',value:'2'}],handler:showData},
                '->',
                {html: '<div id="fdiv-'+domid+'" style="width:300px;text-align:right;">'+
                  '<span id="fday-'+domid+'" style="font-size:13px;margin-right:10px;"></span>'+
                  '<div class="mwt-btn-group-radius">'+
                    '<button id="prevbtn-'+domid+'" class="mwt-btn mwt-btn-default mwt-btn-sm">'+
                        '<i class="fa fa-angle-left" style="font-size:16px;"></i></button>'+
                    '<button id="nextbtn-'+domid+'" class="mwt-btn mwt-btn-default mwt-btn-sm">'+
                        '<i class="fa fa-angle-right" style="font-size:16px;"></i></button>'+
                  '</div>'+
                '</div>'}
            ]
        });
        bar.create();*/
        // 
        jQuery('#prevbtn-'+domid).unbind('click').click(function(){
            pidx>0 && --pidx;
            showData();
        });
        jQuery('#nextbtn-'+domid).unbind('click').click(function(){
            pidx<timeSeq.length-1 && ++pidx;
            showData();
        });
	};

    o.show=function(_timeSeq,_timeMap,_headmap) {
        timeSeq = _timeSeq;
        timeMap = _timeMap;
        headmap = _headmap;
        pidx = timeSeq.length-1;
//        if (!timeSeq[pidx]) pidx = timeSeq.length-1;
        showData();
    };

    return o;       
});

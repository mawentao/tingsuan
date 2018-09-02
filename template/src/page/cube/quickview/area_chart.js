define(function(require){
    // 各指标走势图
    var cubeInfo;
    var domid;
    var timeSeq,timeMap,headmap;
	var o={};

	o.init=function(_domid,_cubeInfo) {
        domid = _domid;
        cubeInfo = _cubeInfo;
		var cubeid = cubeInfo.cubeid;
        var code = '<div id="chart-'+domid+'" style="height:250px;"></div>';
        jQuery('#'+domid).html(code);
    };


    o.show=function(_timeSeq,_timeMap,_headmap) {
        timeSeq = _timeSeq;
        timeMap = _timeMap;
        headmap = _headmap;

        //1. series
        var series = [];
        var serieMap = {};
        var i=0;
        for (var mkey in headmap) {
            var head = headmap[mkey];
            if (!head.mid) continue;
            series.push({
                text: head.mname,
                mkey: mkey,
                data: []
            });
            serieMap[mkey] = i;
            ++i;
        }
        //2. x轴
        var xdata = [];
        var weekarr = ['日','一','二','三','四','五','六'];
        for (var i=0;i<timeSeq.length; ++i) {
            var day = timeSeq[i];
            var week = new Date(day).getDay();
            var tm = strtotime(day);
            xdata.push(date('m.d',tm)+'\n周'+weekarr[week]);
            // series data
            var data = timeMap[day];
            for (var s=0;s<series.length;++s) {
                var sim = series[s];
                var v = 0;
                if (data && data.data && data.data[sim.mkey]) {
                    v = data.data[sim.mkey];
                }
                sim.data.push(v);
            }
        }

        var data = {
            x: {data: xdata},
            series: series /*[ 
                {text:'pv',data:[21,23,43,63,75]},
                {text:'uv',data:[11,13,33,45,55]}
            ]*/
        };
        require('./linechart').show('chart-'+domid,data,'指标走势');
    };

    return o;
});

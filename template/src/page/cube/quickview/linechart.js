/**
 * 趋势图
 * 使用: require("common/linechart").show(domid, data);
 * 其中data的数据结构如下:
 * {
 *   x: {data: ['1.1','1.2','1.3','1,.4','1.5']},
 *   series: [
 *     {text:'pv',data:[21,23,43,63,75]}, 
 *     {text:'uv',data:[11,13,33,45,55]} 
 *   ]
 * }
 **/
define(function(require){
    var o={};
    //require("echarts");
    var chart,echarts_theme;

    function array_reverse(arr) {
        var res = [];
        if (arr.length>0) {
            for (var i=arr.length-1; i>=0; --i) {
                res.push(arr[i]);
            }
        }
        return res;
    }

    o.show = function(domid,data,title) {
		var dom = document.getElementById(domid);
        chart = echarts.init(dom,dz.echarts_theme);
        var legend_data = []; 
        var xdata = data.x.data;
        var series = [];
        var not_selected_lengend = {}; 
        var sn = data.series.length;
        for (var i=0;i<sn; ++i) {
            var sim=data.series[i];
            legend_data.push({name:sim.text,icon:'circle'});
            var yix = (i>0&&i==sn-1) ? 1 : 0;   //!< 最后一条serie用副纵轴
            var ser = { 
                name       : sim.text,
                type       : 'line',
                areaStyle  : {},
                radius     : '55%',
                yAxisIndex : yix,
                center     : ['50%', 225],
                data       : sim.data,
                markLine   : { 
                   data : [ 
                      //{type : 'average', name: '平均值'}
                   ]   
                }   
            };  
            series.push(ser);
            if (i>0)
                not_selected_lengend[sim.text] = false;
        }   
        var option = { 
            title: {text:title, subtext:'', x:'left',textStyle:{fontSize:16,color:'#FDD89A'}},
            toolbox: {
                show: true,
                iconStyle: {borderColor:'#888'},
                feature: {
                    mark : {show: true},
                    dataView : {show: false, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                    restore: {show: true},
                    saveAsImage: {show: false}
                }   
            },
            tooltip: {
                trigger: 'axis',
                //formatter: "<b>{b}</b><br>{a0} : {c0}<br>{a1} : {c1}<br>{a2} : {c2}"
            },  
            legend: {x:'center', y:'bottom',data:legend_data,
                type: 'scroll',
                textStyle: {color:'#fff'}
            },
            grid: {left:'60',right:'60',top:'45',bottom:'60',show:true,borderWidth:0},
            calculable: true,
            xAxis: [{
                type:'category', data:xdata,
                splitLine: {show:false},
                axisLine: {lineStyle:{color:'#888'}},
                axisLabel: {color:'#fff'}
            }],
            yAxis: [
                {
                    type: 'value', scale: true,
                    splitArea: {show:true},
                    splitLine: {show:false},
                    axisLine: {lineStyle:{color:'#888'}}
                },{
                    type: 'value', scale: true,
                    splitArea: {show:false},
                    splitLine: {show:false},
                    axisLine: {lineStyle:{color:'#888'}}
                }
            ],
            series: series
        };
        if (sn>1) {
            option.yAxis.push({
                type:'value', scale:true, splitArea:{show:true}
            });
        }
        chart.clear();
        chart.setOption(option);
    };

    return o;
});

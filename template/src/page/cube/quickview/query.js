define(function(require){
    /* query.js, (c) 2017 mawentao */
    var cubeInfo;
    var dateKey = '';

    // 如果今日数据有,显示到今天,否则显示到昨天
    function checkTodayData(timeSeq,timeMap)
    {/*{{{*/
        var n = timeSeq.length;
        if (n<=0) return;
        var lastDay = timeSeq[n-1];
        var today = date('Y-m-d');
        if (lastDay == today) {
            var lastItem = timeMap[lastDay];
            if (!lastItem.data) {
                timeSeq.pop();
                delete timeMap[lastDay];
            }
        }        
    }/*}}}*/

    // 数据格式转换
    function dataTrans(data)
    {/*{{{*/
        //1. 计算时间序列
        var vday = mwt.get_value('dt-dim-cube-filter-bar-'+cubeInfo.cubeid);
        var arr = vday.split(" ~ ");
        var sday = arr[0];
        var eday = arr[1];
        var stm = strtotime(sday);
        var etm = strtotime(eday);
        var i = 0;
        var timeSeq = [];
        var timeMap = {};
        for (var tm=stm;tm<=etm;tm+=86400) {
            var day = date('Y-m-d',tm);
            timeSeq.push(day);
            timeMap[day] = {idx:i};
            ++i;
        }
        //2. 汇总
        timeMap['sum'] = {data:{}};
        for (var mkey in data.annex.headmap) {
            var head = data.annex.headmap[mkey];
            if (!head.mid) continue;
            timeMap['sum'].data[mkey] = 0;
        }
        //3. 映射到timeMap
        for (var i=0;i<data.root.length;++i) {
            var row = data.root[i];
            if (row[dateKey]) {
                var d = row[dateKey];
                timeMap[d]['data'] = row;
                // 汇总求和
                for (var k in timeMap['sum'].data) {
                    timeMap['sum'].data[k] += parseFloat(row[k]);
                }
            }
        }
        //////////////////////////////////
        // 如果今天有数据,显示今天
        checkTodayData(timeSeq,timeMap);
        //////////////////////////////////
        //3. 表格显示
        require('./area_table').show(timeSeq,timeMap,data.annex.headmap);
        //4. 各指标走势图
        require('./area_chart').show(timeSeq,timeMap,data.annex.headmap);
    }/*}}}*/

    var o={};
    o.init=function(_cubeInfo){
        cubeInfo = _cubeInfo;
        for (var i=0; i<cubeInfo.dims.length; ++i) {
            var dim = cubeInfo.dims[i];
            if (dim.dimtable=='date') {
                dateKey = dim.dimkey;
                break;
            }
        }
        o.query();
    };
    o.query=function() {
        //var params = {};
        var params = require('./area_dim').get();
        params['metrics'] = require('./area_metric').get();
        params.cubeid = cubeInfo.cubeid;
        params.start = 0;   //!< 
        params.limit = 0;   //!< 不分页
        //console.log(params);
        var msgid = mwt.notify('正在查询...',0,'loading');
        ajax.post('cubeapi&action=query_data',params,function(res){
            mwt.notify_destroy(msgid);
            if (res.retcode!=0) {
                mwt.notify(res.retmsg,1500,'danger');
            } else {
                dataTrans(res.data);
                ////////////////////////////////
                autoRizeIframeHeight();
                ////////////////////////////////
            }
        });
    };
    return o;
});

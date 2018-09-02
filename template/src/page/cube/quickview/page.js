define(function(require){
    /* page.js, (c) 2018 mawentao */
    var cubeModel = require('model/cube');
    var frame = require('frame');
    var filterBar = require('./filter_bar');
    var BasePage = require('core/BasePage');
    var o=new BasePage({
        id: 'cube/quickview'
    });

    o.open=function(query,domid) {
        jQuery('body').css({background:'#272936',color:'#ccc'});
        var cubeId = query.cubeid ? query.cubeid : 0;
        if (cubeId==0) {
            var msg = '页面找不到或已删除';
            textblock.danger(msg,domid);
            return;
        }
        //1. 获取cube详情
        var cubeInfo = cubeModel.getCube(cubeId);
        if (!cubeInfo.cubeid) {
            textblock.warning(cubeInfo);
            return;
        }
        //2. 初始化页面布局
        setPageTitle(cubeInfo.cubename);
        var vid = domid+'-'+cubeId;
        var logo = frame.getLogo();
        var code = '<div class="h5head">'+
                '<img src="'+logo+'" style="width:16px;height:16px;"> '+cubeInfo.cubename+
                '<a id="filter-btn-'+domid+'" href="javascript:;" class="filterbtn">'+
                    '<i class="fa fa-filter"></i> 筛选'+
                '</a>'+
            '</div>'+
            '<div id="chart-'+vid+'" style="margin:50px 0 20px;"></div>'+
            '<div id="table-'+vid+'"></div>'+
            frame.getCopyright();
        jQuery('#'+domid).html(code);
//        jdom.html(code);
//        print_r(cubeInfo);
        //3. 初始化各方区域
        filterBar.init(cubeInfo);
        require('./area_chart').init('chart-'+vid,cubeInfo);
        require('./area_table').init('table-'+vid,cubeInfo);
        require('./query').init(cubeInfo);
        
        //4. 过滤按钮
        jQuery('#filter-btn-'+domid).unbind('click').click(function(){
            filterBar.open();
        });
        //filterBar.open();
    };

    return o;
});

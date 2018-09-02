define(function(require){
    /* canvas.js, (c) 2018 mawentao */
    var cubeModel = require('model/cube');
    var cubicModel = require('model/cubic');
    var ChartView=require('chartview/main');   //!< cube视图组件
    var domid,boardInfo;
    var o={};

    var wd = document.body.clientWidth < 677 ? document.body.clientWidth : 677;
    var CELL_HEIGHT = wd / 8;

    // 初始化canvas
    o.init = function(_domid,_boardInfo) 
    {
        domid = _domid;
        boardInfo = _boardInfo;
        var boxes = boardInfo.options;
        ////////////////////////////////////
        // 按y排序
        boxes.sort(function(a,b){return parseInt(a.y)>parseInt(b.y) ? 1 : -1;});
        ////////////////////////////////////
        var widgets = []; 
        for (var i=0;i<boxes.length;++i) {
            var im = boxes[i];
            var h = im.h * CELL_HEIGHT;
            var code = '<div id="box-'+im.cubicid+'" class="box" style="height:'+h+'px;"></div>';
            widgets.push(code);
        }
        var code = widgets.join('');
        jQuery('#'+domid).html(code);

        // 显示box
        for (var i=0;i<boxes.length;++i) {
            var im = boxes[i];
            var boxdomid = 'box-'+im.cubicid;
            showBox(boxdomid,im);
        }
    };

    // 显示box
    function showBox(boxdomid,boxInfo)
    {
        var cubeid = boxInfo.cubeid;
        var cubeInfo = cubeModel.getCube(cubeid);
        if (is_string(cubeInfo)) {
            textblock.warning(cubeInfo,boxdomid);
            return;
        }

        // 创建cube可视化组件
        var cubicid = boxInfo.cubicid;
        cubeInfo.cubicid = cubicid;
        //////////////////////////////////////////
        // cvid从cube移到cubic
        if (cubicid!=0) {
            var cubicInfo = cubicModel.get(cubicid);
            if (cubicInfo && cubicInfo.cvid!='') {
                cubeInfo.cvid = cubicInfo.cvid;
            }   
        }
        //////////////////////////////////////////
        // 重构后的视图组件
        cubeInfo.render = boxdomid;
        var cv = new ChartView(cubeInfo);
        cv.init();
    }


    return o;
});

define(function(require){
    /* page.js, (c) 2018 mawentao */
    var boardModel = require('model/board');
    var cubeModel = require('model/cube');
    var frame = require('frame');
    var BasePage = require('core/BasePage');
    var o=new BasePage({
        id: 'cube/board'
    });

    o.open=function(query,domid) {
        jQuery('body').css({background:'#e2e3e4',color:'#333'});
        var b = query.b ? query.b : '';
        if (b == '') {
            var msg = '页面找不到或已删除';
            textblock.danger(msg,domid);
            return;
        }
        //1. 获取看板信息
        var boardInfo = boardModel.getBoard(b);
        if (is_string(boardInfo)) {
            textblock.warning(boardInfo);
            return;
        }
        //2. 初始化页面布局
        setPageTitle(boardInfo.board_title);
        var vid = domid+'-'+boardInfo.bid;
        var logo = frame.getLogo();
        var code = '<div class="h5head" style="color:#fff;">'+
                '<img src="'+logo+'" style="width:16px;height:16px;"> '+boardInfo.board_title+
                getExtBtns(boardInfo)+
//                '<a id="filter-btn-'+domid+'" href="javascript:;" class="filterbtn">'+
//                    '<i class="fa fa-filter"></i> 筛选'+
//                '</a>'+
            '</div>'+
            '<div id="bordy-'+vid+'" style="margin:50px 0 0px;"></div>'+
            frame.getCopyright();
        jQuery('#'+domid).html(code);


        //3. 初始化canvas
        require('./canvas').init('bordy-'+vid,boardInfo);
        ////////////////////////////////
        autoRizeIframeHeight();
        ////////////////////////////////
    };

    function getExtBtns(board) {
        var adminbtn = ''; 
        if (dz.uid==board.uid) {
            var dzurl = dz.siteurl+'plugin.php?id=datacube#/design~b='+board.board_id;
            adminbtn = '<a style="margin-left:16px;" class="adminbtn" href="'+dzurl+'" target="_blank">[编辑]</a>';
        }
        return adminbtn;
    };

    return o;
});

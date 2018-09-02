define(function(require){
    /* 筛选侧边栏, (c) 2018 mawentao */
    var sidebar;
    var o={};

    o.init = function(cubeInfo) {
        var domid = 'cube-filter-bar-'+cubeInfo.cubeid;
        sidebar = new MWT.SideBar({
            render   : domid,
            position : 'right',
            width    : '80%',
            bodyStyle: "background:#fff;padding:20px 10px;",
            pagebody : '<div class="filter-body">'+
                    '<div class="filter-head mwt-border-bottom"><i class="sicon-hourglass"></i> 维度</div>'+
                    '<div id="dim-'+domid+'"></div>'+
                    '<div class="filter-head mwt-border-bottom"><i class="sicon-bar-chart"></i> 指标</div>'+
                    '<div id="metric-'+domid+'"></div>'+
                '</div>'+
                '<div class="filter-foot mwt-row">'+
                    '<div class="mwt-col-8 btn" id="viewbtn-'+domid+'">完成</div>'+
                    '<div class="mwt-col-4 btn" id="cancelbtn-'+domid+'" style="background:#C2F3F9;color:#aaa;">取消</div>'+
                '</div>'
        });
        sidebar.create();

        // 初始化指标区域
        require('./area_dim').init('dim-'+domid,cubeInfo);
        require('./area_metric').init('metric-'+domid,cubeInfo);
        
        // 确定按钮
        jQuery('#viewbtn-'+domid).unbind('click').click(function(){
            sidebar.close();
            setTimeout(function(){
                require('./query').query();
            },100);
        });
        // 取消按钮
        jQuery('#cancelbtn-'+domid).unbind('click').click(function(){
            sidebar.close();
        });
    };

    o.open = function() {
        sidebar.open();
    };

    return o;
});

define(function(require){
    /* area_body.js, (c) 2018 mawentao */
    var o={};
    var domid;

    o.init=function(_domid,config) 
    {
        domid = _domid;
        if (config.link) {
            var code = ''+
                '<iframe id="mobile-portal-iframe" src="'+config.link+'" style="min-height:600px;"></iframe>'+
            '';
            jQuery('#'+domid).html(code);
            return;
        }
        var cells = [];
        var title = '';
        for (var i=0;i<config.items.length;++i) {
            var im = config.items[i];
            if (im.type=='partition') {
                if (cells.length) {
                    showPartition(cells,title);
                    cells = [];
                }
                title = '<span>'+im.title+'</span>';
                continue;
            }
            cells.push(im);
        }
        if (cells.length) {
            showPartition(cells,title);
            cells = [];
        }
    };

    function showPartition(cells,title,icon)
    {
        var cols = 4;   //!< 一行4列
        var rows = Math.ceil(cells.length/cols);

        var code = '<div class="mwt-border-bottom partition-title">'+title+'</div>';
        var ls = [];
        for (var i=0;i<rows*cols;++i) {
            if (i!=0 && i%cols==0) {
                code += getRow(ls,cols);
                ls = [];
            }
            if (cells[i]) {
                ls.push(cells[i]);
            }
        }
        if (ls.length) code += getRow(ls,cols);
        jQuery('#'+domid).append(code);
    }

    function getRow(cells,cols) 
    {
        var colors = ['#5AB1EF','#F18A85','#2EC7C9','#B6A2DE','#FFB980'];
        var n = colors.length;

        //var code = '<div class="mwt-border-bottom">'+
        var code = '<div>'+
                '<div class="mwt-row mwt-row-flex">';
        for (var i=0;i<cols;++i) {
            //var bd = (i==0) ? '' : 'mwt-border-left';
            var bd = (i==0) ? '' : '';
            code += '<div class="mwt-col-fill foot-item '+bd+'">';
            if (cells[i]) {
                var cell = cells[i];
                var colori = (cell.title.length+3) % n;// parseInt(Math.random()*1000) % n;
                var color = colors[colori];
                code += '<a href="'+cell.link+'" class="cella">'+
                    '<i class="'+cell.icon+'" style="color:'+color+'"></i><p>'+cell.title+'</p>'+
                '</a>';
            }
            code += '</div>';
        }
        code += '</div></div>';
        return code;
    }

    return o;
});

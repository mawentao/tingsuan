define(function(require){
    /* flow.js, (c) 2018 mawentao */
    var domid,store,flow,sort;
    var o={};

    o.init = function(_domid,_sort) {
        domid = _domid;
        sort = _sort;
        store=new mwt.Store({
            proxy: new mwt.HttpProxy({
                url : ajax.getAjaxUrl("exam&action=queryMine")
            })
        });
        flow = new mwt.Flow({
            render  : domid,
            store   : store,
            pageSize: 10,
            itemRenderFun: function(item) {
                var url = "#/exercise/result~id="+item.id;
                var color = '#aaa';
                var score = item.accuracy*100;
                if (score>=100) color = '#9C27B0';
                else if (score>=90) color = '#F44336';
                else if (score>=80) color = '#F90';
                else if (score>=70) color = '#03A9F4';
                else if (score>=60) color = '#009688';

                var code = '<a class="weui_cell mwt-border-bottom" href="'+url+'">'+
                    '<div class="weui_cell_hd">'+
                      '<span class="score-bage" style="background:'+color+'">'+
                        number_format(score)+'分</span>'+
                    '</div>'+
                    '<div class="weui_cell_bd weui_cell_primary"><p>'+item.title+'</p></div>'+
                    '<div class="weui_cell_ft">'+
                        '<span style="font-size:12px;">'+item.beginTime.substr(0,10)+'</span>'+
                        '<i class="icon icon-right"></i>'+
                    '</div>'+
                '</a>';
                return code;
            }
        });
        flow.create();
        o.query();
    };

    o.query=function() {
        store.baseParams = {
            sort: sort
        };
        flow.load();
    };

    return o;
});

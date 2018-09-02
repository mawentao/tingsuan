define(function(require){
	/* 维度筛选区域 */
    var DimSelect = require('./DimSelect');
    var dimForm,dimMap = {};
    var dateKey = '';
    var group_dims = [];

    function init_dims(domid,data,maxnum)
    {
        dateKey = 'vday';
        dimMap = {};
        group_dims = [];
		dimForm = new MWT.Form();
        //1. 布局
        var maxwx=maxnum+1; //!< 一行最多放几个筛选器
        var code = '';
        if (data.length>maxwx) {code+='<table class="filter-tab"><tr>';}
        for (var i=0; i<data.length; ++i) {
            if (i>0 && i%maxwx==0) {
                code += '</tr><tr>';
            }   
            var im = data[i];
            // 日期维度特殊处理
            if (im.dimtable=='date') {
                group_dims.push(im.dimid);
                dateKey = im.dimkey;
                continue;
            }
            code += '<td width=100><label>'+im.dimname+':</label></td>'+
                    '<td id="dim-select-div-'+im.dimid+'"></td>';
            var field = new DimSelect({render:'dim-select-div-'+im.dimid,dimInfo:im});
            /*
            field.on('change',function(){
                require('./query').query();
            });*/
            dimForm.addField(im.dimkey,field);
        }
        if (data.length>maxwx) {code += '</tr></table>';}   
        jQuery('#'+domid).html(code);

        //2. 初始化每个维度筛选器
        dimForm.create();
    }

	var domid,o={};
	o.init=function(_domid,cubeInfo) {
        domid = _domid;
		var cubeid = cubeInfo.cubeid;
        ///////////////////////////////////////////////////
        // 时间区间默认近30天到今天(与PC版不同)
        var dt1 = date('Y-m-d',time()-86400*30);
        var dt2 = date('Y-m-d');
        var dts = dt1+' ~ '+dt2;
        ///////////////////////////////////////////////////
		//1. 初始区域
        var code = '<div id="dtfield-'+domid+'" style="display:none;"></div>'+
                '<div style="" id="dimsel-'+domid+'"></div>';

        jQuery('#'+domid).html(code);
        // 日期
        var drfd = new MWT.DaterangepickerField({
            id : 'dt-'+domid,
            render: 'dtfield-'+domid,
            format: "yy/mm/dd",
            value: dts
        });
        drfd.create();
        //2. 初始化维度选择器
        var maxnum = Math.floor((jQuery('#'+domid).width()-350)/200);
        init_dims('dimsel-'+domid,cubeInfo.dims,maxnum); 
	};
    // 获取筛选值
    o.get=function() {
        var res = {
            group_dims: group_dims,
            filter_dims: dimForm.getData()
        };
        res.filter_dims[dateKey] = mwt.get_value('dt-'+domid);
        return res;
    };
	return o;
});

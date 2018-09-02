define(function(require){
    /* 维度表数据集 */
	var dim_map={};
	var o={};
	o.get=function(dim_table){
		if (dim_map[dim_table]) return dim_map[dim_table];
		dim_map[dim_table] = {};
		ajax.post('cubeapi&action=get_dim_data',{table_name:dim_table},function(res){
			if (res.retcode!=0) alert(res.retmsg);
			else {
				dim_map[dim_table] = res.data;
			}
		},true);
		return dim_map[dim_table];
	};
	return o;
});

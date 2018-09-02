define(function(require){
    var o={};
    // 权限字典
    var auth_dict = {
        '0': '无权限',
        '1': '<span style="color:blue;">普通用户</span>',
        '2': '<span style="color:red">高级用户</span>',
    };
   
    o.get_auth=function(id) {
        return auth_dict[id] ? auth_dict[id] : id;
    };

    o.get_auth_options=function(firstoption) {
        return tooptions(auth_dict,firstoption);
    };


	// dict转成options
	function tooptions(dictionary,firstoption) {
		var options = [];
		if (firstoption) options.push(firstoption);
		for(var id in dictionary) {
			options.push({text:dictionary[id],value:id});
		}
		return options;
	}
    return o;
});

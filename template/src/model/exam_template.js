define(function(require){
    /* 听算练习题型 */
    var cache={};
    var o={};

    // 获取题型列表
    o.getAllList=function() 
    {/*{{{*/
        if (!cache['all']) {
            ajax.post('exam&action=getTemplateList',{},function(res){
                if (res.retcode!=0) {
                    mwt.alert({msg:res.retmsg});
                } else {
                    cache['all'] = res.data;               
                }
            },true);
        }
        return cache['all'];
    };/*}}}*/

    return o;
});

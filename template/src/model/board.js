define(function(require){
    /* cube看板 */
    var cache={};
    var o={};


    // 获取看板详情
    o.getBoard=function(b) 
    {/*{{{*/
        if (!cache[b]) {
            ajax.post('design&action=load',{b:b},function(res){
                if (res.retcode!=0) {
                    cache[b] = res.retmsg;
                } else {
                    cache[b] = res.data;
                }
            },true);
        } 
        return cache[b];
    };/*}}}*/


    return o;
});

define(function(require){
    /* 听算练习 */
    var cache={};
    var o={};

    // 加载题目信息(包括列表)
    o.load=function(id) 
    {/*{{{*/
        var key = 'exam:'+id;
        ajax.post('exam&action=getDetail',{id:id},function(res){
            if (res.retcode!=0) {
                mwt.alert({msg:res.retmsg});
            } else {
                cache[key] = res.data;   
            }
        },true);
        return cache[key];
    }/*}}}*/


    // 获取题目信息(包括列表)
    o.get=function(id) 
    {/*{{{*/
        var key = 'exam:'+id;
        if (!cache[key]) {
            return o.load(id);
        }
        return cache[key];
    };/*}}}*/

    return o;
});

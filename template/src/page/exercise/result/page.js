define(function(require){
    /* page.js, (c) 2018 mawentao */
    var BasePage = require('core/BasePage');
    var o=new BasePage({ 
        id: 'exercise/result'
    });
    var domid;

    o.open=function(query,_domid) {
        domid = _domid;
        if (!query.id) {
            window.location = "#/uc";
            return;
        } 
        var examId = query.id;      
        var examDetail = require('model/exam').load(examId);

        var code = '<div id="frame-head" class="mwt-border-bottom" style="background:#fff;">'+
              '<div class="mwt-row mwt-row-flex">'+
                '<div class="mwt-col-wd" style="width:50px;">'+
                  '<ul class="topul">'+
                    '<li><a href="#/uc"><i class="icon icon-left"></i></a></li>'+
                  '</ul>'+
                '</div>'+
                '<div class="mwt-col-fill">'+
                  '<ul class="topul">'+
                    '<li><a href="javascript:;">'+examDetail.title+'</a></li>'+
                  '</ul>'+
                '</div>'+
                '<div class="mwt-col-wd" style="width:50px;"></div>'+
              '</div>'+
            '</div>'+
            '<div id="body-'+domid+'" style="padding:10px 0 20px;background:#fff;"></div>';
        jQuery('#'+domid).html(code);


        var lis = [];
        var stat = {
            total: 0,
            right: 0,
            wrong: 0
        };
        for (var i=0;i<examDetail.examList.length;++i) {
            var im = examDetail.examList[i];
            ++stat.total;
            var msg = '正确答案: '+im.right_answer;
            var tag = '<i class="fa fa-times-circle" style="color:red;"></i>';
            if (im.status==1) {
                tag = '<i class="fa fa-check-circle" style="color:green"></i>';
                msg = '';
                ++stat.right;
            } else {
                ++stat.wrong;
            }
            var code = '<div class="exam-result-list">'+
                    '<span class="xuhao">第'+(i+1)+'题</span>'+
                    im.express.join(' ')+' = '+im.user_answer+
                    '<span class="rt">'+tag+'</span>'+
                  '<p>'+msg+'</p>'+
                '</div>';
            lis.push(code);
        }

        var score = examDetail.accuracy*100;

        var code = '<div class="mwt-border-bottom">'+
                '<div class="mwt-row score-bar">'+
                  '<div class="mwt-col-3"><label>总题数</label><span>'+stat.total+'</span></div>'+
                  '<div class="mwt-col-3"><label>答对</label><span>'+stat.right+'</span></div>'+
                  '<div class="mwt-col-3"><label>答错</label><span>'+stat.wrong+'</span></div>'+
                  '<div class="mwt-col-3"><label>得分</label>'+
                    '<span style="color:#FF5722;">'+number_format(score)+'</span></div>'+
                '</div>'+
            '</div>'+
            lis.join('');
            
        jQuery('#body-'+domid).html(code);

//        print_r(examDetail);

//        textblock.loading('加载题目...',domid);
//        setTimeout(function(){o.init(query);},1000);
    };

    


    return o;
});

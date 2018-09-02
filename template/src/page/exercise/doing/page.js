define(function(require){
    /* page.js, (c) 2018 mawentao */
    var BasePage = require('core/BasePage');
    var o=new BasePage({ 
        id: 'exercise/doing'
    });
    var domid;
    var ExamPlayer = require('./Exam');
    var paused = false;
    var secondsPerExam = 15;   //!< 每题答题秒数
    var examPlayers = [];
    var examDetail;

    o.open=function(query,_domid) {
        domid = _domid;
        activeNav('exercise');
        textblock.loading('加载题目...',domid);
        setTimeout(function(){o.init(query);},1000);
    };

    o.init = function(query) {
        examDetail = require('model/exam').get(query.id);
        var code = '<div class="exam_top">'+
                '<h1>'+examDetail.title+'</h1>'+
            '</div>'+
            '<div id="examnav-'+domid+'"></div>'+
            '<div id="body-'+domid+'"></div>';
        jQuery('#'+domid).html(code);

        examPlayers = [];
        for (var i=0;i<examDetail.examList.length;++i) {
            var examInfo = examDetail.examList[i];
            var opts = {
                render: 'body-'+domid,  
                seconds: secondsPerExam
            };
            var player = new ExamPlayer(examInfo,opts);
            examPlayers.push(player);
        }
        paused = false;
        o.play(examPlayers,0);
    };


    o.play=function(players,i) {
        var n = players.length;
        if (i>=n) {
            o.submit();
            return;
        }
        if (paused) {
            setTimeout(function(){o.play(players,i);},500);
            return;
        }
        // 本题答题结束
        if (players[i].isFinish) {
            o.play(players,++i);
            return;
        }
        // 未结束
        var code = (i+1)+'/'+n;
        jQuery('#examnav-'+domid).html(code);
        players[i].show();
        setTimeout(function(){
            o.play(players,i);
        },500);
    };


    o.submit = function() {
        paused = true;
        console.log(examDetail);
        var params = {
            exam_id: examDetail.id,
            answers: {}
        };
        for (var i=0;i<examDetail.examList.length;++i) {
            var im = examDetail.examList[i];
            params.answers['exam-'+im.id]= isset(im['user_answer']) ? im['user_answer'] : '';
        }
        var msgid = mwt.notify('正在提交...',0,'loading');
        ajax.post('exam&action=submitAnswers',params,function(res){
            mwt.notify_destroy(msgid);
            if (res.retcode!=0) mwt.alert(res.retmsg);
            else {
                window.location = "#/exercise/result~id="+examDetail.id;
                return;
            }
        });
    };

    return o;
});

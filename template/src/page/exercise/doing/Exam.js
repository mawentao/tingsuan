define(function(require){

function Exam(item,opt)
{
    this.render;
    this.seconds = 10;     //!< 最大答题秒数
    this.isFinish = false;  //!< 结束标记
    this.item = item;
    var voice = new Voice({speed:500,debug:1});

    if (opt) {
        if (opt.render) this.render=opt.render;
        if (opt.seconds) this.seconds=opt.seconds;
    }
    var thiso = this;
    var inited = false;    

    this.show=function() {
        if (inited)  return;
        inited = true;       

        var opts = [];
        var optcnt = item.questionOptions.length;
        for (var i=0;i<optcnt;++i) {
            var v = item.questionOptions[i];
            var btn = '<div class="mwt-col-6 exam-btns">'+
                  '<button name="exam-opt-btn" data-v="'+v+'" '+
                    'class="mwt-btn mwt-btn-default mwt-btn-lg">'+
                    v+'</button>'+
                '</div>';
            opts.push(btn);
        }
        var code = '<div id="exam-timing"></div>'+
            '<div class="mwt-row">'+opts.join('')+'</div>';
        jQuery('#'+this.render).html(code);
        jQuery('[name="exam-opt-btn"]').unbind('click').click(function(){
            var v = jQuery(this).data('v');
            answer(v);
        });
        this.timing(this.seconds);
        this.play();
    };

    // 答题
    function answer(v) 
    {
        thiso.item['user_answer'] = v;
        thiso.finish();
    }

    this.play=function() {
        voice.speekArithmetic(item.express);
    };

    // 答题结束
    this.finish=function() 
    {
        voice.stop();
        this.isFinish = true;
        console.log("本题结束");
    };

    // 计时器
    this.timing = function(s) 
    {
        if (this.isFinish) return;
        if (s<0) {
            mwt.notify("Miss",300,'danger');
            this.finish();
            return;
        }
        jQuery('#exam-timing').html(s+'s');

        setTimeout(function(){
            thiso.timing(--s);
        },1000);
    };
};

return Exam;
});

define(function(require){
    /* page.js, (c) 2018 mawentao */
    var BasePage = require('core/BasePage');
    var o=new BasePage({
        id: 'exercise'
    });
    var domid;

    o.open=function(query,_domid) {
        domid = _domid;
        activeNav('exercise');
        var code = '<div style="margin:40px 0 10px;text-align:center;">'+
                '<i class="sicon-earphones-alt" style="font-size: 30px;width: 60px;    height: 60px;    display: inline-block;    border-radius: 100%;    background: #f90;    color: #fff;padding-top: 15px;"></i>'+
                '<p style="font-size:17px;margin-top:10px;color:#FF9600;">听算练习</p>'+
            '</div>'+
            '<div id="body-'+domid+'" class="exam-form" style="margin:20px 20px;"></div>';
        jQuery('#'+domid).html(code);


        var list = require('model/exam_template').getAllList();
        var opts = [];
        for (var i=0;i<list.length;++i) {
            var im = list[i];
            opts.push('<option value="'+im.id+'">'+im.title+'</options>');
        }

        var code = '<h2>选择题型</h2>'+
            '<select id="exam_template-sel" class="mwt-field">'+
                opts.join('')+
            '</select>'+
            '<h2>选择题数</h2>'+
            '<select id="exam_count-sel" class="mwt-field">'+
                '<option value="5">5题</options>'+
                '<option value="10">10题</options>'+
                '<option value="15">15题</options>'+
                '<option value="20">20题</options>'+
            '</select>'+
            '<button id="smtbtn-'+domid+'" class="mwt-btn mwt-btn-block mwt-btn-primary" style="margin-top:30px;border-radius:4px;padding: 10px 0;">'+
                '在线练习</button>';
        jQuery('#body-'+domid).html(code);

        jQuery('#smtbtn-'+domid).unbind('click').click(o.submit);
    };

    o.submit = function() {
        var params = {
            template_id: mwt.get_select_value('exam_template-sel'),
            exam_count: mwt.get_select_value('exam_count-sel')
        };
        var msgid = mwt.notify("生成题目...",0,'loading');
        ajax.post('exam&action=create',params,function(res){
            mwt.notify_destroy(msgid);
            if (res.retcode!=0) mwt.alert(res.retmsg);
            else {
                var examId = res.data;
                var url = "#/exercise/doing~id="+examId;
                window.location = url;
                //require('./doing/page').open({id:examId});
            }
        });
    };

    return o;
});

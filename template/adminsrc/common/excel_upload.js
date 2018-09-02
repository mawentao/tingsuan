define(function(require){
    /* Excel文件上传控件 */
    var callbackfun,filesel,o={};
	var domid = "image-upload-div";

    function create() {
		var code = '<form method="POST" enctype="multipart/form-data">'+
                     '<input type="file" id="excelfile" name="excelfile" accept="*.xls,*.xlsx" style="display:none;"/>'+
                   '</form>';
        jQuery("#"+domid).html(code);

		////////////////////////////////////////////////////
		// 上传进度
		/*jQuery('#excelfile').fileupload({
        		dataType: 'json',

                progressall: function (e, data) {
                    /*var progress = parseInt(data.loaded / data.total * 100, 10);
                    $('.progress .bar').css(
                        'width',
                        progress + '%'
                    );
                    $('.progress .bar').text(progress + '%');
					console.log(data);
                },

                done: function(e, data) {
					console.log("upload done");
                    //$('.progress .bar').text("done");
                }
            });*/
		////////////////////////////////////////////////////
        filesel = jQuery('#excelfile');
        filesel.unbind('change').change(do_upload);
    }

    function do_upload() {
        var excelfile = filesel.val();
        if (excelfile=="") return;
        //alert(excelfile);
        var upurl= ajax.getAjaxUrl("excel&action=upload&fileElementId=excelfile");
        jQuery.ajaxFileUpload({
            url: upurl,
            secureuri: false,
            fileElementId: 'excelfile',
            dataType: 'json',
            timeout: 30000,
            complete: function(data) {
                create();
            },  
            success: function(data,status) {
                if (data.retcode!=0) mwt.alert(data.retmsg); 
                else {
                    if (callbackfun) {
                        callbackfun(data.data);
                    }
                }
            },
            error: function (data, status, e) {
                alert("Error: "+e);
            }
        });
    };

    o.init = function() {
        if(!document.getElementById(domid)) { 
            var onediv = document.createElement('div');
            onediv.id=domid;
            document.body.appendChild(onediv);
        }
        create();
    };

    o.upload = function(callfun) {
        if (!filesel) {
            o.init();
        }
        callbackfun = callfun;
        filesel.val("");
        filesel.click();
    };

    return o;
});

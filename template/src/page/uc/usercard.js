define(function(require){
    /* usercard.js, (c) 2018 mawentao */
    var o={};
    
    o.init=function(domid) {
        var code = '<div>'+
            '<img src="'+dz.avatar+'" class="avatar"/>'+
            '<span>'+dz.username+'</span>'+
        '</div>';
        jQuery('#'+domid).html(code);
    };

    return o;
});

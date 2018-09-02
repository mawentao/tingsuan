define(function(require){
    /* page.js, (c) 2018 mawentao */
    var BasePage = require('core/BasePage');
    var o=new BasePage({
        id: 'index'
    });

    o.open=function(query,domid) {
        window.location = "#/exercise";
    };

    return o;
});

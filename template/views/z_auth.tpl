<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title></title>
  <link rel="stylesheet" href="<%plugin_path%>/template/libs/mwt/4.0/mwt.min.css" type="text/css">
  <link rel="stylesheet" href="<%plugin_path%>/template/views/misadmin.css" type="text/css">
  <%js_script%>
  <script src="<%plugin_path%>/template/libs/jquery/1.11.2/jquery.min.js"></script>
  <script src="<%plugin_path%>/template/libs/requirejs/2.1.9/require.js"></script>
  <script>
    var jq=jQuery.noConflict();
    jq(document).ready(function($) {
        require.config({
            baseUrl: "<%plugin_path%>/template/views/src/",
            packages: [
                {name:'mwt', location:'<%plugin_path%>/template/libs/mwt/4.0', main:'mwt.min'}
            ]
        });
        require(["auth/page","mwt"],function(mainpage){
            mainpage.execute(); 
        });
    });
  </script>
</head>
<body>
  <div id="grid-div" class="fill-layout"></div>
</body>
</html>

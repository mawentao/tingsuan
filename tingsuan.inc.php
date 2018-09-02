<?php
if (!defined('IN_DISCUZ')) {
    exit('Access Denied');
}
require_once dirname(__FILE__)."/class/env.class.php";
$plugin_path = tingsuan_env::get_plugin_path();


try {
    // 登录检查
    if(!$_G['uid']){
        $login = tingsuan_env::get_siteurl()."/member.php?mod=logging&action=login";
        header("Location: $login");
        exit();
    }

    $voice_path = $plugin_path."/template/static/voice/standard_girl";
    $filename = basename(__FILE__);
    list($controller) = explode('.',$filename);
    include template("tingsuan:".strtolower($controller));
    tingsuan_env::getlog()->trace("pv[".$_G['username']."|uid:".$_G['uid']."]");
    C::t('#tingsuan#tingsuan_log')->write("visit tingsuan:tingsuan");
} catch (Exception $e) {
    $msg = $e->getMessage();
    include template("tingsuan:error");
    exit(0);
}

/*
$template = array (
    array("type"=>"number","intCount"=>2,"deimalCount"=>0),
    array("type"=>"operation","values"=>array("+","-")),
    array("type"=>"number","intCount"=>3,"deimalCount"=>0),
);
$arr = array();
for ($i=0;$i<20;++$i) {
//    $num = C::m('#tingsuan#tingsuan_arithmetic')->genDeimal(3);
    $num = C::m('#tingsuan#tingsuan_exam')->genArithmetic($template);

    $res = C::m('#tingsuan#tingsuan_exam')->calculateArithmetic($num);

    $arr[] = implode("",$num)."=".$res;
}
print_r($arr);
die(0);
*/

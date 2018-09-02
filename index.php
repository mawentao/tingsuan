<?php
/**
 * api入口
 **/
define("IN_TINGSUAN_API", 1);
define("TINGSUAN_PLUGIN_PATH", dirname(__FILE__));
chdir("../../../");

try {
    require './source/class/class_core.php';
    $discuz = C::app();
    $discuz->init();
	require_once TINGSUAN_PLUGIN_PATH."/class/env.class.php";
    $module = isset($_GET['module']) ? $_GET['module'] : '';
    $action = isset($_GET['action']) ? $_GET['action'] : ''; 
    $version = !empty($_GET['version']) ? intval($_GET['version']) : 1;
    if($version>4) $version=4;

    //1. api目录中找对应模块
    $modules = array (
        'exam'
    );
    if(!in_array($module, $modules)) {
        throw new Exception("module not found[$module]");
    }
    while ($version>=1) {
        $apifile = TINGSUAN_PLUGIN_PATH."/api/$version/$module.php";
        if(file_exists($apifile)) {
            require_once $apifile;
            exit(0);
        }
        --$version;
    }

    // 找不module文件
    throw new Exception("module not found[$module]");

} catch (Exception $e) {
    $data = array (
        'retcode' => 100011,
        'retmsg' => $e->getMessage(),
    );
	header("Content-type: application/json");
    echo json_encode($data);
    exit;
}

?>

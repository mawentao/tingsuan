<?php
if (!defined('IN_TINGSUAN_API')) {
    exit('Access Denied');
}
require './source/class/class_core.php';
$discuz = C::app();
$discuz->init();
require_once TINGSUAN_PLUGIN_PATH."/class/env.class.php";
$actionlist = array(
	'upload' => array(),   //!<上传Excel
);
$uid = $_G['uid'];
$username = $_G['username'];
$groupid = $_G["groupid"];
$action = isset($_GET['action']) ? $_GET['action'] : "image";
try {
    if (!isset($actionlist[$action])) {
        throw new Exception('unknow action');
    }
    $groups = $actionlist[$action];
    if (!empty($groups) && !in_array($groupid, $groups)) {
        throw new Exception('illegal request');
    }
    $res = $action();
    tingsuan_env::result(array("data"=>$res),false); 
} catch (Exception $e) {
    tingsuan_env::result(array('retcode'=>100010,'retmsg'=>$e->getMessage()),false);
}


// 上传Excel文件
function upload()
{
    //1. 获取上传的文件
    $res = tingsuan_validate::getNCParameter('excelfile','excelfile','file',0);
    require_once('phpexcel-1.8/PHPExcel.php');
    $filename = $res['name'];    
    $file     = $res['tmp_name'];
    $reader = new PHPExcel_Reader_Excel2007();
    if (!$reader->canRead($file)) {
        $reader = new PHPExcel_Reader_Excel5(); 
        if (!$reader->canRead($file)) {
            throw new Exception("非标准Excel格式: $filename");
            return;
        }   
    }
    //2. Excel文件信息
    $excel = $reader->load($file);
    $sheet = $excel->getSheet(0);          // 读取第一個工作表
    $rowsnum = $sheet->getHighestRow();    // 取得总行数
    $colsstr = $sheet->getHighestColumn(); // 取得总列数
    $colsnum = PHPExcel_Cell::columnIndexFromString($colsstr);
    //3. 读取数据
    $colkeys = array(
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'AA','AB','AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW','AX','AY','AZ',
    );
    if (count($colkeys)<$colsnum) {
        throw new Exception("Excel文件定义的列超出最大限制（最多处理 ".count($colkeys)." 列数据）");
    }
    $res['root'] = array();
    for ($row=1; $row<=$rowsnum; ++$row) {
        $item = array();
        for ($col=0; $col<$colsnum; $col++) {
            $column = $colkeys[$col];
            // $v = $sheet->getCell($column.$row)->getValue();
            $v = $sheet->getCell($column.$row)->getFormattedValue();
            $item[] = trim($v); 
        }
        $lnstr = implode('',$item);
        if ($lnstr=='') continue;   //!< 空行去掉
        $res['root'][] = $item;
    } 
    $res['cols_count'] = $colsnum;
    $res['rows_count'] = $rowsnum;
    unset($res['tmp_name']);
    return $res;
}


?>

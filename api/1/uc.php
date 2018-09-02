<?php
if (!defined('IN_TINGSUAN_API')) {
    exit('Access Denied');
}
/**
 * UC模块
 **/
require './source/class/class_core.php';
$discuz = C::app();
$discuz->init();
require_once TINGSUAN_PLUGIN_PATH."/class/env.class.php";

////////////////////////////////////
// action的用户组列表（空表示全部用户组）
$actionlist = array(
	'login' => array(),        //!< 登录
	'logout' => array(),       //!< 退出
	'changepass' => array(),   //!< 修改密码
    'profile' => array(),      //!< 我的资料
    'profile_set' => array(),  //!< 设置个人资料
);
////////////////////////////////////
$uid = $_G['uid'];
$username = $_G['username'];
$groupid = $_G["groupid"];
$action = isset($_GET['action']) ? $_GET['action'] : "get";

try {
    if (!isset($actionlist[$action])) {
        throw new Exception('unknow action');
    }
    $groups = $actionlist[$action];
    if (!empty($groups) && !in_array($groupid, $groups)) {
        throw new Exception('illegal request');
    }
    $res = $action();
    tingsuan_env::result(array("data"=>$res));
} catch (Exception $e) {
    tingsuan_env::result(array('retcode'=>100010,'retmsg'=>$e->getMessage()));
}

// 登录
function login()
{/*{{{*/
	//1. 校验验证码
	$seccode = tingsuan_validate::getNCParameter('seccode','seccode','string',1024); 
    if (!C::m('#tingsuan#tingsuan_seccode')->check($seccode)) {
        throw new Exception("验证码错误");
    }
    //2. 请求参数校验
    global $_G;
    $username = tingsuan_validate::getNCParameter('username','username','string',1024);
    $password = tingsuan_validate::getNCParameter('userpass','userpass','string',1024);
    $questionid = 0; //tingsuan_validate::getNCParameter('questionid','questionid','integer');
    $answer = ''; //tingsuan_validate::getNCParameter('answer','answer','string');
    $username = iconv('UTF-8', CHARSET.'//ignore', urldecode($username));
    $answer = iconv('UTF-8', CHARSET.'//ignore', urldecode($answer));
    //3. 登录校验
    $uid = C::m("#tingsuan#tingsuan_uc")->logincheck($username, $password, $questionid, $answer);
    if (!is_numeric($uid)) {
        throw new Exception($uid);
    }   
    //4. 登录
    C::m("#tingsuan#tingsuan_uc")->dologin($uid);
    $result = array (
        "username" => $username,
        "uid" => $uid,
    );
    return $result;
}/*}}}*/

// 退出
function logout()
{/*{{{*/
	C::m("#tingsuan#tingsuan_uc")->logout();
	$jumpurl = tingsuan_env::get_siteurl()."/plugin.php?id=tingsuan";
	header('Location: '.$jumpurl);
}/*}}}*/

// 修改密码
function changepass()
{/*{{{*/
	//1. 校验验证码
	$seccode = tingsuan_validate::getNCParameter('seccode','seccode','string',1024); 
    if (!C::m('#tingsuan#tingsuan_seccode')->check($seccode)) {
        throw new Exception("验证码错误");
    }
	//2. 校验旧密码
	global $uid,$username;
	$oldpass = tingsuan_validate::getNCParameter('oldpass','oldpass','string',1024);
	$newpass = tingsuan_validate::getNCParameter('newpass','newpass','string',1024);
	if (strlen($newpass)<6) {
		throw new Exception('新密码长度至少6个字符以上');
	}
	$uc = C::m('#tingsuan#tingsuan_uc');
	if (!$uc->check_user_password($uid,$oldpass)) {
		throw new Exception('旧密码错误');
	}
	//3. 修改密码
	if (!$uc->update_user_password($username,$newpass)) {
		throw new Exception('不明原因修改失败');
	}
	return 0;
}/*}}}*/

// 我的资料
function profile()
{/*{{{*/
    global $uid,$_G;
	$member = tingsuan_utils::getvalues($_G['member'],array('uid','username','email'));
	$group = tingsuan_utils::getvalues($_G['group'],array('groupid','grouptitle'));
	$sql = "select realname,gender,mobile from ".DB::table('common_member_profile')." where uid=$uid";
	$profile = DB::fetch_first($sql);
	$data = array_merge($member,$group,$profile);
    return $data;
}/*}}}*/

// 设置个人资料
function profile_set()
{/*{{{*/
    global $uid;
    if ($uid==0) {throw new Exception('请先登录');}
    $data = array (
        'gender' => tingsuan_validate::getNCParameter('gender','gender','integer'),
        'mobile' => tingsuan_validate::getNCParameter('mobile','mobile','string'),
    );  
    return C::t('common_member_profile')->update($uid,$data);
}/*}}}*/

// vim600: sw=4 ts=4 fdm=marker syn=php
?>

<?php
if (!defined('IN_TINGSUAN_API')) {
    exit('Access Denied');
}
$actionlist = array(
    'getTemplateList' => array(),
    'create' => array(),        //!< 创建题目
    'getDetail' => array(),     //!< 获取题目详情
    'submitAnswers' => array(), //!< 提交作答答案
    'queryMine' => array(),     //!< 查看我的答题记录
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

// 获取题型列表
function getTemplateList() { return C::t('#tingsuan#tingsuan_exam_template')->getAll(); }

// 生成题目
function create()
{/*{{{*/
    $template_id = tingsuan_validate::getNCParameter('template_id','template_id','integer');
    $exam_count = tingsuan_validate::getNCParameter('exam_count','exam_count','integer');
    if ($exam_count>100) {
        throw new Exception("题目数超出最大限制");
    }

    //1. 获取题型信息
    $examTemplateInfo = C::t('#tingsuan#tingsuan_exam_template')->get_by_pk($template_id);
    if (empty($examTemplateInfo)) {
        throw new Exception("该题型已下架");
    }
    $template = json_decode($examTemplateInfo['config'],true);

    //2. 生成exam
    $examTitle = $examTemplateInfo['title']."-".$exam_count."题";
    $examId = C::t('#tingsuan#tingsuan_exam')->create($template_id,$exam_count,$examTitle);

    //3. 生成题目列表
    $examMap = array();
    $m_exam = C::m('#tingsuan#tingsuan_exam');
    for ($i=0;$i<$exam_count;++$i) {
        $express = $m_exam->genArithmetic($template);
        $str = implode('',$express);
        if (isset($examMap[$str])) continue;
        $examMap[$str] = $express;
    }
    C::t('#tingsuan#tingsuan_exam_record')->batSave($examId, $examMap);

    return $examId;
}/*}}}*/

// 获取题目详情
function getDetail()
{/*{{{*/
    global $uid;
    $id = tingsuan_validate::getNCParameter('id','id','integer');
    $exam = C::t('#tingsuan#tingsuan_exam')->get_by_pk($id);
    if (empty($exam)) throw new Exception("题目未生成或已删除");
    if ($exam['uid']!=$uid) throw new Exception("不是你生成的题目");
    // 获取题目列表
    $examList = C::t('#tingsuan#tingsuan_exam_record')->getByExamId($exam['id']);
    $res = array (
        'id' => $exam['id'],
        'title' => $exam['title'],
        'status' => $exam['status'],
        'examCount' => $exam['exam_count'],
        'accuracy' => $exam['accuracy'],
        'beginTime' => $exam['begin_time'],
        'examList' => &$examList,
    );
    return $res;
}/*}}}*/

// 提交作答答案
function submitAnswers()
{/*{{{*/
    global $uid;
    $exam_id = tingsuan_validate::getNCParameter('exam_id','exam_id','integer');
    $answerMap = $_POST['answers'];
    $exam = C::t('#tingsuan#tingsuan_exam')->get_by_pk($exam_id);
    if (empty($exam)) throw new Exception("题目未生成或已删除");
    if ($exam['uid']!=$uid) throw new Exception("不是你生成的题目");
    // 获取题目列表
    $examList = C::t('#tingsuan#tingsuan_exam_record')->getByExamId($exam['id']);
    $ntm = date('Y-m-d H:i:s');
    $rightCount = 0;
    foreach ($examList as &$im) {
        $id = $im['id'];
        $key = 'exam-'.$id;
        $rightAnswer = $im['right_answer'];
        $userAnswer = isset($answerMap[$key]) ? $answerMap[$key] : '';
        $status = 0;
        if ($userAnswer!='') {
            $status = $userAnswer==$rightAnswer ? 1 : 2;
        }
        if ($status==1) ++$rightCount;
        $data = array (
            'user_answer' => $userAnswer,
            'status' => $status,
            'begin_time' => $ntm,
            'end_time' => $ntm,
        );
        C::t('#tingsuan#tingsuan_exam_record')->update($id,$data);
    }

    $totalCount = count($examList);
    $accuracy = $totalCount==0 ? 0 : $rightCount / $totalCount;
    $data = array (
        'accuracy' => $accuracy,
        'status' => 2,
    );
    C::t('#tingsuan#tingsuan_exam')->update($exam_id,$data);
    return $accuracy;
}/*}}}*/

// 查看我的答题记录
function queryMine() { return C::t('#tingsuan#tingsuan_exam')->queryMine(); }


?>

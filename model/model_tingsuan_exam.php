<?php
if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}
/**
 * C::m('#tingsuan#tingsuan_exam')->fun()
 **/
class model_tingsuan_exam
{
    private $m_arithmetic;

    public function __construct() {
        $this->m_arithmetic = C::m('#tingsuan#tingsuan_arithmetic');
    }

    // 根据模板生成题目
    // $template = array (
    //    array("type":"number","intCount":2,"deimalCount":0),
    //    array("type":"operation","values":array("+","-")),
    //    array("type":"number","intCount":3,"deimalCount":0),
    // )
    public function genArithmetic(&$template)
    {/*{{{*/
        $res = array();
        foreach ($template as &$im) {
            if ($im['type']=='number') {
                $int = $im['intCount']==0 ? 0 : $this->m_arithmetic->genInteger($im['intCount']);
                $dcm = $im['deimalCount']==0 ? 0 : $this->m_arithmetic->genDeimal($im['deimalCount']);
                $num = $int + $dcm;
                $res[] = $num;
            } else {
                $n = count($im['values']);
                $i = mt_rand(0,$n-1);
                $res[] = $im['values'][$i];
            }
        }
        return $res;
    }/*}}}*/

    // 算术题计算
    public function calculateArithmetic($arr)
    {/*{{{*/
        $express = implode('',$arr);
        return eval("return $express;"); 
    }/*}}}*/

}
// vim600: sw=4 ts=4 fdm=marker syn=php
?>

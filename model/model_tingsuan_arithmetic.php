<?php
if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}
/**
 * C::m('#tingsuan#tingsuan_arithmetic')->fun()
 **/
class model_tingsuan_arithmetic
{
    // 生成n位整数
    public function genInteger($n)
    {
        $top = pow(10,$n);
        $min = ($top/10);
        $max = $top-1;
        return mt_rand($min,$max);
    }

    // 生成n位小数
    public function genDeimal($n)
    {
        $top = pow(10,$n);
        $max = $top-1;
        $num = mt_rand(1,$max);
        return $num / $top;
    }

}
// vim600: sw=4 ts=4 fdm=marker syn=php
?>

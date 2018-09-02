<?php
if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}
/**
 * 插件设置 
 * C::m('#tingsuan#tingsuan_setting')->get()
 **/
class model_tingsuan_setting
{
	// 获取默认配置
    public function getDefault()
    {
		$setting = array (
			// 屏蔽所有discuz页面
			'disable_discuz' => 0,
			// 系统名称
			'page_title' => 'tingsuan',
			// 版权信息
			'page_copyright' => 'tingsuan.com 2017',
		);
		return $setting;
    }

    // 获取配置
	public function get()
	{
		$setting = $this->getDefault();
		global $_G;
		if (isset($_G['setting']['tingsuan_config'])){
			$config = unserialize($_G['setting']['tingsuan_config']);
			foreach ($setting as $key => &$item) {
				if (isset($config[$key])) $item = $config[$key];
			}
		}
		return $setting;
	}
}
// vim600: sw=4 ts=4 fdm=marker syn=php
?>

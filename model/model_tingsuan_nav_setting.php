<?php
if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}
/**
 * 导航设置 
 * C::m('#tingsuan#tingsuan_nav_setting')->get()
 **/
class model_tingsuan_nav_setting
{
    private $cfgkey = "tingsuan_navmenu";

	// 获取默认配置
    public function get_default_setting()
    {
        $setting = array (
            // 导航菜单
            'navmenu' => array (
                array('displayorder'=>1, 'text'=>'首页', 'icon'=>'fa fa-home', 'href'=>'plugin.php?id=langbi#/dashboard',
                      'newtab'=>0, 'enable'=>1),
                array('displayorder'=>2, 'text'=>'大屏', 'icon'=>'fa fa-tv', 'href'=>'plugin.php?id=datav&fullscreen=1&cityid=0',
                      'newtab'=>1, 'enable'=>1),
                array('displayorder'=>3, 'text'=>'数据报表', 'icon'=>'fa fa-line-chart', 'newtab'=>0, 'enable'=>1,
                      'href'=>'plugin.php?id=langbi#/bireport/index/list',
                    'subitems' => array (
                        array('displayorder'=>1, 'text'=>'通用报表', 'icon'=>'fa fa-caret-right', 'newtab'=>0, 'enable'=>1,
                              'href'=>'plugin.php?id=langbi#/bireport/index/list'),
                        array('displayorder'=>2, 'text'=>'数据分布', 'icon'=>'fa fa-caret-right', 'newtab'=>0, 'enable'=>1,
                              'href'=>'plugin.php?id=datadis#/datadis/dashboard'),
                        array('displayorder'=>3, 'text'=>'KPI', 'icon'=>'fa fa-caret-right', 'newtab'=>0, 'enable'=>1,
                              'href'=>'plugin.php?id=langtrack#/kpi~gid=1'),
                    ),
                ),
            )
        );
		return $setting;
    }

    // 获取导航菜单列表
    public function get_navmenu() {
        $setting = $this->get();
        $navlist = array();
        foreach ($setting['navmenu'] as &$im) {
            if ($im['enable']!=1) { continue; }
            unset($im['enable']);
            unset($im['displayorder']);
            if (!empty($im['subitems'])) {
                $subitems = array();
                foreach ($im['subitems'] as $k => &$sim) {
                    if ($sim['enable']!=1) continue;
                    unset($sim['enable']);
                    unset($sim['displayorder']);
                    $subitems[] = $sim;
                }
                $im['subitems'] = $subitems;
            }
            if (empty($im['subitems'])) unset($im['subitems']);
            $navlist[] = $im;
        }
        return $navlist;
    }

    // 获取配置
    public function get() {
        $setting = $this->get_default_setting();
        global $_G;
        $cfgkey = $this->cfgkey;
        if (isset($_G['setting'][$cfgkey])) {
            $config = unserialize($_G['setting'][$cfgkey]);
            foreach ($setting as $k => &$v) {
                if (isset($config[$k])) {
                    $v = $config[$k];
                }
            }
        }
        return $setting;
    }

    // 恢复默认配置
    public function reset()
    {
        C::t('common_setting')->delete($this->cfgkey);
        updatecache('setting');
    }

    // 保存配置
    public function set(&$setting)
    {
        C::t('common_setting')->update($this->cfgkey,$setting);
        updatecache('setting');
    }
	
}
// vim600: sw=4 ts=4 fdm=marker syn=php
?>

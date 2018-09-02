<?php
if (!defined('IN_DISCUZ')) {
	exit('Access Denied');
}
/**
 * 听算题型表
 **/
class table_tingsuan_exam_template extends discuz_table
{
    public function __construct() {
		$this->_table = 'tingsuan_exam_template';
		$this->_pk = 'id';
		parent::__construct();
	}

	// 根据主键获取信息
	public function get_by_pk($pkvalue) {
        $table = DB::table($this->_table);
        $pk = $this->_pk;
        $sql = "SELECT * FROM $table WHERE $pk='$pkvalue'";
        return DB::fetch_first($sql);
    }

    // 获取题型列表
    public function getAll()
    {
        $table = DB::table($this->_table);
        $sql = "SELECT id,title FROM $table WHERE isdel=0";
        return DB::fetch_all($sql);
    }
}
// vim600: sw=4 ts=4 fdm=marker syn=php
?>

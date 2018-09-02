<?php
if (!defined('IN_DISCUZ')) {
	exit('Access Denied');
}
/**
 * 用户权限表
 **/
class table_tingsuan_auth extends discuz_table
{
    public function __construct() {
		$this->_table = 'tingsuan_auth';
		$this->_pk = 'uid';
		parent::__construct();
	}

	// 根据主键获取信息
	public function get_by_pk($pkvalue) {
        $table = DB::table($this->_table);
        $pk = $this->_pk;
        $sql = "SELECT * FROM $table WHERE $pk='$pkvalue'";
        return DB::fetch_first($sql);
    }

    // 获取某个用户权限
    public function getByUid($uid) 
    {
        $res = $this->get_by_pk($uid);
        return empty($res) ? 0 : intval($res['auth']);
    }

    // 设置权限
    public function set()
    {
        $uid = tingsuan_validate::getNCParameter('uid','uid','integer');
        $auth = tingsuan_validate::getNCParameter('auth','auth','integer');
        $ctime = date("Y-m-d H:i:s");
        $sql = "INSERT INTO ".DB::table('tingsuan_auth')." (uid,auth,ctime) VALUES ('$uid','$auth','$ctime') ".
               "ON DUPLICATE KEY UPDATE auth=values(auth)";
        return DB::query($sql);
    }

    // 权限查询
	public function query()
	{
		$return = array(
		    "totalProperty" => 0,
            "root" => array(),
        );
        $auth  = tingsuan_validate::getNCParameter('auth','auth','integer');
        $key   = tingsuan_validate::getNCParameter('key','key','string',128);
        $sort  = tingsuan_validate::getOPParameter('sort','sort','string',1024,'uid');
        $dir   = tingsuan_validate::getOPParameter('dir','dir','string',1024,'ASC');
        $start = tingsuan_validate::getOPParameter('start','start','integer',1024,0);
        $limit = tingsuan_validate::getOPParameter('limit','limit','integer',1024,20);
        $where = "1";
        if ($key!="") $where.=" AND (username like '%$key%' OR email like '%$key%')";
        if ($auth>=1)  $where.=" AND auth='$auth'";
        else if ($auth==0)  $where.=" AND (auth=0 OR auth is null)";
        if ($sort=='uid') $sort='a.'.$sort;
        $table_common_member = DB::table("common_member");
        $table_auth = DB::table($this->_table);
        $sql = <<<EOF
SELECT SQL_CALC_FOUND_ROWS 
a.uid,a.username,a.email,a.regdate,a.groupid,b.auth,b.ctime,b.mtime
FROM $table_common_member as a LEFT JOIN $table_auth AS b ON a.uid=b.uid
WHERE $where
LIMIT $start,$limit
EOF;
        $return["root"] = DB::fetch_all($sql);
        $row = DB::fetch_first("SELECT FOUND_ROWS() AS total");
        $return["totalProperty"] = $row["total"];
        ///////////////////////////////////////////////
        foreach ($return["root"] as &$row) {
            $row['groupname'] = C::m('#tingsuan#tingsuan_usergroup')->grouptitle($row['groupid']);
            if (!$row['auth']) $row['auth']=0;
        }
        ///////////////////////////////////////////////
        return $return;
	}
}
// vim600: sw=4 ts=4 fdm=marker syn=php
?>

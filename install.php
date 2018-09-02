<?php
/*******************************************************
 * 此脚本文件用于插件的安装
 * 提示：可使用runquery() 函数执行SQL语句
 *       表名可以直接写“cdb_”
 * 注意：需在导出的 XML 文件结尾加上此脚本的文件名
 *******************************************************/
if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

$addtime = $modtime = date('Y-m-d H:i:s');

// 用户权限表
$table = DB::table('tingsuan_auth');
/*{{{*/
$sql = "CREATE TABLE IF NOT EXISTS $table ". <<<EOF
(
`uid` mediumint(8) unsigned NOT NULL DEFAULT '0' COMMENT 'DZ用户ID',
`auth` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '权限(0:无权限,1:普通用户,2:高级用户)',
`ctime` datetime NOT NULL DEFAULT "0000-00-00 00:00:00" comment '创建日期',
`mtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
PRIMARY KEY (`uid`)
) ENGINE=MyISAM COMMENT '用户权限表'
EOF;
runquery($sql);
$sql="INSERT IGNORE INTO $table (uid,auth,ctime) VALUES (1,2,'$addtime')";
runquery($sql);
/*}}}*/

// 用户日志
$table = DB::table('tingsuan_log');
/*{{{*/
$sql = "CREATE TABLE IF NOT EXISTS $table ". <<<EOF
(
`logid` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '日志ID(自增主键)', 
`logtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '日志时间',
`uid` mediumint(8) unsigned NOT NULL DEFAULT '0' COMMENT '用户ID',
`client_ip` varchar(32) NOT NULL DEFAULT '' COMMENT '来访IP',
`log_content` varchar(4096) NOT NULL DEFAULT '' COMMENT '日志内容',
PRIMARY KEY (`logid`),
KEY `idx_logtime_uid` (`logtime`,`uid`)
) ENGINE=InnoDB
EOF;
runquery($sql);
runquery("ALTER TABLE `$table` ENGINE=INNODB");
/*}}}*/

// 算术题型
$table = DB::table('tingsuan_exam_template');
/*{{{*/
$sql = "CREATE TABLE IF NOT EXISTS $table ". <<<EOF
(
`id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
`title` varchar(128) NOT NULL DEFAULT '' COMMENT '2位数加法',
`config` text NOT NULL DEFAULT '' COMMENT '模板配置(JSON格式)',
`ctime` datetime NOT NULL DEFAULT "0000-00-00 00:00:00" comment '创建日期',
`mtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
`isdel` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '删除标记(0:未删,1:已删)',
PRIMARY KEY (`id`)
) ENGINE=MyISAM COMMENT '算术题型表'
EOF;
runquery($sql);
$sql=<<<EOF
INSERT IGNORE INTO $table (id,title,config,ctime) 
VALUES 
(1,'一位数加减法','[{"type":"number","intCount":1,"deimalCount":0},{"type":"operation","values":["+","-"]},{"type":"number","intCount":1,"deimalCount":0}]','$addtime'),
(2,'两位数加减法','[{"type":"number","intCount":2,"deimalCount":0},{"type":"operation","values":["+","-"]},{"type":"number","intCount":2,"deimalCount":0}]','$addtime'),
(3,'三位数加减法','[{"type":"number","intCount":3,"deimalCount":0},{"type":"operation","values":["+","-"]},{"type":"number","intCount":3,"deimalCount":0}]','$addtime')
EOF;
runquery($sql);
/*}}}*/

// 答题记录
$table = DB::table('tingsuan_exam');
/*{{{*/
$sql = "CREATE TABLE IF NOT EXISTS $table ". <<<EOF
(
`id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID', 
`template_id` bigint unsigned NOT NULL DEFAULT '0' COMMENT '题型模板ID',
`exam_count` mediumint(8) unsigned NOT NULL DEFAULT '0' COMMENT '题数',
`title` varchar(128) NOT NULL DEFAULT '' COMMENT '测验标题',
`uid` mediumint(8) unsigned NOT NULL DEFAULT '0' COMMENT '用户ID',
`begin_time` datetime NOT NULL DEFAULT "0000-00-00 00:00:00" comment '开始时间',
`end_time` datetime NOT NULL DEFAULT "0000-00-00 00:00:00" comment '结束时间',
`accuracy` float unsigned NOT NULL DEFAULT '0' COMMENT '正确率',
`status` tinyint(3) unsigned NOT NULL DEFAULT '1' COMMENT '状态(1:答题中,2:已完成,3:已放弃)',
`ctime` datetime NOT NULL DEFAULT "0000-00-00 00:00:00" comment '创建日期',
`mtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
`isdel` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '删除标记(0:未删,1:已删)',
PRIMARY KEY (`id`),
KEY `idx_uid_status` (`uid`,`status`),
KEY `idx_status` (`status`),
KEY `idx_template_id` (`template_id`)
) ENGINE=InnoDB COMMENT '测验表'
EOF;
runquery($sql);
runquery("ALTER TABLE `$table` ENGINE=INNODB");
/*}}}*/

// 答题明细表
$table = DB::table('tingsuan_exam_record');
/*{{{*/
$sql = "CREATE TABLE IF NOT EXISTS $table ". <<<EOF
(
`id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '自增ID', 
`exam_id` bigint unsigned NOT NULL DEFAULT '0' COMMENT '测验ID',
`question_title` varchar(1024) NOT NULL DEFAULT '' COMMENT '算术题',
`express` varchar(1024) NOT NULL DEFAULT '' COMMENT '算术表达式(json格式)',
`question_options` varchar(1024) NOT NULL DEFAULT '' COMMENT '选项',
`user_answer` varchar(1024) NOT NULL DEFAULT '' COMMENT '提交答案',
`right_answer` varchar(1024) NOT NULL DEFAULT '' COMMENT '正确答案',
`status` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '状态(0:未答题,1:答题正确,2:答题错误)',
`display_order` int unsigned NOT NULL DEFAULT '0' COMMENT '序号',
`uid` mediumint(8) unsigned NOT NULL DEFAULT '0' COMMENT '用户ID',
`begin_time` datetime NOT NULL DEFAULT "0000-00-00 00:00:00" comment '开始时间',
`end_time` datetime NOT NULL DEFAULT "0000-00-00 00:00:00" comment '结束时间',
`ctime` datetime NOT NULL DEFAULT "0000-00-00 00:00:00" comment '创建日期',
`mtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
`isdel` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '删除标记(0:未删,1:已删)',
PRIMARY KEY (`id`),
KEY `idx_uid_status` (`uid`),
KEY `idx_exam_id` (`exam_id`)
) ENGINE=InnoDB COMMENT '测验记录表'
EOF;
runquery($sql);
runquery("ALTER TABLE `$table` ENGINE=INNODB");
/*}}}*/



$finish = TRUE;
?>

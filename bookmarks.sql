
SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------
-- Schema syncmarks
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `syncmarks` DEFAULT CHARACTER SET utf8 ;
USE `syncmarks` ;

-- ----------------------------
--  Table structure for `bookmark`
-- ----------------------------
DROP TABLE IF EXISTS `bookmark`;
CREATE TABLE `bookmark` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `markid` varchar(30) NOT NULL COMMENT '书签id',
  `title` varchar(200) CHARACTER SET utf8 NOT NULL COMMENT '书签名',
  `index` tinyint(4) NOT NULL COMMENT '排序',
  `type` tinyint(1) NOT NULL COMMENT '类型，0为文件夹，1为书签',
  `parentId` bigint(11) unsigned DEFAULT NULL COMMENT '父id，为0表示顶级书签',
  `userid` bigint(11) unsigned DEFAULT '0' COMMENT '用户id',
  `dataAdded` bigint(20) DEFAULT NULL COMMENT '添加日期',
  `markparentid` varchar(30) DEFAULT NULL COMMENT '书签id的父id',
  `url` varchar(200) DEFAULT NULL COMMENT '书签链接',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `usermarks`
-- ----------------------------
DROP TABLE IF EXISTS `usermarks`;
CREATE TABLE `usermarks` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` bigint(11) unsigned NOT NULL COMMENT '用户id',
  `marksid` bigint(20) NOT NULL COMMENT '书签id',
  `version` smallint(2) NOT NULL DEFAULT '0' COMMENT '当前版本号',
  `addtime` timestamp NULL DEFAULT NULL COMMENT '添加时间',
  `updatetime` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `username` varchar(20) DEFAULT NULL COMMENT '用户名',
  `password` varchar(45) DEFAULT NULL COMMENT '密码',
  `registertime` timestamp(6) NULL DEFAULT NULL COMMENT '注册时间',
  `email` varchar(45) NOT NULL COMMENT '邮箱',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50716
 Source Host           : localhost
 Source Database       : nodetest

 Target Server Type    : MySQL
 Target Server Version : 50716
 File Encoding         : utf-8

 Date: 03/05/2017 11:52:05 AM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `bookmark`
-- ----------------------------
DROP TABLE IF EXISTS `bookmark`;
CREATE TABLE `bookmark` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(45) CHARACTER SET utf8 NOT NULL COMMENT '书签名',
  `order` tinyint(4) NOT NULL COMMENT '排序',
  `type` tinyint(1) NOT NULL COMMENT '类型，0为文件夹，1为书签',
  `parentId` bigint(11) unsigned NOT NULL COMMENT '父id，为0表示顶级书签',
  `userid` bigint(11) unsigned DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `bookmark`
-- ----------------------------
BEGIN;
INSERT INTO `bookmark` VALUES ('1', '科技', '1', '1', '0', null);
COMMIT;

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
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `users`
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES ('1', 'wthfeng', '123456', '2017-01-21 00:00:00.000000', 'wthfeng@126.com');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;

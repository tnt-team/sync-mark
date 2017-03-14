
SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

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
) ENGINE=InnoDB AUTO_INCREMENT=243 DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

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
=======
-- MySQL Script generated by MySQL Workbench
-- Mon Mar 13 22:00:51 2017
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema syncmarks
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `syncmarks` DEFAULT CHARACTER SET utf8 ;
USE `syncmarks` ;

-- -----------------------------------------------------
-- Table `syncmarks`.`bookmark`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `syncmarks`.`bookmark` ;

CREATE TABLE IF NOT EXISTS `syncmarks`.`bookmark` (
  `id` BIGINT(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` VARCHAR(45) NOT NULL COMMENT '书签名',
  `order` TINYINT(4) NOT NULL COMMENT '排序',
  `type` TINYINT(1) NOT NULL COMMENT '类型，0为文件夹，1为书签',
  `parentId` BIGINT(11) UNSIGNED NOT NULL COMMENT '父id，为0表示顶级书签',
  `userid` BIGINT(11) UNSIGNED NULL DEFAULT '0',
  `gentime` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `syncmarks`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `syncmarks`.`users` ;

CREATE TABLE IF NOT EXISTS `syncmarks`.`users` (
  `id` BIGINT(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `username` VARCHAR(20) CHARACTER SET 'latin1' NULL DEFAULT NULL COMMENT '用户名',
  `password` VARCHAR(45) CHARACTER SET 'latin1' NULL DEFAULT NULL COMMENT '密码',
  `registertime` TIMESTAMP(6) NULL DEFAULT NULL COMMENT '注册时间',
  `email` VARCHAR(45) CHARACTER SET 'latin1' NOT NULL COMMENT '邮箱',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;

SET FOREIGN_KEY_CHECKS = 1;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


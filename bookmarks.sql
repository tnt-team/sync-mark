-- MySQL dump 10.13  Distrib 5.7.16, for osx10.11 (x86_64)
--
-- Host: localhost    Database: syncmarks
-- ------------------------------------------------------
-- Server version	5.7.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookmark`
--

DROP TABLE IF EXISTS `bookmark`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bookmark` (
  `id` char(36) NOT NULL COMMENT '主键',
  `fx_markid` varchar(30) CHARACTER SET latin1 DEFAULT NULL COMMENT '火狐书签id',
  `fx_markparentid` varchar(30) CHARACTER SET latin1 DEFAULT NULL COMMENT '火狐书签id的父id',
  `title` varchar(200) NOT NULL COMMENT '书签名',
  `index` tinyint(4) DEFAULT NULL COMMENT '排序',
  `type` tinyint(1) DEFAULT NULL COMMENT '类型，0为文件夹，1为书签',
  `parentId` char(36) DEFAULT NULL COMMENT '父id，为0表示顶级书签',
  `userid` bigint(11) unsigned NOT NULL DEFAULT '0' COMMENT '用户id',
  `dataAdded` bigint(20) DEFAULT NULL COMMENT '添加日期',
  `url` varchar(200) CHARACTER SET latin1 DEFAULT NULL COMMENT '书签链接',
  `cr_markid` varchar(30) DEFAULT NULL COMMENT '谷歌书签id',
  `cr_markparentid` varchar(30) DEFAULT NULL COMMENT '谷歌书签父id',
  PRIMARY KEY (`id`),
  KEY `userid_index` (`userid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookmark`
--

LOCK TABLES `bookmark` WRITE;
/*!40000 ALTER TABLE `bookmark` DISABLE KEYS */;
INSERT INTO `bookmark` VALUES ('e58c5470-1c50-11e7-b9d1-dff1bf8415ec','root________','0','',0,0,'',1,NULL,'',NULL,NULL),('e58c7b80-1c50-11e7-b9d1-dff1bf8415ec','menu________','root________','书签菜单',0,1,'e58c5470-1c50-11e7-b9d1-dff1bf8415ec',1,NULL,'',NULL,NULL),('e58c7b81-1c50-11e7-b9d1-dff1bf8415ec','toolbar_____','root________','书签工具栏',1,1,'e58c5470-1c50-11e7-b9d1-dff1bf8415ec',1,NULL,'',NULL,NULL),('e58c7b82-1c50-11e7-b9d1-dff1bf8415ec','unfiled_____','root________','其他书签',3,1,'e58c5470-1c50-11e7-b9d1-dff1bf8415ec',1,NULL,'',NULL,NULL),('e58c7b83-1c50-11e7-b9d1-dff1bf8415ec','mobile______','root________','mobile',4,1,'e58c5470-1c50-11e7-b9d1-dff1bf8415ec',1,NULL,'',NULL,NULL);
/*!40000 ALTER TABLE `bookmark` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emailcode`
--

DROP TABLE IF EXISTS `emailcode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `emailcode` (
  `id` bigint(20) NOT NULL,
  `email` varchar(50) COLLATE utf8_bin NOT NULL COMMENT '邮箱',
  `code` char(6) COLLATE utf8_bin NOT NULL,
  `createtime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='用于保存邮箱验证码';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emailcode`
--

LOCK TABLES `emailcode` WRITE;
/*!40000 ALTER TABLE `emailcode` DISABLE KEYS */;
/*!40000 ALTER TABLE `emailcode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usermarks`
--

DROP TABLE IF EXISTS `usermarks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usermarks` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` bigint(11) unsigned NOT NULL COMMENT '用户id',
  `marksid` bigint(20) NOT NULL COMMENT '书签id',
  `version` smallint(2) NOT NULL DEFAULT '0' COMMENT '当前版本号',
  `addtime` timestamp NULL DEFAULT NULL COMMENT '添加时间',
  `updatetime` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usermarks`
--

LOCK TABLES `usermarks` WRITE;
/*!40000 ALTER TABLE `usermarks` DISABLE KEYS */;
INSERT INTO `usermarks` VALUES (1,1,0,1,NULL,NULL);
/*!40000 ALTER TABLE `usermarks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `username` varchar(20) CHARACTER SET latin1 DEFAULT NULL COMMENT '用户名',
  `password` varchar(45) CHARACTER SET latin1 DEFAULT NULL COMMENT '密码',
  `registertime` datetime DEFAULT NULL COMMENT '注册时间',
  `email` varchar(45) CHARACTER SET latin1 NOT NULL COMMENT '邮箱',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'wthfeng','123456','2017-01-21 00:00:00','wthfeng@126.com');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-04-12 11:01:08

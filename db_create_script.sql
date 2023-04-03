CREATE DATABASE `mysql_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
CREATE TABLE `all_services` (
  `service` varchar(45) NOT NULL,
  PRIMARY KEY (`service`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `region` (
  `region` varchar(45) NOT NULL,
  PRIMARY KEY (`region`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `customer` (
  `email` varchar(45) NOT NULL,
  `is_approved` tinyint NOT NULL DEFAULT '0',
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `address` varchar(45) DEFAULT NULL,
  `region` varchar(45) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `worker` (
  `email` varchar(45) NOT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `is_approved` tinyint NOT NULL DEFAULT '0',
  `service_region` varchar(45) DEFAULT NULL,
  `rate` double DEFAULT '3',
  `rate_counter` int DEFAULT '0',
  PRIMARY KEY (`email`),
  KEY `region_idx` (`service_region`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `service_provided` (
  `service` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  KEY `email_idx` (`email`),
  KEY `service_idx` (`service`),
  CONSTRAINT `email` FOREIGN KEY (`email`) REFERENCES `worker` (`email`),
  CONSTRAINT `service` FOREIGN KEY (`service`) REFERENCES `all_services` (`service`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `call` (
  `call_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` varchar(45) NOT NULL,
  `worker_id` varchar(45) DEFAULT NULL,
  `service` varchar(45) NOT NULL,
  `status` varchar(45) DEFAULT NULL,
  `rate` varchar(45) DEFAULT NULL,
  `comment` varchar(45) DEFAULT NULL,
  `region` varchar(45) NOT NULL,
  `request_time` bigint DEFAULT NULL,
  `approved_worker` tinyint DEFAULT '0',
  `pay_amount` double DEFAULT NULL,
  `address` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`call_id`),
  KEY `email_idx` (`customer_id`),
  KEY `email_idx1` (`worker_id`),
  KEY `region_idx` (`region`),
  KEY `service_idx` (`service`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 22, 2025 at 07:23 AM
-- Server version: 8.0.31
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stdactivity_2567`
--

-- --------------------------------------------------------

--
-- Table structure for table `method`
--

DROP TABLE IF EXISTS `method`;
CREATE TABLE IF NOT EXISTS `method` (
  `method_id` int NOT NULL AUTO_INCREMENT,
  `method_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`method_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `method`
--

INSERT INTO `method` (`method_id`, `method_name`) VALUES
(1, 'สแกนใบหน้า'),
(2, 'สแกนลายนิ้วมือ'),
(3, 'QR Code'),
(4, 'RFID'),
(5, 'รหัสนักศึกษา');

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
CREATE TABLE IF NOT EXISTS `status` (
  `status_id` int NOT NULL AUTO_INCREMENT,
  `status_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`status_id`, `status_name`) VALUES
(1, 'มา'),
(2, 'มาสาย'),
(3, 'ขาด'),
(4, 'ลาป่วย'),
(5, 'ลากิจ'),
(6, 'อื่นๆ');

-- --------------------------------------------------------

--
-- Table structure for table `sttendance`
--

DROP TABLE IF EXISTS `sttendance`;
CREATE TABLE IF NOT EXISTS `sttendance` (
  `attendance_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int DEFAULT NULL,
  `attendance_date` date NOT NULL,
  `status_id` int DEFAULT NULL,
  `checkin_time` time DEFAULT NULL,
  `method_id` int DEFAULT NULL,
  PRIMARY KEY (`attendance_id`),
  KEY `student_id` (`student_id`),
  KEY `status_id` (`status_id`),
  KEY `method_id` (`method_id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sttendance`
--

INSERT INTO `sttendance` (`attendance_id`, `student_id`, `attendance_date`, `status_id`, `checkin_time`, `method_id`) VALUES
(54, 1, '2025-02-13', 3, '11:18:36', 1),
(55, 3, '2025-02-13', 4, '11:18:36', 1),
(56, 4, '2025-02-13', 1, '11:18:36', 1),
(57, 24115, '2025-02-13', 2, '11:18:36', 1);

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
CREATE TABLE IF NOT EXISTS `student` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `face_image` blob,
  `fingerprint_data` blob,
  `qr_code` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rfid_data` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `picture` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `student_type` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_id` (`student_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`id`, `student_id`, `username`, `password`, `face_image`, `fingerprint_data`, `qr_code`, `rfid_data`, `status`, `picture`, `token`, `student_type`) VALUES
(83, 88352, 'Admin@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', NULL, NULL, NULL, NULL, '1', '', '', 'admin'),
(84, 1, 'ammata1@gmail.com', '1234', NULL, NULL, NULL, NULL, '0', 'profile1.png', '', 'student'),
(85, 2, 'ammata2@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', NULL, NULL, NULL, NULL, '1', '1739419732038-.jpg', '', 'teacher'),
(86, 3, 'ammata3@gmail.com', '1234', NULL, NULL, NULL, NULL, '1', 'profile1.png', '', 'student'),
(87, 4, 'ammata4@gmail.com', '1234', NULL, NULL, NULL, NULL, '1', 'profile1.png', '', 'student'),
(88, 24115, 'All', '81dc9bdb52d04dc20036dbd8313ed055', NULL, NULL, NULL, NULL, '', '1739419756330-.jpg', '', 'student');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sttendance`
--
ALTER TABLE `sttendance`
  ADD CONSTRAINT `sttendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  ADD CONSTRAINT `sttendance_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `status` (`status_id`),
  ADD CONSTRAINT `sttendance_ibfk_3` FOREIGN KEY (`method_id`) REFERENCES `method` (`method_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

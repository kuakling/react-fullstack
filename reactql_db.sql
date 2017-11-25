-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 21, 2017 at 10:24 AM
-- Server version: 10.1.16-MariaDB
-- PHP Version: 5.6.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `reactql_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `desktop_setting`
--

CREATE TABLE `desktop_setting` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `settings` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `desktop_setting`
--

INSERT INTO `desktop_setting` (`id`, `user_id`, `settings`) VALUES
(1, 5, '{"wallpaper":{"color":"#00ff00","picture":"http://www.comm-sci.pn.psu.ac.th/media/parallax/img/bg.png"}}');

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE `session` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `expires_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `auth_key` varchar(32) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `status` smallint(6) NOT NULL DEFAULT '10',
  `created_at` int(11) NOT NULL,
  `updated_at` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `auth_key`, `password_hash`, `password_reset_token`, `email`, `status`, `created_at`, `updated_at`) VALUES
(1, 'pimchanok.p', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'pimchanok.p@psu.ac.th', 10, 1441252947, 1441252947),
(2, 'wanida.bo', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'wanida.bo@psu.ac.th', 10, 1441252948, 1441252948),
(3, 'yupadee.u', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'yupadee.u@psu.ac.th', 10, 1441252949, 1441252949),
(4, 'ittidate.r', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'ittidate.r@psu.ac.th', 10, 1441252950, 1441252950),
(5, 'surakit.c', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '$2y$10$ay4FZG2LyYPDnQdDWg7S/Ovb3AY1XV8oNQWyEfPAjY9WmsIvdYqzu', NULL, 'surakit.c@psu.ac.th', 10, 1441252951, 2017),
(6, 'kanchan.m', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'kanchan.m@psu.ac.th', 10, 1441252952, 1467241710),
(7, 'taweesak.h', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'taweesak.h@psu.ac.th', 10, 1441252953, 1467241525),
(8, 'oratai.c', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'oratai.c@psu.ac.th', 10, 1441252954, 1467241573),
(9, 'saman.c', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'saman.c@psu.ac.th', 10, 1441252955, 1441252955),
(10, 'navika.p', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '$2y$10$ay4FZG2LyYPDnQdDWg7S/Ovb3AY1XV8oNQWyEfPAjY9WmsIvdYqzu', NULL, 'navika.p@psu.ac.th', 10, 1441252956, 1441252956),
(11, 'kittisak.p', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'kittisak.p@psu.ac.th', 10, 1441252957, 1467241665),
(12, 'phatcharakan.y', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'phatcharakan.y@psu.ac.th', 10, 1441252958, 1441252958),
(13, 'chavanit.t', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'chavanit.t@psu.ac.th', 10, 1441252959, 1441252959),
(14, 'ausmarn.t', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'ausmarn.t@psu.ac.th', 10, 1441252960, 1441252960),
(15, 'thidakan.k', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'thidakan.k@psu.ac.th', 10, 1441252961, 1441252961),
(16, 'sunisa.ma', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'sunisa.ma@psu.ac.th', 10, 1441252962, 1467241759),
(17, 'wasinee.c', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'wasinee.c@psu.ac.th', 10, 1441252963, 1441252963),
(18, 'buppha.c', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'buppha.c@psu.ac.th', 10, 1441252964, 1441252964),
(19, 'abdul-aziz.d', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'abdul-aziz.d@psu.ac.th', 10, 1441252965, 1441252965),
(20, 'veeraphong.r', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'veeraphong.r@psu.ac.th', 10, 1441252966, 1441252966),
(21, 'rusaman.y', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'rusaman.y@psu.ac.th', 10, 1441252967, 1441252967),
(22, 'jareeya.a', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'jareeya.a@psu.ac.th', 10, 1441252968, 1441252968),
(23, 'walakkamol.c', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'walakkamol.c@psu.ac.th', 10, 1441252969, 1441252969),
(24, 'kusuma.k', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'kusuma.k@psu.ac.th', 10, 1441252970, 1441252970),
(25, 'nuwan.t', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'nuwan.t@psu.ac.th', 10, 1441252971, 1441252971),
(26, 'sakiroh.y', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'sakiroh.y@psu.ac.th', 10, 1441252972, 1441252972),
(27, 'arunee.n', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'arunee.n@psu.ac.th', 10, 1441252973, 1441252973),
(28, 'phirakan.k', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'phirakan.k@psu.ac.th', 10, 1441252974, 1441252974),
(29, 'samatcha.n', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'samatcha.n@psu.ac.th', 10, 1441252975, 1441252975),
(30, 'suwanat.t', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'suwanat.t@psu.ac.th', 10, 1441252976, 1441252976),
(31, 'charinrat.s', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'charinrat.s@psu.ac.th', 10, 1441252977, 1441252977),
(32, 'bantika.j', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'bantika.j@psu.ac.th', 10, 1441252978, 1441252978),
(33, 'amornrat.c', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'amornrat.c@psu.ac.th', 10, 1441252979, 1441252979),
(34, 'kritsadee.p', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'kritsadee.p@psu.ac.th', 10, 1441252980, 1441252980),
(35, 'hamdia.c', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'hamdia.c@psu.ac.th', 10, 1441252981, 1441252981),
(36, 'laila.b', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'laila.b@psu.ac.th', 10, 1441252982, 1441252982),
(37, 'kanuengkwan.n', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'kanuengkwan.n@psu.ac.th', 10, 1441252983, 1441252983),
(38, 'ahmarn.m', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'ahmarn.m@psu.ac.th', 10, 1441252984, 1441252984),
(39, 'sariya.b', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'sariya.b@psu.ac.th', 10, 1441252985, 1441252985),
(40, 'muazzan.b', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'muazzan.b@psu.ac.th', 10, 1441252986, 1441252986),
(41, 'jarungwit.b', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'jarungwit.b@psu.ac.th', 10, 1441252987, 1441252987),
(42, 'sumpunt.k', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'sumpunt.k@psu.ac.th', 10, 1441252988, 1441252988),
(43, 'ihitima.t', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'thitima.t@psu.ac.th', 10, 1441252989, 1441252989),
(44, 'muhammadsuhaimi.y', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'muhammadsuhaimi.y@psu.ac.th', 10, 1441252990, 1441252990),
(45, 'chanakit.t', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'chanakit.t@psu.ac.th', 10, 1441252991, 1441252991),
(46, 'kamtorn.k', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'kamtorn.k@psu.ac.th', 10, 1441252992, 1441252992),
(47, 'suparaporn.t', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'suparaporn.t@psu.ac.th', 10, 1441252993, 1441252993),
(48, 'dusadee.p', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'dusadee.p@psu.ac.th', 10, 1441252994, 1441252994),
(49, 'phakdee.tu', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'phakdee.tu@psu.ac.th', 10, 1441252995, 1441252995),
(50, 'sittikorn.t', 'C6ysWQ68Kp9R-peIOZKjyi5A8HH0nitw', '', NULL, 'sittikorn.t@psu.ac.th', 10, 1441252996, 1441252996);

-- --------------------------------------------------------

--
-- Table structure for table `user_profile`
--

CREATE TABLE `user_profile` (
  `user_id` int(11) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `avatar_offset` varchar(255) NOT NULL,
  `avatar_cropped` varchar(255) NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `cover_offset` varchar(255) NOT NULL,
  `cover_cropped` varchar(255) NOT NULL,
  `cover` varchar(255) NOT NULL,
  `bio` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_profile`
--

INSERT INTO `user_profile` (`user_id`, `firstname`, `lastname`, `avatar_offset`, `avatar_cropped`, `avatar`, `cover_offset`, `cover_cropped`, `cover`, `bio`) VALUES
(1, 'พิมพ์ชนก', 'พลวรรณ', '11.88-8-89.38-70', '5836f22a0fe1d_5836f22a0ef8e.jpg', '5836f22a0ef8e.jpg', '', '', '', ''),
(2, 'วนิดา ', 'บุญพร้อม', '11.88-9.5-88.13-70.5', '5836f26737ca1_5836f26736587.jpg', '5836f26736587.jpg', '', '', '', ''),
(3, 'ยุพดี', 'อุดมพงษ์', '0-0-100-100', '5836f280686e7_5836f28066f1d.jpg', '5836f28066f1d.jpg', '', '', '', ''),
(4, 'อิทธิเดช', 'รัตนะ', '11.25-5.5-88.75-67.5', '5836f29c47360_5836f29c46458.jpg', '5836f29c46458.jpg', '', '', '', ''),
(5, 'สุรกิจ', 'ชูเดช', '33.33-11-86.66-91', '0.22093761373120158_cropped.png', '0.19640678737925032_584f9125d0bc2.jpg', '18.72-39.83-98.72-93.16', '0.38687151430751854_cropped.png', '0.7781386710115898_apple_ios_mountains_and_galaxy-wallpaper-1920x1080.jpg', 'ไม่หล่อเว้ย'),
(6, 'แก่นจันทร์', 'มูสิกธรรม', '10.63-8.5-85-68', '5836f2ba97689_5836f2ba96af2.jpg', '5836f2ba96af2.jpg', '', '', '', ''),
(7, 'ทวีศักดิ์', 'หมานเม๊าะ', '11.88-9.5-88.13-70.5', '5836f2d2a74ea_5836f2d2a6832.jpg', '5836f2d2a6832.jpg', '', '', '', ''),
(8, 'อรทัย', 'จารุวิเศษ', '13.13-10.5-87.5-70', '5836f2e98adb9_5836f2e9894fb.jpg', '5836f2e9894fb.jpg', '', '', '', ''),
(9, 'สมาน', 'เจะมะ', '10-0-90-80', '0.8057856602833968_cropped.png', '0.2452218526475729_photo.jpg', '2.5-6.02-82.5-53.98', '0.5352828646201822_cropped.png', '0.7734644862220585_kjyvq6i.jpg', ''),
(10, 'นาวิกา', 'เพ็งจันทร์', '0.49-6-100-72.3', '0.5439306553679277_cropped.png', '0.5794111589644755_Navika-Kotia-at-Murugatrupadai-Audio-Launch-14.jpg', '0-0-100-87.5', '0.769044863565681_cropped.png', '0.585013859333618_2600.jpg', 'ดีจ้า'),
(11, 'กิตติศักดิ์', 'ประชุมทอง', '10-4.8-87-66.4', '5836f3354e9e4_5836f3354d1de.jpg', '5836f3354d1de.jpg', '', '', '', ''),
(12, 'พัชรกัญญ์', 'ยังปากน้ำ', '0-0-100-100', '5836f34cd1bbe_5836f34cd0d47.jpg', '5836f34cd0d47.jpg', '', '', '', ''),
(13, 'ชวนิทธิ์', 'ธนะสุข', '30.95-7.75-67.95-32.25', '584fa1de34daf_584fa1de338d0.jpg', '584fa1de338d0.jpg', '', '', '', ''),
(14, 'อุสมาน', 'ตาเละ', '0-0-100-100', '5836f37eba0b4_5836f37eb96ba.jpg', '5836f37eb96ba.jpg', '', '', '', ''),
(15, 'ธิดากาญจน์', 'คงมาก', '11.88-9.5-88.75-71', '5836f39901794_5836f39900766.jpg', '5836f39900766.jpg', '', '', '', ''),
(16, 'สุนิสา', 'หมัดเน', '11.25-9.5-88.13-71', '5836f3b2743ca_5836f3b272eaa.jpg', '5836f3b272eaa.jpg', '0-14.38-100-46.73', '584f9f0910249_584f98635ed72.jpg', '584f98635ed72.jpg', ''),
(17, 'วาสิณี', 'จันทอง', '13.13-5.5-86.25-64', '5836f3cc26ff4_5836f3cc25d8b.jpg', '5836f3cc25d8b.jpg', '', '', '', ''),
(18, 'บุปผา', 'ไชยแสง', '', '', '', '', '', '', NULL),
(19, 'อับดุลอาซิส', 'ดือราแม', '11.88-9.5-88.75-71', '5836f3e78d9e4_5836f3e78c0d3.jpg', '5836f3e78c0d3.jpg', '', '', '', ''),
(20, 'วีระพงศ์', 'เรืองสกุล', '0-0-100-100', '5836f402dd6d3_5836f402dcc6d.jpg', '5836f402dcc6d.jpg', '', '', '', ''),
(21, 'รุสมาน', 'ยูโซะ', '0-0-99.8-100', '5836f41b7d2bc_5836f41b7bfc2.jpg', '5836f41b7bfc2.jpg', '0-25.28-100-60.84', '5836f42954510_5836f42953402.jpg', '5836f42953402.jpg', ''),
(22, 'จารียา', 'อรรถอนุชิต', '0-0-100-100', '5836c7338ce1f_5836c7338a566.jpg', '5836c7338a566.jpg', '', '', '', ''),
(23, 'วลักษณ์กมล', 'จ่างกมล', '0-3.1-100-91.09', '5836c89803f1b_5836c898033e7.jpg', '5836c898033e7.jpg', '', '', '', ''),
(24, 'กุสุมา', 'กูใหญ่ ', '0-0-100-100', '5836c83626101_5836c83624b89.jpg', '5836c83624b89.jpg', '', '', '', ''),
(25, 'นุวรรณ', 'ทับเที่ยง', '', '', '', '', '', '', NULL),
(26, 'สากีเราะ แยนา', 'เบ็ญฮารูน', '14.77-1.5-84.53-48.75', '59bea5c17bed0_59bea5c17ac49.jpg', '59bea5c17ac49.jpg', '0-1.98-100-37.53', '59bdf28a4a086_59bdf28a48eca.jpg', '59bdf28a48eca.jpg', ''),
(27, 'อรุณีวรรณ', 'บัวเนี่ยว', '0-0-100-100', '5836c9b51016b_5836c9b50f447.jpg', '5836c9b50f447.jpg', '', '', '', ''),
(28, 'ภีรกาญจน์', 'ไค่นุ่นนา', '0-0-100-100', '5836c86f51045_5836c86f4f894.jpg', '5836c86f4f894.jpg', '', '', '', ''),
(29, 'สมัชชา', 'นิลปัทม์', '0-0-100-100', '5836c8c51ee3f_5836c8c51daa9.jpg', '5836c8c51daa9.jpg', '', '', '', ''),
(30, 'สุวนาถ', 'ทองสองยอด', '0-0-100-100', '5836c93512bfb_5836c93512111.jpg', '5836c93512111.jpg', '', '', '', ''),
(31, 'อาทิตยา', 'สมโลก', '0-0-100-100', '5836c9cd4c16c_5836c9cd4b627.jpg', '5836c9cd4b627.jpg', '', '', '', ''),
(32, 'บัณฑิกา', 'จารุมา', '', '', '', '', '', '', NULL),
(33, 'อมรรัตน์', 'ชนะการณ์', '0-0-100-67.36', '5836c94963fe7_5836c94963251.jpg', '5836c94963251.jpg', '', '', '', ''),
(34, 'กฤษดี', 'พ่วงรอด', '0-0-100-100', '5836c80882e7b_5836c80881ae0.jpg', '5836c80881ae0.jpg', '', '', '', ''),
(35, 'ฮัมเดีย', 'มูดอ', '0-0-100-100', '5836c9e6188b8_5836c9e6179da.jpg', '5836c9e6179da.jpg', '', '', '', ''),
(36, 'ไลลา', 'บุญพิศ', '', '', '', '', '', '', NULL),
(37, 'คนึงขวัญ', 'นุ่นแก้ว', '', '', '', '', '', '', NULL),
(38, 'อาหมาน', 'หมัดเจริญ', '0-0-100-100', '5836ca61799a5_5836ca61781ca.jpg', '5836ca61781ca.jpg', '', '', '', ''),
(39, 'ศริยา', 'บิลแสละ', '0-0-99.68-66', '5960ba1a16d79_5960ba1a11959.jpg', '5960ba1a11959.jpg', '0-29.86-100-76.2', '5960bb9393c89_5960bb9392a00.jpg', '5960bb9392a00.jpg', ''),
(40, 'มูอัสซัล', 'บิลแสละ', '0-0-100-100', '5836ca8df1823_5836ca8df0963.jpg', '5836ca8df0963.jpg', '', '', '', ''),
(41, 'จรุงวิทย์', 'บุญเพิ่ม', '0-0-100-75', '5836caa50989a_5836caa508e29.jpg', '5836caa508e29.jpg', '', '', '', ''),
(42, 'สัมพันธ์', 'คงมาก', '0-0-100-75', '5836caba3fea0_5836caba3f068.jpg', '5836caba3f068.jpg', '', '', '', ''),
(43, 'ฐิติมา', 'เทพญา', '0-0-100-74.24', '586b3ff408ddb_586b3eed6122b.jpg', '586b3eed6122b.jpg', '', '', '', ''),
(44, 'มูฮำหมัดสูใฮมี', 'ยานยา', '0-0-100-100', '5836cadc94b79_5836cadc93b34.jpg', '5836cadc93b34.jpg', '', '', '', ''),
(45, 'ชนกิตติ์', 'ธนะสุข', '0-0-100-100', '5836cb3023929_5836cb3022f5d.jpg', '5836cb3022f5d.jpg', '', '', '', ''),
(46, 'กำธร', 'เกิดทิพย์', '0-0-100-100', '5836cb46d960c_5836cb46d8451.jpg', '5836cb46d8451.jpg', '', '', '', ''),
(47, 'ศุภราภรณ์', 'ทวนน้อย', '0-0-100-100', '5836cb59145a9_5836cb5913a8b.jpg', '5836cb5913a8b.jpg', '', '', '', ''),
(48, 'ดุษฎี', 'เพ็ชรมงคล', '0-0-100-100', '5836cb6add1ca_5836cb6adc424.jpg', '5836cb6adc424.jpg', '', '', '', ''),
(49, 'ภักดี', 'ต่วนศิริ', '0-0-100-100', '5836cb7eea857_5836cb7ee9659.jpg', '5836cb7ee9659.jpg', '', '', '', ''),
(50, 'สิทธิกร', 'เทพสุวรรณ', '0-0-100-100', '5836cb8ea2d45_5836cb8ea22d1.jpg', '5836cb8ea22d1.jpg', '', '', '', ''),

--
-- Indexes for dumped tables
--

--
-- Indexes for table `desktop_setting`
--
ALTER TABLE `desktop_setting`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `password_reset_token` (`password_reset_token`);

--
-- Indexes for table `user_profile`
--
ALTER TABLE `user_profile`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `desktop_setting`
--
ALTER TABLE `desktop_setting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `session`
--
ALTER TABLE `session`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;
--
-- AUTO_INCREMENT for table `user_profile`
--
ALTER TABLE `user_profile`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

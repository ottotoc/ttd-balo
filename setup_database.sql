-- Tạo database
CREATE DATABASE IF NOT EXISTS ttd_balo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tạo user và cấp quyền
CREATE USER IF NOT EXISTS 'ttd'@'localhost' IDENTIFIED BY 'ttd123456';
GRANT ALL PRIVILEGES ON ttd_balo.* TO 'ttd'@'localhost';
FLUSH PRIVILEGES;


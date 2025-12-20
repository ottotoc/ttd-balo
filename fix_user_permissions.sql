-- Xóa user cũ nếu có (nếu lỗi thì bỏ qua)
DROP USER IF EXISTS 'ttd'@'localhost';

-- Tạo lại user và cấp quyền đầy đủ
CREATE USER 'ttd'@'localhost' IDENTIFIED BY 'ttd123456';
GRANT ALL PRIVILEGES ON ttd_balo.* TO 'ttd'@'localhost';
GRANT CREATE ON *.* TO 'ttd'@'localhost';  -- Cần quyền này để tạo shadow database
FLUSH PRIVILEGES;

-- Kiểm tra quyền
SHOW GRANTS FOR 'ttd'@'localhost';


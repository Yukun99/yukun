-- Run once in phpMyAdmin (the API's DB user has no ALTER right). Safe to run twice.
USE yukunxuc_yukun;

SET @exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'models' AND COLUMN_NAME = 'source'
);
SET @sql = IF(
  @exists = 0,
  'ALTER TABLE models ADD COLUMN source LONGBLOB NULL AFTER thumbnail',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

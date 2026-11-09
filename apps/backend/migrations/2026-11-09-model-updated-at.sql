-- Run once in phpMyAdmin (the API's DB user has no ALTER right). Safe to run twice.
USE yukunxuc_yukun;

SET @exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'models' AND COLUMN_NAME = 'updated_at'
);
SET @sql = IF(
  @exists = 0,
  'ALTER TABLE models ADD COLUMN updated_at BIGINT UNSIGNED NOT NULL AFTER created_at',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE models SET updated_at = created_at WHERE updated_at = 0;

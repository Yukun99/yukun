-- Run once in phpMyAdmin (the API's DB user has no CREATE right).
USE yukunxuc_yukun;

CREATE TABLE IF NOT EXISTS models (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  link VARCHAR(500) NOT NULL DEFAULT '',
  size INT UNSIGNED NOT NULL,
  data LONGBLOB NOT NULL,
  created_at BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Run once in phpMyAdmin (the API's DB user has no CREATE right).
USE yukunxuc_yukun;

CREATE TABLE IF NOT EXISTS ideas (
  slot SMALLINT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  updated_at BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (slot)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

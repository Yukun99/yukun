-- Run once in phpMyAdmin (the API's DB user has no CREATE right).
USE yukunxuc_yukun;

CREATE TABLE IF NOT EXISTS visitors (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ip_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  first_seen BIGINT UNSIGNED NOT NULL,
  last_seen BIGINT UNSIGNED NOT NULL,
  visits INT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY visitors_ip_hash (ip_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

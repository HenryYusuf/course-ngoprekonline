-- Starter dataset untuk latihan SQL analis
-- Jalankan sekali di Postgres/SQLite untuk membuat tabel contoh,
-- lalu praktikkan query dari cheat-sheet-untuk-analis.md.

CREATE TABLE pelanggan (
  id        INTEGER PRIMARY KEY,
  nama      TEXT    NOT NULL,
  kategori  TEXT    NOT NULL,
  kota      TEXT
);

CREATE TABLE pesanan (
  id           INTEGER PRIMARY KEY,
  pelanggan_id INTEGER NOT NULL REFERENCES pelanggan(id),
  tanggal      DATE    NOT NULL,
  total        NUMERIC NOT NULL
);

INSERT INTO pelanggan (id, nama, kategori, kota) VALUES
  (1, 'Ayu',   'premium', 'Jakarta'),
  (2, 'Budi',  'reguler', 'Bandung'),
  (3, 'Citra', 'premium', 'Surabaya'),
  (4, 'Dedi',  'reguler', NULL),
  (5, 'Eka',   'premium', 'Jakarta');

INSERT INTO pesanan (id, pelanggan_id, tanggal, total) VALUES
  (1, 1, '2026-09-03', 250000),
  (2, 1, '2026-09-17', 180000),
  (3, 2, '2026-09-05', 90000),
  (4, 3, '2026-09-21', 410000),
  (5, 3, '2026-10-02', 75000),
  (6, 1, '2026-10-08', 320000);

-- Latihan 1: pendapatan per kategori bulan berjalan
-- Latihan 2: pelanggan yang belum pernah memesan (anti join)
-- Latihan 3: jumlah pesanan tiap pelanggan (LEFT JOIN)

# Cheat sheet SQL untuk Analis

Ringkasan query yang paling sering dipakai kerja analis data sehari-hari.
Simpan sebagai referensi cepat saat menulis query di tools BI atau database.

## Urutkan & batasi hasil

```sql
-- 10 baris teratas dengan nilai terbesar
SELECT *
FROM penjualan
ORDER BY total DESC
LIMIT 10;
```

## Ringkas per kelompok

```sql
-- Jumlah baris dan total per kategori
SELECT
  kategori,
  COUNT(*)        AS jumlah_transaksi,
  SUM(total)      AS pendapatan,
  ROUND(AVG(total), 2) AS rata_rata
FROM penjualan
WHERE tanggal >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY kategori
HAVING COUNT(*) > 5
ORDER BY pendapatan DESC;
```

## Gabungkan dua tabel

```sql
-- LEFT JOIN supaya pelanggan tanpa pesanan tetap muncul
SELECT
  p.id,
  p.nama,
  COUNT(d.id) AS jumlah_pesanan
FROM pelanggan p
LEFT JOIN pesanan d ON d.pelanggan_id = p.id
GROUP BY p.id, p.nama;
```

## Cari nilai yang hilang (anti join)

```sql
-- Pelanggan yang belum pernah memesan
SELECT p.*
FROM pelanggan p
WHERE NOT EXISTS (
  SELECT 1 FROM pesanan d WHERE d.pelanggan_id = p.id
);
```

## Hitung perubahan antar periode

```sql
-- Pendapatan bulan ini vs bulan lalu per kategori
WITH bulan_ini AS (
  SELECT kategori, SUM(total) AS nilai
  FROM penjualan
  WHERE tanggal >= DATE_TRUNC('month', CURRENT_DATE)
  GROUP BY kategori
),
bulan_lalu AS (
  SELECT kategori, SUM(total) AS nilai
  FROM penjualan
  WHERE tanggal >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    AND tanggal <  DATE_TRUNC('month', CURRENT_DATE)
  GROUP BY kategori
)
SELECT
  COALESCE(bi.kategori, bl.kategori) AS kategori,
  COALESCE(bi.nilai, 0)              AS bulan_ini,
  COALESCE(bl.nilai, 0)              AS bulan_lalu,
  COALESCE(bi.nilai, 0) - COALESCE(bl.nilai, 0) AS selisih
FROM bulan_ini bi
FULL OUTER JOIN bulan_lalu bl ON bl.kategori = bi.kategori
ORDER BY selisih DESC;
```

## Catatan praktis

- Selalu pakai `WHERE` sebelum `GROUP BY` untuk membatasi cakupan; memfilter
  setelah agregasi lewat `HAVING` jauh lebih mahal.
- `COUNT(*)` menghitung baris; `COUNT(kolom)` menghitung nilai non-NULL.
- CTE (`WITH ...`) membuat query panjang lebih mudah dibaca dan didebug.
- Simpan query yang sudah teruji sebagai view supaya tim memakai definisi yang sama.

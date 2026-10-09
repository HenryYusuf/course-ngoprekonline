# Rumus Google Sheets untuk laporan mingguan

Kumpulan rumus yang paling sering saya pakai saat merangkum laporan
mingguan. Semua contoh memakai tabel bernama `penjualan`.

## Ringkas cepat

```excel
=SUMIF(penjualan!C:C; "selesai"; penjualan!D:D)
```

Jumlah nilai di kolom D yang kolom C-nya "selesai".

```excel
=COUNTIFS(penjualan!B:B; ">="&AWAL_MINGGU; penjualan!B:B; "<="&AKHIR_MINGGU)
```

Hitung baris dalam rentang tanggal tertentu (pakai sel berisi tanggal,
bukan mengetik tanggal langsung di rumus).

## Cari nilai terbesar / terkecil

```excel
=MAX(penjualan!D:D)
=MINIFS(penjualan!D:D; penjualan!C:C; "selesai")
```

## Cari teks yang mengandung kata kunci

```excel
=COUNTIF(penjualan!E:E; "*refund*")
```

Bintang di awal/akhir artinya "mengandung".

## Gabungkan teks dua kolom

```excel
=A2&" | "&B2
```

## Tanggal otomatis

```excel
=TODAY()                       // hari ini
=WEEKNUM(TODAY())              // nomor minggu berjalan
=TODAY()-WEEKDAY(TODAY())+2    // hari Senin minggu ini
```

## Tampil lebih rapi

```excel
=TEXT(D2; "Rp#,##0")
```

Ubah angka mentah jadi format rupiah langsung di sel teks.

## Tips

- Selalu pakai `ArrayFormula` / `FILTER` bila hasilnya lebih dari satu sel,
  supaya tidak menarik rumus ke bawah manual.
- Bekukan baris judul (View → Freeze) agar judul tetap terlihat saat scroll.
- Simpan template laporan sebagai salinan, jangan menimpa lembar asli.

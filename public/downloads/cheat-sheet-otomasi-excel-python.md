# Cheat Sheet: Otomasi Excel dengan Python

Paket pendukung artikel "Excel Unleashed: Belajar Python di Excel", dari Ngoprek.Online.
Simpan di samping keyboard, buka saat praktik.

## Siapkan lingkungan

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install openpyxl pandas
```

## Membaca workbook

```python
from openpyxl import load_workbook

wb = load_workbook("data.xlsx", data_only=True)   # nilai hasil rumus
ws = wb["Sheet1"]                                  # nama lembar kerja

for row in ws.iter_rows(min_row=2, values_only=True):
    print(row)                                     # tuple per baris
```

## Menulis dan menyimpan

```python
from openpyxl import load_workbook

wb = load_workbook("data.xlsx")
ws = wb.active

ws["D2"] = "=B2*C2"
ws.append(["Kopi", 3, 12500])                      # tambah satu baris
wb.save("data-baru.xlsx")                          # selalu save ke file baru
```

## Panduan cepat pandas

| Kebutuhan                       | Perintah                                  |
| ------------------------------- | ----------------------------------------- |
| Baca sheet                      | `pd.read_excel("data.xlsx", sheet_name=0)` |
| Tulis ke sheet baru             | `df.to_excel("out.xlsx", index=False)`     |
| Kolom wajib ada                 | `df.dropna(subset=["kolom"])`              |
| Group & ringkas                 | `df.groupby("kategori")["nilai"].sum()`    |
| Simpan tanpa index Excel        | `df.to_excel("out.xlsx", index=False)`     |

## Jebakan yang sering terjadi

- Workbook terbuka di Excel → file terkunci, `wb.save()` gagal. Tutup Excel dulu.
- Rumus tidak muncul hasilnya → baca dengan `data_only=True` setelah file pernah dibuka Excel.
- Kolom jadi integer campur string → paksa `dtype={"kode": str` saat membaca.
- Nama sheet salah → `KeyError`. Cek dulu: `print(wb.sheetnames)`.

## Format angka gaya Indonesia

```python
from openpyxl.styles import NumberFormat

ws["C2"].number_format = '#,##0'          # 125000 → 125.000
```

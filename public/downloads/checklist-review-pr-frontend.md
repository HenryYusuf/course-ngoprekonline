# Checklist review pull request frontend

Cetak atau simpan ini sebelum minta review. Setiap poin harus jelas
"ya" atau "tidak". Kalau ragu, tanyakan di PR, jangan ditebak.

## Sebelum minta review

- [ ] Branch sudah di-rebase / merge terbaru dari main
- [ ] Commit message menjelaskan *mengapa*, bukan hanya *apa*
- [ ] Tidak ada `console.log` atau kode debug yang tertinggal
- [ ] Tidak ada file rahasia (`.env`, token, kredensial)
- [ ] Typecheck dan lint lulus lokal
- [ ] Ada test untuk perilaku baru atau yang berubah

## Kualitas kode

- [ ] Nama variabel/fungsi menjelaskan maksudnya tanpa perlu komentar
- [ ] Setiap fungsi melakukan satu hal yang jelas
- [ ] Tidak ada duplikasi logika yang bisa dipindah ke util bersama
- [ ] Penanganan error: kondisi gagal ditangani, bukan dibiarkan lewat
- [ ] Empty state dan loading state dipikirkan

## UI & aksesibilitas

- [ ] Terlihat benar di mobile dan desktop
- [ ] Keyboard bisa menjangkau semua kontrol interaktif
- [ ] Label dan alt text ada pada elemen yang relevan
- [ ] Kontras teks memadai

## Di komentar review

- [ ] Sampaikan maksud, bukan hanya menunjuk baris
- [ ] Bedakan "wajib ubah" dari "opsional / saran"
- [ ] Sebut hal yang sudah bagus juga bila ada

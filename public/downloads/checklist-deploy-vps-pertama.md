# Checklist deploy pertama ke VPS

Ikuti berurutan. Setiap langkah punya "cara tahu berhasil" supaya kamu
tidak menebak-nebak saat ada yang salah.

## Sebelum sentuh server

- [ ] Domain (opsional) sudah mengarah ke IP VPS
- [ ] Kamu simpan IP, dan bisa `ssh` dari terminal lokal
- [ ] Backup data penting sudah ada di luar VPS

## Amankan akses

- [ ] Login pakai SSH key, bukan password
- [ ] Password auth dimatikan setelah key teruji
- [ ] Port SSH dipindah atau dibatasi IP (opsional, hati-hati mengunci diri)
- [ ] Firewall aktif: hanya buka 22 (SSH), 80, 443

Cara tahu berhasil: `ssh` masih masuk memakai key setelah password dimatikan.

## Pasang runtime

- [ ] Sistem sudah `apt update` / `upgrade`
- [ ] Terpasang: git, dan runtime yang dibutuhkan app (Node, dsb)
- [ ] Proses app dijalankan lewat systemd/pm2, bukan `node server.js` telanjang

Cara tahu berhasil: app hidup lagi otomatis setelah server di-`reboot`.

## Tarik kode & jalankan

- [ ] Kode ditarik ke direktori tetap (mis. `/srv/app`)
- [ ] Dependensi dipasang lewat lockfile (`npm ci` / `pnpm i --frozen-lockfile`)
- [ ] Variabel lingkungan diisi lewat file env, bukan ditulis di skrip

## Balikkan lewat reverse proxy

- [ ] Caddy/Nginx dipasang sebagai penjmpa di depan app
- [ ] HTTPS otomatis (Caddy) atau sertifikat terpasang
- [ ] App tidak diekspos langsung ke publik selain lewat proxy

Cara tahu berhasil: `https://domain-kamu` membuka app, bukan error sertifikat.

## Amati & siapkan cadangan

- [ ] Log app dan proxy tahu cara dilihat
- [ ] Backup otomatis (basis data, file) terjadwal dan sudah pernah diuji restore
- [ ] Ada cara cepat rollback ke versi sebelumnya

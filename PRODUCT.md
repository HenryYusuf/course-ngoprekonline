# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pembelajar dan developer Indonesia yang mencari tutorial praktis. Situasi: mereka datang dengan satu topik yang ingin dipelajari (Docker, VPS, Python, desain, dst.) dan harus menemukan artikel atau resource yang tepat dalam hitungan detik. Pekerjaan mereka: menemukan, menilai, lalu membaca/mengunduh.

## Product Purpose

Blog tutorial Indonesia (Ngoprek.Online) yang memungkinkan pembaca belajar lewat artikel dan mengunduh resource pendukung (template, kode, cheat sheet, aset) langsung dari artikel. Keberhasilan: pengunjung baru langsung memahami isi situs dan menemukan artikel/topik yang dicari dengan cepat.

## Positioning

Tutorial Indonesia yang siap dipakai: setiap artikel bukan hanya dibaca, tetapi resource-nya bisa diunduh dan langsung dipraktikkan.

## Operating Context

- Konten dimiliki repo (Nuxt Content, Markdown di `content/blog/`), diedit langsung atau lewat Nuxt Studio; publish = keputusan konten, bukan deploy.
- Deployment SSR netral-platform (serverless / VPS Docker), halaman blog di-prerender.
- Seluruh antarmuka berbahasa Indonesia.

## Capabilities and Constraints

- Fitur yang sudah ada dan tetap ada: daftar homepage (dengan pagination `?page=N`), `/blog` (dengan pagination `?page=N`), `/blog/[slug]`, arsip tag `/blog/tag/[tag]`, arsip kategori `/blog/category/[category]`, pencarian `/cari`, `/rss.xml`, `/sitemap.xml`, `/robots.txt`, zip per artikel `/downloads/[slug].zip`.
- Gate publish di `shared/utils/publishing.ts` (draft & tanggal masa depan tidak tampil) harus dipertahankan.
- **Unduhan resource per artikel sudah ada**: skema frontmatter `resources` (judul `title`, berkas `file`, ukuran `bytes`) di `content.config.ts`, UI unduh di `SpecPlate.vue` pada halaman artikel (tautan per berkas, plus "Unduh semua" ZIP bila ≥2 berkas), dan invariant test `content/resources-invariant.test.ts` yang memastikan `bytes` sama dengan ukuran file asli di `public/downloads/`.
- Satu Category kurasi per post; Tag bebas. Daftar kategori di `content/categories/*.yml`, invariant test menjaga kecocokan slug.
- Setiap post punya tepat satu Category (tidak bersarang); Tag bebas.
- Aksesibilitas: navigasi keyboard dan kontras teks wajib terpenuhi; standar spesifik lain belum ditetapkan.

## Brand Commitments

- Nama situs **Ngoprek.Online** dipertahankan (termasuk di header/footer/copyright).
- Seluruh konten artikel, routes, dan struktur navigasi dipertahankan; redesain mengubah tampilan, bukan produk.
- Bahasa antarmuka: Indonesia.
- Referensi visual mengikat apa yang dipilih di rancangan arah baru; tidak ada aset merek (logo gambar) yang ada; wordmark berupa teks.

## Evidence on Hand

- 28+ artikel Markdown nyata di `content/blog/` (sebagian ber-`draft`), 3 kategori: `tutorial`, `opini`, `umum`.
- Gambar konten opsional di `public/images/blog/` (banyak post tanpa gambar; card memakai cover CSS generatif).
- ADR: `docs/adr/0001` (Nuxt Content + Studio), `0002` (SSR netral-platform), `0003` (kategori kurasi vs tag).
- Tidak ada testimoni, pelanggan, benchmark, atau harga. Tidak ada yang boleh ditemukan.

## Product Principles

1. Kecepatan menemukan mengalahkan segalanya: daftar dan arsip harus bisa dipindai.
2. Artikel harus langsung bisa dipraktikkan, dengan resource diunduh dari halaman artikel.
3. Konten adalah produk: tampilan melayani teks, bukan sebaliknya.
4. Kejujuran konten: tidak ada klaim yang tidak didukung artikel itu sendiri.

## Accessibility & Inclusion

Belum ada standar spesifik yang ditetapkan pengguna; pekerjaan visual wajib mempertahankan kontras teks, urutan baca semantik, dan navigasi keyboard yang sudah ada.

# Riset: Fitur & Bagian yang Bisa Dikembangkan

Riset untuk project **course-ngoprekonline / Ngoprek.Online**, blog tutorial berbahasa Indonesia yang dibangun dengan Nuxt 4 + Nuxt Content + UnoCSS, tiap artikel bisa punya file unduhan.

**Cara riset.** Semua temuan dicek langsung ke sumber aslinya: kode program di repo ini, dokumen repo (`README.md`, `PRODUCT.md`, `DESIGN.md`, `docs/adr/*`), issue di GitHub, hasil menjalankan test/build lokal, dan dokumen resmi library (bukan tulisan orang ketiga).

**Cara membaca label:**

- **[PRIMER]**: fakta langsung dari kode/dokumen repo (dilengkapi `file:baris`).
- **[UKUR]**: angka yang saya hitung sendiri di repo/build ini (misal jumlah URL sitemap, ukuran file).
- **[INFERENSI]**: kesimpulan/saran saya, bukan pernyataan langsung dari repo.

---

## Ringkasan (versi singkat)

1. **Fitur unduhan, inti produk, masih setengah jadi.** Dari 31 artikel, cuma **2 yang punya file unduhan**. Ukuran file (`bytes`) yang tertulis di ketiga artikel **semuanya salah** jika dibandingkan file aslinya. Aturan "ukuran harus benar" cuma ada sebagai catatan kode, **tidak ada test yang mengeceknya**. Ini bertentangan dengan janji di `DESIGN.md` dan `PRODUCT.md` bahwa angka yang ditampilkan harus nyata.
2. **Halaman tag tidak terpakai.** Fitur arsip tag sudah ada route-nya dan disebut di `README.md:123`, tapi **tidak ada satu pun tautan tag di tampilan situs**. Akibatnya halaman tag tidak bisa ditemukan pembaca maupun mesin pencari, dan **0 halaman tag masuk sitemap** (dari total 35 URL).
3. **Pencarian (search) belum ada.** Padahal `PRODUCT.md:11` menyebut tugas utama pembaca adalah "menemukan artikel yang dicari dalam hitungan detik". Fitur ini sengaja tidak dikerjakan saat redesain (issue #12), padahal Nuxt Content sudah punya pencarian bawaan yang gratis dan tanpa tambahan dependensi → **dampak besar, usaha kecil**.
4. **Beberapa janji bahasa & SEO belum dipenuhi:**
   - Halaman error masih bawaan Nuxt berbahasa Inggris ("Page not found") karena belum ada `app/error.vue`.
   - Tag `<html>` tidak punya atribut `lang` (seharusnya bahasa Indonesia).
   - Gambar preview saat dibagikan ke sosial media (`og:image`) praktis tidak pernah muncul, 0 artikel punya field `image`.
   - Tautan RSS tidak diumumkan di halaman (`<link rel="alternate">` tidak ada).
   - `robots.txt` tidak menyebut lokasi sitemap.
5. **Dokumen sudah tidak sinkron dengan kode:**
   - `README.md:120` masih bilang homepage menampilkan "3 artikel terbaru" (aktualnya jauh lebih banyak dan sudah berpaginasi).
   - `PRODUCT.md:31` masih menyebut unduhan "Belum ada implementasi" padahal sudah ada.

**Status issue di GitHub:** tidak ada issue terbuka (semua sudah ditutup/di-merge). Artinya hampir semua temuan di bawah ini **belum dicatat di issue mana pun**, kandidat issue baru.

---

## Temuan per area

### A. Fitur unduhan resource (inti "Edutorial Blog Download")

| # | Temuan | Jenis |
| --- | --- | --- |
| A1 | Ukuran file (`bytes`) yang ditulis **salah di ketiga artikel**: cheat sheet `2067` vs asli **2069** (`content/blog/otomasi-excel-python.md:10`), template `1621` vs asli **1618** (baris 13), perintah docker `1944` vs asli **1941** (`content/blog/panduan-docker-untuk-pemula.md:13`). Angka salah ini yang tampil ke pembaca lewat `SpecPlate.vue:24-34` dan `PostCard.vue:28-32,124`. | [UKUR] + [PRIMER] |
| A2 | Aturan "ukuran harus sama dengan file asli" **hanya berupa komentar**, bukan test: `content.config.ts:27-34`. Karena itu kesalahan di A1 lolos dari `pnpm ci`. | [PRIMER] |
| A3 | Artikel yang punya file unduhan **cuma 2 dari 31**; file yang tersedia cuma 3 di `public/downloads/`. Padahal resource ini disebut sebagai pembeda produk (`PRODUCT.md:15,19`). | [UKUR] + [PRIMER] |
| A4 | Belum ada fitur "unduh semua sekaligus (zip)", penghitung jumlah unduhan, maupun halaman daftar semua resource. `SpecPlate` hanya menautkan file satu per satu (`SpecPlate.vue:69-99`). | [PRIMER] + [INFERENSI] |
| A5 | Test unduhan sudah ada (`SpecPlate.test.ts:11-50`, `HeroSection.test.ts:52-54`), tapi test-nya memakai angka `bytes` yang juga salah, jadi test justru mengukuhkan data yang keliru. | [PRIMER] |

**Saran area A:** (1) buat test yang memastikan `bytes` = ukuran file asli, lalu perbaiki 3 nilai (usaha sangat kecil); (2) otomatis hitung `bytes` saat build supaya tidak salah lagi; (3) tambah artikel yang punya resource; (4) pertimbangkan "unduh semua" dan statistik unduhan.

### B. Penemuan konten & SEO

| # | Temuan | Jenis |
| --- | --- | --- |
| B1 | Sitemap berisi **35 URL** (`/`, `/blog`, 3 arsip kategori, 30 artikel), **0 URL tag**. Artikel draft benar-benar tidak masuk (artinya filter draft bekerja dengan benar). | [UKUR] |
| B2 | Halaman tag tidak ikut dibuat saat build, padahal halaman kategori iya. Sebabnya: build hanya mengikuti tautan yang ada (`nuxt.config.ts:40-41`), dan **tidak ada tautan tag di tampilan mana pun**. | [UKUR] + [PRIMER] |
| B3 | Halaman artikel **tidak menampilkan tag sama sekali** (`app/pages/blog/[slug].vue:39-89`). Tag hanya dipakai untuk menyaring di dalam kode (`tag/[tag].vue:15`). Jadi pembaca tidak pernah bisa menemukan tag. | [PRIMER] |
| B4 | Tidak ada `<link rel="alternate">` untuk RSS di halaman mana pun, padahal feed RSS sudah ada (`server/routes/rss.xml.ts`) dan tombol RSS ditampilkan manual (`SiteHeader.vue:27-33`, `SiteFooter.vue:33-39`). | [PRIMER] |
| B5 | `public/robots.txt` cuma 2 baris dan **tidak menyebut lokasi sitemap**, mesin pencari yang membaca robots.txt jadi tidak tahu ada sitemap. | [PRIMER] |
| B6 | **Gambar preview (`og:image`) praktis tidak pernah terkirim**: hanya `blog/[slug].vue:31` yang mengesetnya, itupun kalau `post.image` ada, dan **0 dari 31 artikel punya field `image:`**. Folder `public/images/` juga tidak ada, padahal disebut di `README.md:55` dan `PRODUCT.md:46`. Halaman lain tidak mengeset `ogImage` sama sekali. | [UKUR] + [PRIMER] |
| B7 | Tidak ada data terstruktur JSON-LD (untuk rich results di Google), dan judul halaman tidak memakai `titleTemplate` (judul artikel tampil tanpa nama situs). | [PRIMER] + [INFERENSI] |
| B8 | `<html>` dirender **tanpa atribut `lang`**. Situs ini berbahasa Indonesia (`PRODUCT.md:25,40`), seharusnya `lang="id"`. | [UKUR] + [PRIMER] |
| B9 | Halaman error memakai komponen bawaan Nuxt (repo tidak punya `app/error.vue`), jadi teks yang muncul tetap Inggris: "Page not found". Padahal `PRODUCT.md:25` berjanji "Seluruh antarmuka berbahasa Indonesia". Cara resmi memperbaikinya: buat `app/error.vue` (dokumen Nuxt resmi). | [PRIMER] + [UKUR] |
| B10 | Homepage **tidak di-prerender** (`nuxt.config.ts:45-47`), jadi setiap kunjungan diproses penuh di server tanpa cache. Alasannya sah (komentar di `nuxt.config.ts:36-39`), tapi masih bisa ditambahkan cache. | [PRIMER] + [UKUR]; [INFERENSI] untuk peluang cache |
| B11 | Modul sitemap menyarankan `zeroRuntime: true` (terlihat di log build), cocok untuk situs yang hanya berubah saat deploy seperti ini; bisa memangkas ±50 KB dari bundle server. Sumber resmi: dokumentasi `nuxt-modules/sitemap`. | [UKUR] + [PRIMER] |
| B12 | Halaman `/?page=N` (N≥2) tidak masuk sitemap karena homepage tidak di-prerender, arsip berpaginasi jadi tidak terindeks. | [UKUR] + [INFERENSI] |

### C. Navigasi & halaman konten

| # | Temuan | Jenis |
| --- | --- | --- |
| C1 | `/blog` **tanpa pagination**, semua 31 artikel dirender sekaligus (`blog/index.vue:12,49-56`), padahal homepage sudah punya `?page=N` (`index.vue:21-32`). Halaman `/blog` jadi berat dan menduplikasi fungsi homepage. | [PRIMER] |
| B/C2 | Halaman tag menerima **semua teks tag apa pun** dengan status 200 (bukan 404) (`tag/[tag].vue:15,44-46`), berbeda dengan kategori yang menghasilkan 404 untuk slug tak dikenal. Berisiko dianggap "halaman kosong" oleh mesin pencari. | [PRIMER] + [INFERENSI] |
| C3 | Tidak ada "artikel terkait" di halaman artikel; pembaca hanya bisa berpindah lewat kategori (`[slug].vue:57-63`) dan arsip. | [PRIMER] + [INFERENSI] |
| C4 | Tidak ada halaman About/Kontak/Daftar tag, **ini disengaja**: spec redesain memutuskan "Tanpa halaman baru" (issue #12, keputusan 1). Jadi ini backlog sadar, bukan kelupaan. | [PRIMER] |
| C5 | Preview draft hanya bisa di mode development (`usePublishedPosts.ts:13-21`); di produksi draft selalu 404 dan belum ada cara preview bertoken untuk editor. | [PRIMER] + [INFERENSI] |

### D. Aksesibilitas & UX

| # | Temuan | Jenis |
| --- | --- | --- |
| D1 | Slider "Keluaran Terbaru" adalah area gulir horizontal **tanpa `tabindex`, tanpa `aria-label`, tanpa tombol next/prev** (`PostSlider.vue:33`), tidak bisa digulir pakai keyboard (melanggar WCAG 2.1.1). | [PRIMER] + [INFERENSI] |
| D2 | Utility `no-scrollbar` **rusak**: UnoCSS memunculkan warning `[unocss] unmatched utility "scrollbar-width:none"` saat test, artinya bagian itu tidak pernah dibuat; hanya bagian Webkit (Chrome/Safari) yang jalan. (`uno.config.ts:77`, dipakai di `PostSlider.vue:33`.) | [UKUR] + [PRIMER] |
| D3 | **Yang sudah bagus (jangan dirobohkan):** focus ring global (`uno.config.ts:137-140`), penghormatan `prefers-reduced-motion` (`uno.config.ts:110-116`), `aria-label` di nav header/footer/pagination, `aria-current` di pagination (`index.vue:117`), kontras warna terdokumentasi di `DESIGN.md:144-166`. | [PRIMER] |
| D4 | `PRODUCT.md:34,59` menyatakan standar aksesibilitas **belum ditetapkan**, belum ada audit (axe/Lighthouse) di `pnpm ci` maupun di CI. | [PRIMER] |
| D5 | Belum ada dark mode; ini **keputusan sadar** ("light-only dulu", issue #12 keputusan 5; `DESIGN.md:127,168`). | [PRIMER] |

### E. Kualitas konten, test, dan tooling

| # | Temuan | Jenis |
| --- | --- | --- |
| E1 | Test **sehat dan hijau**: 24 file / 84 test lulus dalam ~8 detik, `knip` bersih (tidak ada file/dependensi tak terpakai). | [UKUR] |
| E2 | **Celah test:** `[slug].test.ts:73` menulis "HTTP-level 404 is asserted by the build-and-serve verification", tapi **tidak ada verifikasi build-and-serve di pipeline mana pun**. Klaim itu tidak dibuktikan. | [PRIMER] |
| E3 | Belum ada test untuk: sitemap, ukuran file (`bytes`), keterlinkan tag, halaman error/bahasa, dan konfigurasi prerender. | [PRIMER] |
| E4 | Konten demo masih penuh: ada komentar `<!-- demo post (spec #12): boleh dihapus massal -->` + 28 post demo dari issue #14, mengganti dengan konten nyata adalah pekerjaan produk yang tersisa. | [PRIMER] |
| E5 | Dependensi usang (aman untuk dinaikkan): `nuxt 4.5.2 → 4.6.0`, `knip 6.39.0 → 6.40.0`; yang major/berisiko: `better-sqlite3 13`, `typescript 7`. | [UKUR] |
| E6 | `knip.json` hanya memeriksa `app/**` + `shared/**` (`knip.json:2-3`), jadi `server/**` dan `scripts/**` tidak dicek ketidakpakaiannya. | [PRIMER] + [INFERENSI] |
| E7 | `nitropack` dideklarasikan sebagai devDependency (`package.json:44`) padahal dipakai di kode runtime (`server/routes/rss.xml.ts:3`). Status dependensinya menyesatkan. | [PRIMER] + [INFERENSI] |

### F. Dokumentasi & ADR (janji tertunda / tidak sinkron)

| # | Temuan | Jenis |
| --- | --- | --- |
| F1 | `README.md:120` = homepage menampilkan "3 artikel terbaru", **keliru**, homepage kini hero + slider 10 + kategori + grid 24 + pagination (`index.vue:59-145`). | [PRIMER] |
| F2 | `PRODUCT.md:31` = unduhan "Belum ada implementasi", **sudah ada** (`content.config.ts:30-34`, `SpecPlate.vue:69-103`). Dokumen perlu diperbarui. | [PRIMER] |
| F3 | ADR tertunda: Studio production OAuth "deferred until a deployment exists" (`docs/adr/0001:15`), deployment sudah ada (Docker/VPS), jadi keputusan ini sudah waktunya ditinjau ulang. | [PRIMER] + [UKUR] |
| F4 | ADR menandai masa depan eksplisit: komentar/DB (`docs/adr/0001:16`), fitur dinamis (`docs/adr/0002:3`), kategori berjenjang (`docs/adr/0003:17`), semuanya "putuskan lagi bila ada kebutuhan nyata". | [PRIMER] |
| F5 | `README.md:111-112` menunda otomatisasi redeploy VPS ("automate with cron or CI if desired"), mekanisme itu belum ada di repo. | [PRIMER] + [INFERENSI] |

---

## Tabel prioritas (dampak vs usaha)

Dampak: **T** tinggi, **S** sedang, **R** rendah · Usaha: **R** rendah, **S** sedang, **T** tinggi.

| Prioritas | Temuan | Dampak | Usaha | Catatan singkat |
| --- | --- | --- | --- | --- |
| 1 | A2, test ukuran file + perbaiki 3 nilai salah | S | R | Menegakkan janji "angka nyata"; satu file test baru |
| 2 | B2+B3, tampilkan & tautkan tag di halaman artikel | T | R | Menghidupkan fitur yang sudah ada tapi tersembunyi |
| 3 | C1, pagination `/blog` (helper `paginate()` sudah ada) | S | R | Tinggal dipakai; test juga sudah siap |
| 4 | B4+B5, umumkan RSS + lokasi sitemap | S | R | Beberapa baris saja |
| 5 | B8+B9, `lang="id"` + halaman error berbahasa Indonesia | S | R | Menutup pelanggaran "seluruh UI Indonesia" |
| 6 | B6, gambar preview default + `titleTemplate` | S | R–S | Saat ini share ke sosial media tanpa gambar |
| 7 | **Pencarian teks penuh (bawaan Nuxt Content)** | **T** | S | Tugas utama pembaca; nol dependensi; sengaja ditunda di issue #12 → saatnya dibuka |
| 8 | D2, perbaiki shortcut `no-scrollbar` | R | R | Ada warning test; scrollbar masih muncul di Firefox |
| 9 | D1, aksesibilitas slider (tabindex/label/tombol) | S | R | Sesuai `PRODUCT.md:34` |
| 10 | E2, smoke test build-and-serve | S | S | Menutup klaim test yang tak terbukti |
| 11 | A3/A4, lebih banyak artikel ber-resource + "unduh semua" | T | S–T | Ini diferensiasi produk, sekarang cuma 2/31 |
| 12 | C3, artikel terkait di halaman artikel | S | S | Naikkan waktu baca; query collection sudah ada |
| 13 | B11, `sitemap.zeroRuntime: true` | S | S | Saran resmi modul; memangkas bundle server |
| 14 | E4, ganti post demo dengan konten nyata | T | T | Pekerjaan editorial, bukan kode |
| 15 | F1+F2, sinkronkan README & PRODUCT.md | S | R | Mencegah keputusan salah dari dokumen |
| 16 | B7, JSON-LD `Article` + breadcrumb | S | S | Untuk rich results di Google |
| 17 | C5, preview draft bertoken di produksi | S | S | Alur editor; sekarang hanya bisa di dev |
| 18 | E5, naikkan Nuxt 4.6 / knip (kecil), tunda TS 7 | R | R | Rutin; TS 7 = major berisiko |
| 19 | D4, audit aksesibilitas masuk CI | S | S | Standarnya belum ditetapkan |
| 20 | B10, cache untuk homepage | S | S | Homepage SSR tanpa cache per request |
| 21 | Dark mode, komentar (DB), kategori berjenjang | R–S | T | Sengaja ditunda di issue #12 & ADR, putuskan ulang hanya bila perlu |
| 22 | Analytics / PWA / i18n bahasa lain | R | S | Tidak disebut di `PRODUCT.md`; i18n justru di luar positioning "bahasa Indonesia" |

---

## Sumber

**Dokumen repo**

- `README.md` (:33-126), `PRODUCT.md` (:11,15,19,25,29-34,40,45-46,59), `CONTEXT.md`, `DESIGN.md` (:119-298), `AGENTS.md`
- `docs/adr/0001-nuxt-content-and-nuxt-studio-for-content-management.md`, `docs/adr/0002-ssr-with-platform-neutral-deployment.md`, `docs/adr/0003-curated-categories-as-content-coexisting-with-tags.md`
- `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, `docs/agents/domain.md`

**Kode**

- `nuxt.config.ts:10-83`, `content.config.ts:14-36`, `uno.config.ts:63-142`, `package.json:6-59`, `knip.json`, `vitest.config.ts`
- `app/pages/index.vue`, `app/pages/blog/index.vue`, `app/pages/blog/[slug].vue`, `app/pages/blog/tag/[tag].vue`, `app/pages/blog/category/[category].vue`
- `app/components/{SpecPlate,PostCard,PostSlider,HeroSection,SiteHeader,SiteFooter}.vue`
- `app/composables/usePublishedPosts.ts`, `app/utils/pagination.ts`, `server/routes/rss.xml.ts`
- `content/category-invariant.test.ts`, `content/blog/*.md`, `public/robots.txt`, `public/downloads/*`
- `.github/workflows/ci.yml`, `docker-compose.yml`, `scripts/setup-studio.sh`

**Issue tracker (GitHub, via `gh`)**

- `gh issue list --state open` → kosong
- Issue #5–#10 dan #12–#21 (16 issue, semuanya CLOSED); PR #1–#4, #11, #22–#25 (semua MERGED)

**Pengukuran lokal**

- `pnpm test --run` → 24 file, 84 test lulus, warning `unmatched utility "scrollbar-width:none"`
- `pnpm knip` → bersih, dengan saran `[@nuxtjs/sitemap] No dynamic sources detected…`
- `pnpm outdated` → nuxt 4.6.0, knip 6.40.0, better-sqlite3 13.0.3, typescript 7.0.2
- Build `.output/` + server dijalankan → `/sitemap.xml` 35 URL (0 tag), `wc -c public/downloads/*` = 2069/1941/1618, tidak ada `.output/public/index.html` dan `.output/public/blog/tag/`

**Dokumen resmi library**

- Nuxt Content, pencarian teks penuh `useSearchCollection` (FTS5, nol dependensi): https://content.nuxt.com/docs/advanced/fulltext-search
- Nuxt, halaman error kustom `app/error.vue`: https://nuxt.com/docs/4.x/directory-structure/app/error
- Nuxt Sitemap, `zeroRuntime`, hook `sitemap:input`: https://nuxtseo.com/sitemap/guides/zero-runtime

---

## Yang tidak bisa diakses / celah cakupan

- **Definisi workflow CI eksternal** `sxzz/workflows/.../unit-test.yml` tidak dibaca, persisnya langkah CI di GitHub belum diverifikasi.
- **Nilai `.env`** tidak dibaca (berisi rahasia); hanya nama kunci yang dicatat. Jadi kesiapan Studio OAuth di produksi masih **perlu verifikasi**.
- **Data produksi** (analytics, Search Console, jumlah pengunjung) tidak ada di repo, estimasi dampak berbasis kode, bukan data trafik nyata.
- Diff lengkap PR #24/#25 tidak dibaca; hanya judul/status.
- Semua issue sudah tertutup, jadi tidak ada catatan "kebutuhan pengguna" untuk dirujuk, ide di tabel prioritas sebagian besar adalah **inferensi** dari `PRODUCT.md` + struktur kode.

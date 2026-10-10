# Riset: Fitur & Bagian yang Bisa Dikembangkan

Riset untuk project **course-ngoprekonline / Ngoprek.Online**, blog tutorial berbahasa Indonesia yang dibangun dengan Nuxt 4 + Nuxt Content + UnoCSS, tiap artikel bisa punya file unduhan.

**Cara riset.** Semua temuan dicek langsung ke sumber aslinya: kode program di repo ini, dokumen repo (`README.md`, `PRODUCT.md`, `DESIGN.md`, `docs/adr/*`), issue di GitHub, hasil menjalankan test/build lokal, dan dokumen resmi library (bukan tulisan orang ketiga). **Re-verifikasi penutupan: 10 Okt 2026** (test suite, sitemap hasil build, perilaku halaman tag, `pnpm outdated`).

**Cara membaca label:**

- **[PRIMER]**: fakta langsung dari kode/dokumen repo (dilengkapi `file:baris`).
- **[UKUR]**: angka yang saya hitung sendiri di repo/build ini (misal jumlah URL sitemap, ukuran file).
- **[INFERENSI]**: kesimpulan/saran saya, bukan pernyataan langsung dari repo.

---

## Ringkasan (versi singkat)

Diperbarui **10 Okt 2026**. Riset awal (Sep 2026) memuat 30+ temuan; **mayoritas sudah ditutup** lewat PR #30–#35. Status per temuan ditandai di tabel masing-masing; daftar lengkap yang ditutup beserta buktinya ada di bagian [Temuan yang sudah ditutup](#temuan-yang-sudah-ditutup).

1. **Yang masih terbuka:** konten (26 post demo, resource baru cuma 6/31 artikel), penghitung unduhan & halaman daftar resource, halaman tag tak dikenal masih 200, `?page=N` belum masuk sitemap, preview draft bertoken di produksi, dependensi usang, cakupan knip, status `nitropack`, review ADR Studio OAuth, automasi redeploy.
2. **Test sehat:** 39 file / 165 test lulus (per 10 Okt 2026), termasuk invariant ukuran file, aksesibilitas axe, robots.txt, ZIP unduhan, dan smoke build-and-serve di CI.
3. **Sitemap:** 81 URL, termasuk **45 URL halaman tag**; masih 0 URL `?page=N`.

**Status issue di GitHub:** tidak ada issue terbuka; temuan yang masih terbuka di bawah ini **belum dicatat sebagai issue**.

---

## Temuan per area

### A. Fitur unduhan resource (inti "Edutorial Blog Download")

| # | Temuan | Jenis |
| --- | --- | --- |
| A3 | Artikel yang punya file unduhan **cuma 6 dari 31** (naik dari 2). Resource adalah pembeda produk (`PRODUCT.md:15,19`); kesenjangan ini pekerjaan editorial, bukan kode. | [UKUR] |
| A4 | Sisa dari paket unduhan: belum ada **penghitung jumlah unduhan** maupun **halaman daftar semua resource**. ("Unduh semua" ZIP dan tautan PPD sudah ada, lihat bagian ditutup.) | [PRIMER] + [INFERENSI] |

**Saran area A:** (1) tambah artikel ber-resource (diferensiasi produk); (2) pertimbangkan penghitung unduhan (perlu storage/DB → keputusan ADR); (3) halaman daftar resource.

### B. Penemuan konten & SEO

| # | Temuan | Jenis |
| --- | --- | --- |
| B12 | Halaman `/?page=N` (N≥2) tidak masuk sitemap (verifikasi 10 Okt 2026: 0 URL `?page=`). Homepage tidak di-prerender, jadi arsip berpaginasi tidak terindeks. | [UKUR] + [INFERENSI] |

### C. Navigasi & halaman konten

| # | Temuan | Jenis |
| --- | --- | --- |
| B/C2 | Halaman tag menerima **semua teks tag apa pun** dengan status 200 (bukan 404) (`tag/[tag].vue`, tidak ada `createError`), berbeda dengan kategori yang menghasilkan 404 untuk slug tak dikenal. Berisiko dianggap "halaman kosong" oleh mesin pencari. | [PRIMER] + [INFERENSI] |
| C4 | Tidak ada halaman About/Kontak/Daftar tag, **ini disengaja**: spec redesain memutuskan "Tanpa halaman baru" (issue #12, keputusan 1). Ini backlog sadar, bukan kelupaan. | [PRIMER] |
| C5 | Preview draft hanya bisa di mode development (`usePublishedPosts.ts:18`); di produksi draft selalu 404 dan belum ada cara preview bertoken untuk editor. | [PRIMER] + [INFERENSI] |

### D. Aksesibilitas & UX

| # | Temuan | Jenis |
| --- | --- | --- |
| D3 | **Yang sudah bagus (jangan dirobohkan):** focus ring global (`uno.config.ts:137-140`), penghormatan `prefers-reduced-motion` (`uno.config.ts:110-116`), `aria-label` di nav header/footer/pagination, `aria-current` di pagination, kontras warna terdokumentasi di `DESIGN.md:144-166`. Test axe (`app/pages/blog/a11y.test.ts`) kini jalan di CI. | [PRIMER] |
| D5 | Belum ada dark mode; ini **keputusan sadar** ("light-only dulu", issue #12 keputusan 5; `DESIGN.md:127,168`). | [PRIMER] |

### E. Kualitas konten, test, dan tooling

| # | Temuan | Jenis |
| --- | --- | --- |
| E3 | Sisa celah test: **belum ada test untuk sitemap** (bytes, robots, unduhan ZIP, dan a11y kini sudah ada). | [PRIMER] |
| E4 | Konten demo masih penuh: **26 post** masih ber-komentar `<!-- demo post (spec #12): boleh dihapus massal -->`. Mengganti dengan konten nyata adalah pekerjaan produk yang tersisa. | [UKUR] |
| E5 | Dependensi usang (per 10 Okt 2026): `nuxt 4.5.2 → 4.6.0`, `knip 6.39.0 → 6.41.0`, `happy-dom 20.14.5 → 20.14.6`; yang major/berisiko: `better-sqlite3 13`, `typescript 7`. | [UKUR] |
| E6 | `knip.json` hanya memeriksa `app/**` + `shared/**` (`knip.json:2-3`), jadi `server/**` dan `scripts/**` tidak dicek ketidakpakaiannya. | [PRIMER] + [INFERENSI] |
| E7 | `nitropack` dideklarasikan di catalog dev (`package.json:46`) padahal dipakai di kode runtime (`server/routes/rss.xml.ts:3`). Status dependensinya menyesatkan. | [PRIMER] + [INFERENSI] |

### F. Dokumentasi & ADR (janji tertunda / tidak sinkron)

| # | Temuan | Jenis |
| --- | --- | --- |
| F3 | ADR tertunda: Studio production OAuth "deferred until a deployment exists" (`docs/adr/0001:15`), deployment sudah ada (Docker/VPS), jadi keputusan ini sudah waktunya ditinjau ulang. | [PRIMER] |
| F4 | ADR menandai masa depan eksplisit: komentar/DB (`docs/adr/0001:16`), fitur dinamis (`docs/adr/0002:3`), kategori berjenjang (`docs/adr/0003:17`), semuanya "putuskan lagi bila ada kebutuhan nyata". | [PRIMER] |
| F5 | `README` menunda otomatisasi redeploy VPS ("automate with cron or CI if desired"), mekanisme itu belum ada di repo (tidak ada `workflow_dispatch`/cron di `.github/workflows/`). | [PRIMER] + [INFERENSI] |

---

## Temuan yang sudah ditutup

Ditutup lewat PR #30–#35 (Okt 2026); diverifikasi ulang 10 Okt 2026.

| # | Temuan (ringkas) | Bukti penutupan |
| --- | --- | --- |
| A1, A2, A5 | Ukuran file (`bytes`) salah + tanpa test → kini diverifikasi otomatis | `content/resources-invariant.test.ts` (bytes wajib = ukuran file asli) |
| A4 (sebagian) | "Unduh semua" ZIP + resource eksternal PPD | `shared/utils/packageZip.ts`, `server/routes/downloads/[slug].zip.ts`, `SpecPlate.vue`, PR #34, #35 |
| B1, B2, B3 | Tag tersembunyi → tertaut di halaman artikel & masuk sitemap | `blog/[slug].vue` (tautan tag), sitemap kini 45 URL tag |
| B4 | RSS tidak diumumkan | `<link rel="alternate">` di `nuxt.config.ts` |
| B5 | `robots.txt` tanpa sitemap | `server/routes/robots.txt.ts` + test |
| B6 | `og:image` tidak pernah terkirim | `public/images/og-default.png`, `app.vue`, `articleJsonLd.ts` |
| B7 | Tanpa JSON-LD / `titleTemplate` | `app/utils/articleJsonLd.ts`, `app.vue:13` |
| B8 | `<html>` tanpa `lang` | `nuxt.config.ts` → `htmlAttrs: { lang: 'id' }` |
| B9 | Halaman error bahasa Inggris | `app/error.vue` ("Halaman tidak ditemukan") |
| B10 | Homepage SSR tanpa cache | `routeRules` `/` → `swr: 3600` |
| B11 | Sitemap belum `zeroRuntime` | `nuxt.config.ts` → `sitemap.zeroRuntime: true` |
| C1 | `/blog` tanpa pagination | `blog/index.vue` memakai `paginate()` |
| C3 | Tanpa artikel terkait | `app/utils/relatedPosts.ts` + seksi terkait di `[slug].vue` |
| D1 | Slider tanpa aksesibilitas keyboard | `PostSlider.vue`: `tabindex`, `aria-label`, tombol prev/next |
| D2 | Shortcut `no-scrollbar` rusak | `uno.config.ts:77` (`[scrollbar-width:none]`); warning test hilang |
| D4 | Tanpa audit aksesibilitas di CI | `app/pages/blog/a11y.test.ts` (axe-core) jalan di CI |
| E1 | Test suite | 39 file / 165 test lulus (10 Okt 2026) |
| E2 | Klaim smoke test tak terbukti | Job `smoke` di `.github/workflows/ci.yml` (build + serve + assert route) |
| E3 (sebagian) | Test bytes/robots/unduhan/a11y kini ada | lihat A1/A2, `robots.txt.test.ts`, `packageZip.test.ts` |
| F1, F2 | README/PRODUCT tidak sinkron | sudah diperbarui (tidak ada lagi klaim keliru) |
| pencarian | Pencarian teks penuh | `/cari` + `useBlogSearch.ts` (`useSearchCollection`) |

---

## Tabel prioritas (yang masih terbuka: dampak vs usaha)

Dampak: **T** tinggi, **S** sedang, **R** rendah · Usaha: **R** rendah, **S** sedang, **T** tinggi.

| Prioritas | Temuan | Dampak | Usaha | Catatan singkat |
| --- | --- | --- | --- | --- |
| 1 | E4, ganti 26 post demo dengan konten nyata | T | T | Pekerjaan editorial, bukan kode |
| 2 | A3, lebih banyak artikel ber-resource (6/31 kini) | T | S | Ini diferensiasi produk |
| 3 | A4 sisa, penghitung unduhan + halaman daftar resource | S | S | Penghitung perlu storage/ADR |
| 4 | C5, preview draft bertoken di produksi | S | S | Alur editor; sekarang hanya bisa di dev |
| 5 | E5, naikkan Nuxt 4.6 / knip / happy-dom (kecil), tunda TS 7 | R | R | Rutin; TS 7 & better-sqlite3 13 = major berisiko |
| 6 | B/C2, 404 untuk tag tak dikenal | S | R | Samakan dengan perilaku kategori |
| 7 | B12, masukkan `?page=N` ke sitemap | S | S | Via hook `sitemap:input` / `zeroRuntime` |
| 8 | E6, cakupan knip `server/**` + `scripts/**` | R | R | Satu baris `knip.json` |
| 9 | E7, pindahkan `nitropack` ke status dependency yang benar | R | R | Dipakai di runtime route |
| 10 | F3, review ADR 0001 (Studio OAuth produksi) | S | S | Deployment sudah ada |
| 11 | F5, automasi redeploy VPS (cron/CI) | S | S | Diunda di README |
| 12 | E3 sisa, test sitemap | R | R | Bytes/robots/sudah ada |
| 13 | C4, halaman About/Kontak/Daftar tag | S | S | Backlog sadar (issue #12) |
| 14 | D5, dark mode | R | T | Ditunda sadar (issue #12) |

---

## Sumber

**Dokumen repo**

- `README.md` (:33-126), `PRODUCT.md` (:11,15,19,25,29-34,40,45-46,59), `CONTEXT.md`, `DESIGN.md` (:119-298), `AGENTS.md`
- `docs/adr/0001-nuxt-content-and-nuxt-studio-for-content-management.md`, `docs/adr/0002-ssr-with-platform-neutral-deployment.md`, `docs/adr/0003-curated-categories-as-content-coexisting-with-tags.md`, `docs/adr/0004-resource-eksternal-via-tautan-ppd.md`
- `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, `docs/agents/domain.md`

**Kode**

- `nuxt.config.ts`, `content.config.ts`, `uno.config.ts`, `package.json`, `knip.json`, `vitest.config.ts`
- `app/pages/index.vue`, `app/pages/blog/index.vue`, `app/pages/blog/[slug].vue`, `app/pages/blog/tag/[tag].vue`, `app/pages/blog/category/[category].vue`, `app/error.vue`
- `app/components/{SpecPlate,PostCard,PostSlider,HeroSection,SiteHeader,SiteFooter}.vue`
- `app/composables/{usePublishedPosts,useBlogSearch}.ts`, `app/utils/{pagination,relatedPosts,articleJsonLd,packageZip}.ts`
- `server/routes/rss.xml.ts`, `server/routes/robots.txt.ts`, `server/routes/downloads/[slug].zip.ts`
- `content/resources-invariant.test.ts`, `content/category-invariant.test.ts`, `content/blog/*.md`, `public/downloads/*`
- `app/pages/blog/a11y.test.ts`, `.github/workflows/ci.yml`, `docker-compose.yml`, `scripts/setup-studio.sh`

**Issue tracker (GitHub, via `gh`)**

- `gh issue list --state open` → kosong (10 Okt 2026)
- Issue #5–#10 dan #12–#35 (semuanya CLOSED/MERGED)

**Pengukuran lokal (10 Okt 2026)**

- `pnpm test --run` → **39 file, 165 test lulus**, tanpa warning `unmatched utility`
- `pnpm outdated` → nuxt 4.6.0, knip 6.41.0, happy-dom 20.14.6, better-sqlite3 13.0.3, typescript 7.0.2
- Build `.output/` → `/sitemap.xml` **81 URL (45 di antaranya tag, 0 `?page=`)**; unduhan lokal di `public/downloads/` diverifikasi invariant test

**Dokumen resmi library**

- Nuxt Content, pencarian teks penuh `useSearchCollection` (FTS5, nol dependensi): https://content.nuxt.com/docs/advanced/fulltext-search
- Nuxt, halaman error kustom `app/error.vue`: https://nuxt.com/docs/4.x/directory-structure/app/error
- Nuxt Sitemap, `zeroRuntime`, hook `sitemap:input`: https://nuxtseo.com/sitemap/guides/zero-runtime

---

## Yang tidak bisa diakses / celah cakupan

- **Definisi workflow CI eksternal** `sxzz/workflows/.../unit-test.yml` tidak dibaca, persisnya langkah CI di GitHub belum diverifikasi.
- **Nilai `.env`** tidak dibaca (berisi rahasia); hanya nama kunci yang dicatat. Jadi kesiapan Studio OAuth di produksi masih **perlu verifikasi**.
- **Data produksi** (analytics, Search Console, jumlah pengunjung) tidak ada di repo, estimasi dampak berbasis kode, bukan data trafik nyata.
- Diff lengkap PR #26–#35 tidak dibaca; hanya judul/status (cukup untuk menandai temuan ditutup, bukan untuk audit regresi).
- Semua issue sudah tertutup, jadi tidak ada catatan "kebutuhan pengguna" untuk dirujuk, ide di tabel prioritas sebagian besar adalah **inferensi** dari `PRODUCT.md` + struktur kode.

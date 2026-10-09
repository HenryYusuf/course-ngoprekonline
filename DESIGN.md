---
name: Ngoprek.Online
description: EDUTORIAL BLOG DOWNLOAD. Tutorial Indonesia dikemas sebagai paket dengan plat spesifikasi dan berkas unduhan.
colors:
  background: "#FBFAF6"
  foreground: "#17181C"
  card: "#FFFFFF"
  border: "#DEDDD7"
  muted: "#F1EFE8"
  muted-foreground: "#56575C"
  accent: "#FFEDE4"
  surface-low: "#F3F1EA"
  primary: "#FF4D14"
  primary-foreground: "#17181C"
  primary-deep: "#C23A0A"
  plate: "#17181C"
  plate-fg: "#FBFAF6"
  plate-muted: "#9A9B9E"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.4rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.06em"
  spec-value:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
    fontFeature: "tnum"
rounded:
  none: "0px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  "2xl": "32px"
  "3xl": "40px"
  "4xl": "48px"
components:
  button-signal:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
  button-signal-hover:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
  button-ghost-hover:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background}"
  stamp:
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
  spec-plate:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.plate-fg}"
    rounded: "{rounded.none}"
  card-post:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.none}"
  chip-category:
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "2px 6px"
  category-panel:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.none}"
  site-header:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.none}"
  utility-strip:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.plate-fg}"
    rounded: "{rounded.none}"
---

# Design System: Ngoprek.Online (Kemasan Spesifikasi)

## Overview

**Creative North Star: "Kemasan Spesifikasi"**

Setiap tutorial diperlakukan sebagai satu paket produk: sampul menjanjikan, plat spesifikasi menyebut fakta (kategori, waktu baca, tanggal, jumlah file, ukuran), isinya boleh diambil. Dunia visualnya adalah karton berlapis bersih dan label perangkat elektronik: bone ground, tinta hitam, hairline print, stempel versi, barcode; bukan blog motivasi. Yang dijual adalah kejujuran mekanisme: angka dan label nyata, bukan janji pemasaran.

Sistem ini restrained: netral bone/ink dengan **satu** sinyal oranye keselamatan (`#FF4D14`) yang berani hanya sebagai bidang (tombol, penanda kotak kecil, blok plat gelap). Ground terang (light-only) karena situs ini dibaca di layar kerja; satu-satunya bidang gelap adalah plat spesifikasi yang memang meniru label cetak hitam. Kedalaman tidak pernah pakai bayangan: semua pemisah permukaan adalah hairline 1px dan pergantian tone.

Tipografi dua suara: Archivo (grotesque, 400–800, self-hosted) untuk nama produk dan teks baca; IBM Plex Mono untuk semua label kaps, nilai spesifikasi, dan metadata. Sudut siku-siku di mana-mana seperti lipatan karton (radius 0 di seluruh skala). Ikon berupa line-art SVG inline 1.5px; tidak ada ikon glyph, tidak ada emoji.

**Key Characteristics:**
- Bone `#FBFAF6` + ink `#17181C` + satu sinyal `#FF4D14` (tekstil oranye kecil = `#C23A0A`)
- Plat spesifikasi gelap sebagai komponen tanda tangan di setiap halaman paket
- Radius 0 di seluruh skala; pemisah hanya hairline 1px (tanpa shadow sama sekali)
- Semua metadata dalam IBM Plex Mono uppercase 11px / tracking 0.06em
- Sampul kartu selalu beridentitas: foto asli ATAU monogram + barcode deterministik dari slug
- Angka nyata yang dihitung dari konten (`readingMinutes`, `formatBytes`), termasuk empty state yang jujur

## Colors

Palet restrained: dua netral bone/ink, satu aksen oranye keselamatan, satu keluarga plat gelap untuk bidang label.

### Primary
- **Signal Orange** (`#FF4D14`): satu-satunya aksen. Muncul sebagai *bidang*: isian tombol `BACA PAKET`, kotak penanda 8–14px di wordmark/strip/stempel, garis kiri blockquote, panah unduhan di atas plat gelap, outline focus. Tidak pernah sebagai teks kecil di atas bone.
- **Signal Ink** (`#17181C` / `primary-foreground`): teks di atas isian oranye, dengan kontras safety-label 5.4:1, dipakai khusus di `btn-signal`.
- **Deep Signal** (`#C23A0A`): oranye untuk teks kecil di atas ground terang (tautan `BACA`, `Lihat semua`, judul saat hover, link prose, caret), kontras 4.8:1+.

### Neutral
- **Bone** (`#FBFAF6` / `background`): ground seluruh situs; juga menjadi teks di atas plat gelap (`plate-fg`).
- **Ink** (`#17181C` / `foreground`): seluruh teks utama, border kuat, tombol hover yang membalik ke gelap.
- **Paper White** (`#FFFFFF` / `card`): isi kartu, panel rak, permukaan kartu naik satu langkah dari bone.
- **Hairline** (`#DEDDD7` / `border`): divider internal: footer strip, header kartu, baris panel, garis meta artikel.
- **Muted Card** (`#F1EFE8` / `muted`): tone abu-abu hangat ringan (area sampul bergambar, basis generik).
- **Muted Ink** (`#56575C` / `muted-foreground`): teks sekunder: deskripsi kartu, nav default, footer.
- **Warm Tint** (`#FFEDE4` / `accent`): latar hover baris panel rak; satu-satunya tempat oranye tampil sebagai wash besar, dan hanya pada state hover.
- **Surface Low** (`#F3F1EA` / `surface-low`): tone rendah: footer, sampul monogram, baris header panel rak, track scrollbar, inline code.

### Plate (label gelap)
- **Plate Ink** (`#17181C` / `plate`): latar plat spesifikasi, strip utilitas atas, blok kode `pre`.
- **Plate Bone** (`#FBFAF6` / `plate-fg`): teks utama di atas plat.
- **Plate Gray** (`#9A9B9E` / `plate-muted`): label baris spesifikasi dan keterangan file di plat, dengan kontras ~6.5:1 di atas plate.

### Named Rules
**The Safety-Label Rule.** Oranye hanya dua bentuk: bidang (fill/mark), atau teks khusus di atas plat gelap. Di atas ground terang, teks oranye selalu `#C23A0A`, tidak pernah `#FF4D14`. Teks di atas isian oranye selalu ink `#17181C` (5.4:1), tidak pernah putih.

**The One-Signal Rule.** Tidak ada warna aksen kedua, tidak ada gradien, tidak ada warna status (hijau/merah/biru). Seluruh hierarki diselesaikan oleh bone, ink, dan hairline; oranye tetap satu sinyal keselamatan yang langka.

**The Light-Only Rule.** Sistem ini terang-saja: ground bone, teks ink. Satu-satunya bidang gelap adalah plat spesifikasi dan strip utilitas; gelap dipakai sebagai *label*, bukan sebagai tema.

## Typography

**Display Font:** Archivo (variable 400–800, self-hosted woff2, dengan fallback `ui-sans-serif, system-ui, sans-serif`)
**Body Font:** Archivo (satu keluarga untuk display dan body)
**Label/Mono Font:** IBM Plex Mono (400/500/600, self-hosted; fallback `ui-monospace, SFMono-Regular, monospace`)

**Character:** Pasangan grotesque + mono yang terasa seperti kemasan industri: Archivo bertumpu pada weight 700/800 dengan tracking negatif untuk nama "produk", IBM Plex Mono menurunkan semua metadata ke suara mesin yang tabular dan tercetak. Tidak ada font display dekoratif; karakter datang dari kontras berat, bukan dari ornamen.

### Hierarchy
- **Display** (800, `2.4rem` → `sm` 3rem → `lg` 3.5rem, lh 1.05, tracking −0.03em): judul paket di hero homepage; satu judul per viewport.
- **Headline** (800, base `1.5rem`; h1 artikel `1.875rem` → `lg` 2.75rem, lh 1.15, tracking −0.02em): judul halaman, judul artikel, judul section (`Arsip Lengkap`, `Rak Arsip`, `Keluaran Terbaru`).
- **Title** (700, `1.125rem` → `sm` 1.25rem, lh 1.25, tracking −0.01em): judul kartu pos dan judul baris panel rak.
- **Body** (400, `1.0625rem`, lh 1.75, maks 68ch): isi artikel (`.prose`); deskripsi hero `1.125rem` muted (maks 54ch), deskripsi kartu `0.875rem` (maks 3 baris).
- **Label** (500, mono `11px`, tracking 0.06em, uppercase, lh 1.4): seluruh metadata, nav, tombol, chip, strip utilitas, footer; ringkasnya setiap teks yang "dicetak di kemasan".
- **Spec Value** (500, mono `13px`, tabular-nums): nilai kanan di baris plat spesifikasi.

### Named Rules
**The Mono-Label Rule.** Setiap metadata (tanggal, kategori, ukuran, jumlah file, nav, tombol, pagination) dicetak sebagai label mono uppercase 11px / 0.06em. Tidak ada metadata yang ditulis dengan type body; kalau itu fakta paket, itu label.

**The Product-Name Rule.** Judul paket selalu Archivo 800 dengan tracking negatif (−0.01em s/d −0.03em), diperlakukan sebagai nama produk di kemasan, bukan sebagai headline jurnalistik. Tidak ada italic display, tidak ada underline di judul.

## Layout

**Container:** satu kolom konten `max-w-6xl` (1152px), padding `16px` (mobile) / `24px` (`sm+`). Halaman artikel menyempit ke `max-w-3xl` dengan body dibatasi 68ch.

**Struktur vertikal homepage (urutan keras):** strip utilitas 32px (plat gelap) → masthead sticky → hero 7/5 → **Rak Arsip** (tepat di bawah hero, menyeberangi lipatan 1440×900) → Keluaran Terbaru (slider snap) → Arsip Lengkap (grid + pagination) → footer.

**Grid:**
- Hero: 12 kolom (`lg+`), sampul 7 kolom / plat spesifikasi 5 kolom, gap 32–40px; menumpuk jadi 1 kolom di mobile (teks lalu plat).
- Arsip: 1 kolom → `sm` 2 kolom → `lg` 3 kolom, gap 16px.
- Rak Arsip: 1 kolom → `sm` 2 kolom, gap 24px.
- Slider `Keluaran Terbaru`: scroll-snap horizontal tanpa scrollbar, lebar kartu 85% → `sm` 60% → `md` 45% → `lg` 32%, gap 16px, bleed ke tepi viewport (margin negatif + padding kontainer).

**Ritme spasi:** kartu dan panel memakai padding dalam 20px; baris daftar 16–24px vertikal; antar-section 40–48px; header/footer bar 12–14px. Jarak antar-unit mengikuti langkah `8 / 12 / 16 / 20 / 24 / 32 / 40 / 48`.

**Breakpoint:** `sm` 640px, `md` 768px, `lg` 1024px (default UnoCSS). Header sticky `top-0` setinggi ±56px di bawah strip 32px; nav kategori dan RSS hanya tampil `sm+`.

## Elevation & Depth

**Tidak ada bayangan sama sekali**: tidak ada `box-shadow` di seluruh codebase. Kedalaman dinyatakan sekali: **hairline**. Permukaan dipisahkan oleh border 1px dan selisih tone (bone → paper white → surface-low → plate gelap), dengan plat spesifikasi sebagai "lapisan paling dalam" yang membalik sepenuhnya ke gelap.

### Shadow Vocabulary
- *(none; sistem ini datar. Lihat Named Rules.)*

### Named Rules
**The Border-Only Rule.** Setiap pemisah permukaan adalah border 1px: kartu `rgba(23,24,28,0.20)` yang menguat ke ink penuh saat hover; divider internal `#DEDDD7`; header/footer `rgba(23,24,28,0.15)`; baris dalam plat `rgba(154,155,158,0.25–0.40)`; kontrol mati `rgba(23,24,28,0.20)` + opacity 0.5. Tidak ada shadow yang boleh ditambahkan untuk mengangkat kartu; angkat dengan tone dan border.

**The Focus Ring Rule.** Setiap elemen interaktif: `outline: 2px solid #FF4D14; outline-offset: 2px` pada `:focus-visible`; satu-satunya oranye yang boleh muncul sebagai garis, dan cukup kontras (3:1+) sebagai indikator non-teks.

## Shapes

Radius nol di seluruh sistem: seluruh langkah `borderRadius` di tema (`DEFAULT` sampai `full`) bernilai `0px`, jadi bahkan kelas `rounded-lg` pada embed video ikut siku: lipatan karton, bukan pil. Chip, tombol, kartu, plat, pagination, kode semuanya persegi.

Siluet berulang: **kotak oranye kecil** (8px di stempel & panel, 10px di kepala plat, 14px berbingkai ink di wordmark) sebagai tanda "segel produk"; border 1px sebagai satu-satunya bingkai; clipping memakai rasio aspek tetap: sampul kartu `16:10`, media artikel `16:9`.

**The Carton-Fold Rule.** Sudut selalu siku (`0px`): tidak ada pill, tidak ada rounded-2xl, tidak ada `border-radius` bertingkat. Bentuk dipotong, bukan dibulatkan.

## Components

Bahasa kontrol: tombol = label stensil, chip = stempel, input = kotak pencarian (satu-satunya form di situs ini), kartu = paket bersampul + strip spesifikasi di kaki, plat = label hitam belakang kemasan.

### Utility Strip (strip utilitas)
- **Shape:** full-bleed, tinggi 32px, border-b ink.
- **Color:** latar `plate` (`#17181C`), teks `plate-fg`, satu kotak oranye 8px di item tengah.
- **Content:** mono-label `EDUTORIAL BLOG DOWNLOAD` · `SUMBER DAYA GRATIS` (≥`sm`) · `EDISI {tahun}`.

### Masthead (SiteHeader)
- **Shape:** sticky `top-0`, `z-40`, border-b `rgba(23,24,28,0.15)`, latar `background/95` + `backdrop-blur-sm`, kontainer `max-w-6xl`, padding vertikal 14px.
- **Wordmark:** kotak oranye 14px berbingkai ink (rotate 45° saat hover, 300ms) + `Ngoprek.Online` Archivo 800 `17px` tracking −0.02em.
- **Nav:** mono-label `muted-foreground` → `foreground` saat hover; item: `Blog`, `RSS`, per kategori (≥`sm`).
- **Pencarian:** form `role=search` terlihat di kedua breakpoint: input `type=search` (`Kata kunci…`, `name=q`) + tombol `Cari` compact (`px-3 py-1.5`, border ink, hover balik ink/bone); submit → `/cari` membawa `?q=` (SPA `router.push`, fallback native `action="/cari"`).

### Buttons
- **Shape:** radius 0, border 1px ink, padding `12px 20px`, inline-flex gap 8px, mono-label teks.
- **Primary (`btn-signal`):** latar `#FF4D14`, teks `#17181C`; hover membalik ke latar ink / teks bone (200ms). Dipakai untuk CTA paket: `BACA PAKET` (dengan panah SVG 14px), `LIHAT ARSIP`.
- **Secondary (`btn-ghost`):** transparan, teks ink; hover membalik identik (latar ink / teks bone). Dipakai untuk `LIHAT ISI`.
- **Focus:** outline oranye 2px, offset 2px.

### Stamp Badge
- **Shape:** `inline-flex`, border 1px ink, padding `4px 8px`, mono-label, diikuti kotak oranye 8px.
- **Usage:** badge kategori di hero (`Paket terbaru · Tutorial`), chip filter kategori di `/blog` (hover: membalik ke latar ink / teks bone). Ini juga bentuk dasar chip kategori di kartu (border `rgba(23,24,28,0.30)`, padding `2px 6px`).

### Spec Plate (plat spesifikasi, signature)
- **Shape:** border 1px ink, latar `plate`, teks `plate-fg`; kepala `SPESIFIKASI PAKET` + kotak oranye 10px, dipisah hairline `plate-muted/40`.
- **Rows:** lima baris fakta (`KATEGORI / WAKTU BACA / TERBIT / FILE / UKURAN`): dt mono-label `plate-muted`, dd `13px` medium tabular rata kanan, dipisah `border-t plate-muted/25`, tanpa border di baris pertama.
- **Motion:** baris masuk berurutan `plate-row-in 560ms both`, jeda 55ms per baris, easing `cubic-bezier(0.16, 1, 0.3, 1)` (translasi 6px ke atas).
- **Isi Unduhan:** daftar tautan unduh: judul file + `FORMAT · UKURAN` mono-label, panah unduhan oranye (16px) yang turun 2px saat hover; pemisah `divide plate-muted/25`.
- **Empty state (jujur):** `Paket ini belum menyertakan berkas unduhan…`: pesan teks `plate-muted`, tidak ada tombol yang berpura-pura ada file.

### Post Card (kartu paket)
- **Shape:** border 1px `rgba(23,24,28,0.20)` → ink penuh saat hover (200ms), latar `card`; seluruh kartu adalah **satu** anchor (chip kategori dirender sebagai teks, bukan link).
- **Cover 16:10:** gambar asli (lazy, zoom `scale 1.03` / 500ms saat hover) ATAU fallback monogram: inisial Archivo 800 `60px` warna `foreground/15` + barcode SVG deterministik dari hash slug (`foreground/35`, 26 bar, lebar 1–3px). Tidak ada gambar dari dunia lain.
- **Body (padding 20px):** meta mono-label (tanggal + chip kategori), judul Title (hover → `#C23A0A`), deskripsi 3 baris muted.
- **Footer strip:** `border-t #DEDDD7`, padding `14px 20px`. Kiri: `N menit baca · N file · ukuran` (mono-label, dihitung dari frontmatter `resources`); kanan: `BACA` + panah `#C23A0A` (geser 4px saat hover, 300ms).

### Category Panels (Rak Arsip)
- **Shape:** border 1px `rgba(23,24,28,0.20)`, latar `card`; kepala `RAK · {KATEGORI}` mono-label di atas `surface-low` dengan hairline bawah + kotak oranye 8px.
- **Rows:** padding `16px 20px`, hairline pemisah, hover latar `#FFEDE4` dan judul → `#C23A0A` + panah geser; footer `Lihat semua` mono-label `#C23A0A` → ink saat hover.

### Navigation (pagination)
- **Shape:** kotak `24px`-class border 1px `rgba(23,24,28,0.25)`, mono-label; aktif = latar ink / teks bone (`aria-current`); hover membalik ke ink; mati = `rgba(...,0.20)` + opacity 0.5. Elemen `…` tanpa border.

### Footer
- **Shape:** latar `surface-low`, border-t `rgba(23,24,28,0.15)`; wordmark + deskripsi; nav mono-label.
- **Bottom bar:** hairline atas, dengan `© {tahun} NGOPREK.ONLINE // ALL RIGHTS RESERVED` di kiri dan `EDISI {tahun}` + kotak oranye di kanan.

### Article Body (prose)
- `.prose.prose` (spesifikasi ganda untuk mengalahkan preset): lebar maks 68ch, `17px`/1.75; heading Archivo 800 tracking −0.02em lh 1.15; tautan `#C23A0A` underline 1px/offset 3px (hover 2px); inline code mono `0.875em` di atas `surface-low` + hairline; blok kode `pre` = plat gelap berbingkai ink; gambar berbingkai hairline; blockquote garis kiri 2px `#FF4D14` tanpa italic; tabel `tabular-nums` dengan `th` mono uppercase.

## Do's and Don'ts

### Do:
- **Do** jaga semua sudut siku: `0px` di seluruh skala radius; tombol, chip, kartu, plat, pagination semuanya persegi.
- **Do** cetak semua metadata sebagai label mono: IBM Plex Mono 11px, uppercase, tracking 0.06em (tanggal, ukuran, nav, tombol).
- **Do** pakai oranye hanya sebagai bidang/mark di ground terang; teks oranye kecil selalu `#C23A0A`, dan teks di atas isian oranye selalu ink `#17181C` (5.4:1).
- **Do** pisahkan permukaan dengan hairline 1px: border `foreground/20` untuk kartu, `#DEDDD7` untuk divider, `plate-muted/25–40` di dalam plat.
- **Do** tampilkan angka nyata dari konten (menit baca, jumlah file, byte yang diformat `formatBytes`) dan, saat kosong, tulis empty state yang jujur.
- **Do** beri setiap paket identitas cetak: cover asli ATAU monogram inisial + barcode deterministik dari slug.
- **Do** animasikan hanya baris plat (`plate-row-in 560ms`, stagger 55ms) dan state hover 200–300ms; hormati guard `prefers-reduced-motion`.
- **Do** simpan article body di dalam `.prose` (68ch, 17px/1.75) dengan heading Archivo 800.

### Don't:
- **Don't** tambahkan `box-shadow` atau gradient; kedalaman hanya dari border 1px dan selisih tone.
- **Don't** perkenalkan aksen kedua, warna status, atau tema gelap; sistem ini light-only, gelap hanya untuk plat label dan strip utilitas.
- **Don't** tulis teks `#FF4D14` di atas bone karena kontrasnya tidak cukup; gunakan `#C23A0A`.
- **Don't** membulatkan sudut (tidak ada pill/`rounded-*`; bahkan `rounded-lg` pada embed ikut siku karena token radius semua `0px`).
- **Don't** pakai glyph icon atau emoji; ikon hanya line-art SVG inline (stroke 1.5, 13–16px).
- **Don't** bawa font lain (DM Sans, Syne, Space Mono sudah dihapus); Archivo + IBM Plex Mono saja.
- **Don't** mulai halaman dengan hero motivasi + grid kartu netral: yang tampil pertama adalah mekanisme produk (sampul + plat spesifikasi + fakta).
- **Don't** meniru sampul dari luar dunia ini atau mengarang klaim pemasaran di metadata; label hanya boleh menyebut fakta yang dihitung dari konten.

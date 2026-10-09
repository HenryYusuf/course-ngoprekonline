/**
 * Template Apps Script untuk laporan mingguan Google Sheets.
 *
 * Cara pakai:
 * 1. Buka spreadsheet → Extensions → Apps Script.
 * 2. Ganti isi Code.gs dengan berkas ini.
 * 3. Sesuaikan KONFIG di bawah.
 * 4. Jalankan `kirimLaporanMingguan` sekali untuk memberi izin.
 * 5. Add trigger mingguan (Triggers → Add trigger) pada fungsi yang sama.
 */

const KONFIG = {
  // Nama sheet berisi data penjualan (harus ada kolom tanggal & total).
  SHEET_DATA: 'penjualan',
  // Alamat tujuan laporan.
  EMAIL_KE: 'tim@contoh.com',
  // Jam kirim (0-23). Dipakai saat dipasang sebagai trigger.
  JAM_KIRIM: 8,
}

/** Hitung total penjualan 7 hari terakhir. */
function totalMingguIni() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(KONFIG.SHEET_DATA)
  if (!sheet) {
    throw new Error(`Sheet "${KONFIG.SHEET_DATA}" tidak ditemukan.`)
  }

  const nilai = sheet.getDataRange().getValues()
  const sekarang = new Date()
  const batas = new Date(sekarang.getTime() - 7 * 24 * 60 * 60 * 1000)

  let total = 0
  for (let i = 1; i < nilai.length; i++) {
    const tanggal = new Date(nilai[i][0])
    const jumlah = Number(nilai[i][1]) || 0
    if (tanggal >= batas && tanggal <= sekarang) {
      total += jumlah
    }
  }
  return total
}

/** Susun ringkasan dan kirim via email. */
function kirimLaporanMingguan() {
  const total = totalMingguIni()
  const subjek = `Laporan mingguan ${Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd-MM-yyyy')}`
  const isi = [
    'Halo,',
    '',
    `Total penjualan 7 hari terakhir: Rp${total.toLocaleString('id-ID')}.`,
    '',
    'Salam,',
    'Otomatis dari Apps Script.',
  ].join('\n')

  MailApp.sendEmail(KONFIG.EMAIL_KE, subjek, isi)
}

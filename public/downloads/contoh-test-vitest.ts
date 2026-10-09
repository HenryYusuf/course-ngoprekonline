import { describe, expect, it, vi } from 'vitest'

import { formatRupiah, hitungTotal } from './pesanan'

// Pola yang saya pakai ulang di hampir semua test frontend:
// satu blok `describe` per modul, `it` berbahasa manusia,
// dan arrange -> act -> assert yang jelas.

describe('hitungTotal', () => {
  it('menjumlahkan subtotal tiap item', () => {
    const items = [
      { nama: 'Kopi', harga: 25000, jumlah: 2 },
      { nama: 'Teh', harga: 15000, jumlah: 1 },
    ]

    expect(hitungTotal(items)).toBe(65000)
  })

  it('mengembalikan 0 untuk keranjang kosong', () => {
    expect(hitungTotal([])).toBe(0)
  })
})

describe('formatRupiah', () => {
  it('memisahkan ribuan dengan titik', () => {
    expect(formatRupiah(1500000)).toBe('Rp1.500.000')
  })

  it('memformat angka nol tanpa simbol ganda', () => {
    expect(formatRupiah(0)).toBe('Rp0')
  })
})

// Untuk fungsi yang memanggil API, mock modulnya. Jangan sentuh jaringan.
describe('ambilStatusPembayaran', () => {
  it('mengembalikan status sukses saat API bilang lunas', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ status: 'lunas' })),
    )

    const { ambilStatusPembayaran } = await import('./pembayaran')
    await expect(ambilStatusPembayaran('INV-1')).resolves.toBe('lunas')
  })
})

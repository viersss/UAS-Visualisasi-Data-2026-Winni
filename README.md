# Dari Sumatra hingga Papua: Seberapa Jauh Pendidikan Kita Berbeda?

Web story interaktif (single-page, scroll) tentang ketimpangan pendidikan antarkabupaten/kota di Indonesia, dibangun dengan **React + Vite + D3.js**. Seluruh visualisasi digambar dengan D3.js tanpa pustaka grafik tambahan.

- **Web story:** https://s.stis.ac.id/uasvisdat-winni
- **Repositori kode:** https://s.stis.ac.id/RepoSourceCode_UASVisdat_Winni

> Proyek UAS Visualisasi Data dan Informasi 2026, Politeknik Statistika STIS.
> Winni Elfira, NIM 222313423, 3SD2.

---

## Gambaran Singkat

Web story ini membandingkan **Harapan Lama Sekolah (HLS)** dan **Rata-rata Lama Sekolah (RLS)** pada 514 kabupaten/kota, lalu menempatkannya dalam konteks sosial-ekonomi (kemiskinan, PDRB, pengangguran, kepadatan penduduk) dan pola gabungan wilayah (PCA dan klaster hierarkis).

Alur ceritanya:

| Bagian | Isi | Visual |
|---|---|---|
| **Home** | Judul dan pembuka | Hero dengan foto latar |
| **Pendidikan** | Seberapa berbeda HLS antarwilayah | Peta HLS, histogram (garis 12 tahun), grafik rentang HLS dalam provinsi |
| **Kesenjangan** | Jarak harapan dan capaian (GAP = HLS − RLS) | Peta GAP, batang bertumpuk top-8 GAP |
| **Konteks** | Apa yang beriringan dengan HLS | Scatterplot 5 tab (kemiskinan, P1, PDRB, TPT, kepadatan) |
| **Pola** | Kombinasi karakteristik wilayah | Biplot PCA, heatmap profil klaster, peta klaster |
| **Penutup** | Kesimpulan dan rekomendasi | Kartu bergambar |

## Fitur

- Navbar tetap di atas dengan smooth scroll, menu aktif berubah warna saat scroll, dan progress bar scroll.
- Tooltip pada peta dan grafik, tab indikator pada scatterplot, serta glow berkedip pada wilayah contoh.
- Kotak interpretasi bergaya glassmorphism berdampingan dengan visual (selang-seling kiri dan kanan).
- Semua teks angka (rentang HLS, jumlah wilayah di bawah 12 tahun, korelasi, profil klaster) dihitung otomatis dari data, bukan ditulis manual.
- Responsif: SVG dengan `viewBox` dan `ResizeObserver`, satu kolom di bawah 900 px.

## Teknologi

- React 18, Vite 5, D3.js 7
- JavaScript dan CSS biasa (tanpa Tailwind dan tanpa pustaka grafik lain)
- Font Poppins (Google Fonts)

## Struktur Folder

```
.
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── data/indonesia.geojson     # data gabungan (514 fitur)
│   └── images/                    # foto: a ... i
└── src/
    ├── main.jsx
    ├── App.jsx                    # susunan bagian + teks interpretasi
    ├── config.js                  # nama field data, warna klaster, ekstensi foto
    ├── hooks.js                   # useSize, useGeo, useChart
    ├── stats.js                   # perhitungan statistik untuk teks otomatis
    ├── index.css                  # seluruh gaya
    └── components/
        ├── Navbar.jsx / ProgressBar.jsx / Hero.jsx / Closing.jsx
        ├── Row.jsx                # tata letak kotak kaca + visual
        ├── ChoroplethMap.jsx      # peta (HLS, GAP, klaster)
        ├── Histogram.jsx
        ├── ProvinceRange.jsx
        ├── GapBars.jsx
        ├── ContextScatter.jsx
        ├── PCABiplot.jsx
        ├── ClusterHeatmap.jsx
        └── ClusterCards.jsx
```

## Cara Menjalankan

Prasyarat: Node.js 18 atau lebih baru.

```bash
npm install
npm run dev        # buka http://localhost:5173
```

Build produksi:

```bash
npm run build      # hasil di folder dist/
npm run preview    # uji hasil build secara lokal
```

## Data

Seluruh data bersumber dari **Badan Pusat Statistik (BPS)** dan sudah digabung dengan batas wilayah dalam satu berkas `public/data/indonesia.geojson` (514 fitur kabupaten/kota). Setiap fitur memuat atribut berikut (yang dipakai aplikasi):

| Field | Keterangan |
|---|---|
| `kabkota`, `provinsi` | Nama wilayah |
| `hls`, `rls` | Harapan Lama Sekolah dan Rata-rata Lama Sekolah (tahun) |
| `p0`, `p1` | Persentase penduduk miskin dan indeks kedalaman kemiskinan |
| `tpt` | Tingkat pengangguran terbuka (%) |
| `pdrb_per_kapita_jt` | PDRB ADHB per kapita (juta Rp) |
| `kepadatan` | Penduduk per km² |
| `remaja_hls_di_bawah_12` | Penduduk usia 15–19 di wilayah ber-HLS < 12 tahun |
| `PC1`, `PC2`, `cluster` | Hasil PCA dan pengelompokan hierarkis |

Jika nama field di datamu berbeda, ubah objek `P` di `src/config.js`.

> Tahun data: **[isi tahun data BPS yang dipakai]**

## Kustomisasi

- **Foto:** taruh `a`–`i` di `public/images/` (a = hero, b = latar penutup 1, c–e = kartu kesimpulan, f–i = kartu rekomendasi). Ekstensi diatur lewat `IMG_EXT` di `src/config.js` (disarankan `jpg`).
- **Warna dan nama klaster:** `CLUSTER_COLORS` dan `CLUSTER_TEXT` di `src/config.js`.
- **Panah loading PCA:** isi `LOADINGS` di `src/config.js` (opsional).
- **Palet utama:** variabel CSS di bagian atas `src/index.css`: Palladian `#EEE9DF`, Oatmeal `#C9C1B1`, Burning Flame `#FFB162`, Truffle Trouble `#A35139`, Blue Fantastic `#2C3B4D`, Abyssal Anchorfish Blue `#1B2632`.
- **Teks interpretasi:** `src/App.jsx` (bagian per bagian) dan `src/components/ContextScatter.jsx` (teks tiap tab).

## Deployment

Aplikasi sepenuhnya client-side (tanpa backend dan basis data), jadi cukup mengunggah isi folder `dist/` ke hosting statis (Vercel, Netlify, GitHub Pages, atau server institusi).

## Keterbatasan

- Data satu titik waktu, jadi tidak menunjukkan perubahan antartahun.
- Korelasi bersifat deskriptif, bukan sebab-akibat.
- Berkas GeoJSON besar (sekitar 13 MB); penyederhanaan geometri atau TopoJSON dapat mempercepat waktu muat.
- Peta koroplet menonjolkan wilayah luas (misalnya Papua), sehingga dilengkapi histogram dan grafik rentang.
- Legenda dan satuan belum lengkap di semua visual, warna klaster belum diuji untuk buta warna, dan uji pengguna formal belum dilakukan.

## Catatan Penggunaan AI

Kerangka kode dan draf naskah dibantu oleh Claude (Anthropic) berdasarkan arahan, data, dan revisi penulis. Data, hasil analisis, keputusan desain, dan tanggung jawab akhir ada pada penulis.

## Sumber Data

Badan Pusat Statistik (BPS), https://www.bps.go.id

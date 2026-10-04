// === Konfigurasi nama field dari GeoJSON ===

export const GEOJSON_URL = '/data/indonesia.geojson'

export const P = {
  nama: 'kabkota',
  hls: 'hls',
  rls: 'rls',
  miskin: 'p0',
  p1: 'p1',
  pdrb: 'pdrb_per_kapita_jt',
  tpt: 'tpt',
  kepadatan: 'kepadatan',

  prov: 'provinsi',
  remaja12: 'remaja_hls_di_bawah_12',
  cluster: 'cluster',
  pc1: 'PC1',
  pc2: 'PC2',
}

// Loading PCA
export const LOADINGS = []

// Mengambil nilai numerik dari properties GeoJSON
export const num = (f, k) => {
  const v = parseFloat(f.properties[P[k]])
  return Number.isFinite(v) ? v : null
}

// Warna cluster (urut sesuai nomor cluster) dan nama interpretatif — cek & edit sesuai hasil analisismu
export const CLUSTER_COLORS = ['#C9C1B1', '#FFB162', '#A35139']
export const CLUSTER_TEXT = {
  1: 'Pusat urban dan ekonomi kuat',
  2: 'Wilayah menengah',
  3: 'Kantong kemiskinan tinggi',
}

// Foto: taruh di public/images/ (a.jpe ... i.jpe). Ubah ekstensi di sini kalau perlu.
export const IMG_EXT = 'jpg'
export const img = k => `/images/${k}.${IMG_EXT}`

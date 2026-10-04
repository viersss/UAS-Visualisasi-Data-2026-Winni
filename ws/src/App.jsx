import { useMemo } from 'react'
import * as d3 from 'd3'
import { useGeo } from './hooks'
import { P, num, CLUSTER_COLORS } from './config'
import { computeStats, fmt, title } from './stats'
import Navbar from './components/Navbar'
import ProgressBar from './components/ProgressBar'
import Hero from './components/Hero'
import Row, { Gl } from './components/Row'
import ChoroplethMap from './components/ChoroplethMap'
import Histogram from './components/Histogram'
import ProvinceRange from './components/ProvinceRange'
import GapBars from './components/GapBars'
import ContextScatter from './components/ContextScatter'
import PCABiplot from './components/PCABiplot'
import ClusterHeatmap from './components/ClusterHeatmap'
import ClusterCards from './components/ClusterCards'
import Closing from './components/Closing'

const gapOf = f => { const a = num(f, 'hls'), b = num(f, 'rls'); return a == null || b == null ? null : a - b }
const val = v => (v == null ? '-' : v.toFixed(2))
const name = f => f.properties[P.nama]
const prov = f => title(f.properties[P.prov])
const GOLD = '#FFB162', RED = '#ff6a4d'

export default function App() {
  const { geo, error } = useGeo()
  const { s, st } = useMemo(() => {
    if (!geo) return {}
    const gaps = geo.features.map(gapOf).filter(v => v != null)
    const cl = [...new Set(geo.features.map(f => String(f.properties[P.cluster])))].sort()
    return {
      st: computeStats(geo),
      s: {
        hls: d3.scaleSequential(d3.interpolateRgbBasis(['#A35139', '#FFB162', '#EEE9DF'])).domain(d3.extent(geo.features, f => num(f, 'hls'))),
        gap: d3.scaleSequential(d3.interpolateRgbBasis(['#5E86AD', '#EEE9DF', '#FFB162', '#A35139'])).domain(d3.extent(gaps)),
        cluster: d3.scaleOrdinal(CLUSTER_COLORS).domain(cl),
      },
    }
  }, [geo])

  if (error || !geo) return <p className="msg">{error || 'Memuat data…'}</p>
  const { hi, lo, maxGap: mg, c3top: ct, topGap } = st
  const cKeys = s.cluster.domain(), c3 = st.cl[cKeys.at(-1)], w = st.pr[0]
  const topBelow12 = topGap.filter(f => num(f, 'hls') < 12).length

  return (
    <>
      <Navbar /><ProgressBar /><Hero />

      <section id="pendidikan" className="sec">
        <h2>Ragam cerita pendidikan anak bangsa</h2>

        <Row title="Kesempatan Sekolah Tak Sama di Setiap Daerah" vtitle="Peta Harapan Lama Sekolah (HLS) per Kabupaten/Kota" glass={<>
          <p>Harapan Lama Sekolah (HLS) menggambarkan berapa lama seorang anak yang mulai bersekolah diharapkan dapat menempuh pendidikan. Makin terang warnanya, makin panjang harapan sekolahnya.</p>
          <p>Anak di <Gl c={GOLD}>{name(hi)}</Gl> diharapkan bersekolah <b>{fmt(num(hi, 'hls'))} tahun</b>, melewati SMA hingga perguruan tinggi. Di <Gl c={RED}>{name(lo)}</Gl> ({prov(lo)}), angkanya hanya <b>{fmt(num(lo, 'hls'))} tahun</b>, belum setara tamat SD. Selisihnya {fmt(st.range)} tahun, atau {fmt(st.ratio)} kali lipat.</p>
          <p className="hook">Lalu, berapa banyak daerah yang belum mencapai standar 12 tahun? ↓</p>
        </>}>
          <ChoroplethMap geo={geo} scale={s.hls} getValue={f => num(f, 'hls')} tip={f => [`HLS: ${val(num(f, 'hls'))}`]} marks={[{ f: hi, color: GOLD }, { f: lo, color: RED }]} />
        </Row>

        <Row flip title="Ketika 12 Tahun Pendidikan Belum Jadi Standar Semua Daerah" vtitle="Jumlah Kabupaten/Kota menurut Rentang HLS" glass={<>
          <p>Wajib belajar 12 tahun berarti bersekolah sampai tamat SMA. Setiap batang menghitung berapa kabupaten/kota yang HLS-nya berada di rentang itu.</p>
          <p>Batang merah di kiri garis putus-putus adalah wilayah yang anaknya diperkirakan belum sempat menamatkan SMA: <b>{st.below12} dari {st.n} kabupaten/kota</b> ({fmt(st.below12 / st.n * 100)}%). Di sana tinggal sekitar <b>{Math.round(st.teens).toLocaleString('id-ID')}</b> penduduk usia 15–19 tahun.</p>
          <p>Jumlah daerahnya minoritas, tetapi bagi remaja yang tinggal di sana, standar itu masih jauh.</p>
          <p className="hook">Apakah kesenjangan ini hanya terjadi antarpulau? ↓</p>
        </>}>
          <Histogram geo={geo} />
        </Row>

        <Row title="Batas Provinsi Tak Menghapus Kesenjangan" vtitle="Jarak HLS Tertinggi–Terendah dalam Satu Provinsi (8 provinsi terlebar)" glass={<>
          <p>Tiap garis menghubungkan kabupaten/kota ber-HLS terendah (merah) dan tertinggi (emas) di provinsi yang sama.</p>
          <p>Di <b>{title(w.prov)}</b>, <Gl c={GOLD}>{name(w.max)}</Gl> ({fmt(num(w.max, 'hls'))} tahun) dan <Gl c={RED}>{name(w.min)}</Gl> ({fmt(num(w.min, 'hls'))} tahun) berada di provinsi yang sama, tetapi terpaut {fmt(w.spread)} tahun.</p>
          <p>Angka rata-rata provinsi bisa menyembunyikan wilayah yang tertinggal.</p>
        </>}>
          <ProvinceRange rows={st.pr.slice(0, 8)} />
        </Row>
        <p className="statement">Kesempatan pendidikan di Indonesia memiliki wajah yang berbeda di setiap wilayah.</p>
      </section>

      <section id="kesenjangan" className="sec">
        <h2>Seberapa Jauh Pendidikan Kita Melangkah dari Generasi Sebelumnya?</h2>

        <Row title="Ada Jarak antara Harapan dan Kenyataan" vtitle="Peta GAP (HLS − RLS), dalam Tahun" glass={<>
          <p>HLS adalah harapan sekolah anak hari ini, RLS adalah rata-rata lama sekolah penduduk dewasa. GAP = HLS − RLS, yaitu berapa tahun lebih panjang anak diharapkan sekolah dibanding generasi sebelumnya.</p>
          <p>Di semua {st.n} wilayah GAP positif (median {fmt(st.gapMed)} tahun). Contohnya di <Gl c={GOLD}>{name(mg)}</Gl>, {prov(mg)}: HLS <b>{fmt(num(mg, 'hls'))}</b> tahun sementara RLS hanya <b>{fmt(num(mg, 'rls'))}</b> tahun. Jaraknya {fmt(st.gp(mg))} tahun, yang terbesar di Indonesia.</p>
          <p className="hook">Apakah GAP sebesar itu berarti pendidikannya maju? ↓</p>
        </>}>
          <ChoroplethMap geo={geo} scale={s.gap} getValue={gapOf} marks={[{ f: mg, color: RED }]}
            tip={f => [`HLS: ${val(num(f, 'hls'))}`, `RLS: ${val(num(f, 'rls'))}`, `GAP: ${val(gapOf(f))}`]} />
        </Row>

        <Row flip title="GAP Besar Tak Selalu Berarti Kemajuan" vtitle="8 Wilayah dengan GAP Terbesar: Capaian Dewasa vs Harapan Anak" glass={<>
          <p>Batang abu-abu adalah RLS, lalu ditambah GAP hingga ujungnya di HLS. Garis putus-putus menandai 12 tahun.</p>
          <p>Dari 8 wilayah dengan GAP terbesar, <b>{topBelow12}</b> masih ber-HLS di bawah 12 tahun. GAP besar di sini lebih banyak lahir dari capaian orang tua yang sangat rendah (RLS rata-rata {fmt(d3.mean(topGap, f => num(f, 'rls')))} tahun), bukan dari harapan anak yang sudah tinggi.</p>
          <p>Harapan memang naik, tetapi bila titik awalnya rendah, jaraknya terlihat besar padahal garis akhirnya masih belum jauh.</p>
        </>}>
          <GapBars rows={topGap} />
        </Row>
        <p className="statement">Jarak antara harapan pendidikan hari ini dan capaian generasi sebelumnya berbeda di setiap wilayah.</p>
      </section>

      <section id="konteks" className="sec">
        <h2>Pendidikan tidak berdiri sendiri</h2>
        <p className="lead">Perbedaan pendidikan tidak berlangsung dalam ruang kosong. Setiap wilayah memiliki kondisi ekonomi, pasar kerja, dan karakteristik geografis yang berbeda. Pilih indikator di bawah ini.</p>
        <ContextScatter geo={geo} colorScale={s.cluster} />
      </section>

      <section id="pola" className="sec">
        <h2>Ketika Semua Faktor Bertemu</h2>

        <Row title="Wilayah Berprofil Serupa Saling Berdekatan" vtitle="Peta Kemiripan Wilayah (PCA)" glass={<>
          <p>Satu wilayah tidak hanya memiliki satu karakteristik. HLS, kemiskinan, P1, PDRB, TPT, dan kepadatan dirangkum menjadi dua sumbu (PC1 dan PC2).</p>
          <p>Setiap titik adalah satu kabupaten/kota. Titik yang berdekatan punya profil yang mirip, dan warnanya menunjukkan kelompok (cluster) hasil pengelompokan.</p>
          <p className="hook">Seperti apa wajah tiap kelompok? ↓</p>
        </>}>
          <PCABiplot geo={geo} colorScale={s.cluster} />
        </Row>

        <Row flip title="Tiga Kelompok, Tiga Wajah Wilayah" vtitle="Profil Tiap Cluster Dibanding Rata-rata Nasional" glass={<>
          <ClusterCards st={st} colorScale={s.cluster} />
          <p className="hook">Dan di mana mereka berada di peta? ↓</p>
        </>}>
          <ClusterHeatmap geo={geo} colorScale={s.cluster} />
        </Row>

        <Row title="Di Mana Tiga Kelompok Itu Berada" vtitle="Peta Sebaran Cluster Kabupaten/Kota" glass={<>
          <p>Contohnya <Gl c={RED}>{name(ct)}</Gl> ({prov(ct)}): <b>{fmt(num(ct, 'miskin'))}%</b> penduduknya miskin dan HLS-nya {fmt(num(ct, 'hls'))} tahun. Ia masuk Cluster {cKeys.at(-1)}, bersama {c3.n - 1} wilayah lain yang terkonsentrasi di {c3.provs.map(p => p[0]).join(', ')}.</p>
          <p className="note">Pengelompokan ini bersifat deskriptif, bukan label baik atau buruk.</p>
        </>}>
          <ChoroplethMap geo={geo} scale={s.cluster} marks={[{ f: ct, color: RED }]}
            getValue={f => (f.properties[P.cluster] == null ? null : String(f.properties[P.cluster]))} tip={f => [`Cluster: ${f.properties[P.cluster]}`]} />
        </Row>
      </section>

      <Closing st={st} />
    </>
  )
}

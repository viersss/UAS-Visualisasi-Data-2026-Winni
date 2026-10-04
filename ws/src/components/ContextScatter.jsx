import { useState } from 'react'
import * as d3 from 'd3'
import { useChart } from '../hooks'
import { P, num } from '../config'
import { fmt, corr } from '../stats'
import Row from './Row'

const TABS = [
  { label: 'Kemiskinan', key: 'miskin', lab: 'persentase penduduk miskin', axis: 'Penduduk miskin (%)', title: 'Di Mana Kemiskinan Tinggi, HLS Cenderung Rendah',
    read: 'makin ke kanan, makin banyak penduduk miskin di wilayah itu.',
    text: 'Titiknya menyebar lebar: ada wilayah miskin dengan HLS tinggi, dan sebaliknya. Kemiskinan hanyalah satu lapisan dari cerita, bukan penjelasan tunggal.' },
  { label: 'P1', key: 'p1', lab: 'indeks kedalaman kemiskinan (P1)', axis: 'Indeks kedalaman kemiskinan (P1)', title: 'Kemiskinan yang Dalam Beriringan dengan HLS Rendah',
    read: 'P1 mengukur seberapa jauh rata-rata pengeluaran penduduk miskin dari garis kemiskinan; makin ke kanan, makin dalam.',
    text: 'Polanya mirip persentase miskin. Titik-titik di ujung kanan menunjukkan segelintir wilayah dengan kemiskinan yang sangat dalam, dan umumnya HLS-nya pun rendah.' },
  { label: 'PDRB', key: 'pdrb', log: true, lab: 'PDRB per kapita', axis: 'PDRB per kapita, juta rupiah (log10)', title: 'Ekonomi Besar Tak Otomatis Berarti Sekolah Panjang',
    read: 'sumbu memakai skala log, jadi tiap langkah ke kanan berarti PDRB berlipat ganda.',
    text: 'Hubungannya positif tetapi lemah. Banyak wilayah dengan PDRB per kapita serupa punya HLS yang sangat berbeda, artinya besarnya ekonomi belum tentu sampai ke kesempatan sekolah anak.' },
  { label: 'TPT', key: 'tpt', lab: 'tingkat pengangguran terbuka (TPT)', axis: 'Tingkat pengangguran terbuka (%)', title: 'Pengangguran Tinggi di Wilayah dengan HLS Tinggi?',
    read: 'makin ke kanan, makin banyak angkatan kerja yang menganggur.',
    text: 'Polanya mungkin tak terduga. Salah satu dugaan: wilayah perkotaan dengan sekolah panjang punya pasar kerja formal yang lebih ketat, sedangkan TPT rendah di wilayah lain bisa mencerminkan pekerjaan informal. Ini dugaan, bukan kesimpulan.' },
  { label: 'Kepadatan', key: 'kepadatan', log: true, lab: 'kepadatan penduduk', axis: 'Kepadatan penduduk, jiwa/km² (log10)', title: 'Kota Padat, Harapan Sekolah Lebih Panjang',
    read: 'sumbu memakai skala log; makin ke kanan, makin padat penduduknya.',
    text: 'Wilayah padat, umumnya perkotaan, cenderung punya HLS lebih tinggi. Wilayah yang jarang penduduknya menghadapi jarak dan akses yang berbeda, dan HLS terendah ada di sisi ini.' },
]

export default function ContextScatter({ geo, colorScale }) {
  const [tab, setTab] = useState(0)
  const tb = TABS[tab]
  const r = corr(geo, tb.key, tb.log)
  const pts = geo.features.map(f => {
    const x = num(f, tb.key), y = num(f, 'hls')
    return x == null || y == null || (tb.log && x <= 0) ? null : { f, raw: x, x: tb.log ? Math.log10(x) : x, y }
  }).filter(Boolean)
  const srt = [...pts].sort((a, b) => a.raw - b.raw), q = Math.floor(srt.length * 0.2)
  const lowY = d3.mean(srt.slice(0, q), d => d.y), highY = d3.mean(srt.slice(-q), d => d.y)

  const [ref, svg, w, h] = useChart(w => Math.min(Math.max(w * 0.7, 300), 460), (s, w, h) => {
    const m = { t: 16, r: 16, b: 48, l: 48 }
    const X = d3.scaleLinear(d3.extent(pts, d => d.x), [m.l, w - m.r]).nice()
    const Y = d3.scaleLinear(d3.extent(pts, d => d.y), [h - m.b, m.t]).nice()
    s.append('g').attr('transform', `translate(0,${h - m.b})`).call(d3.axisBottom(X).ticks(6))
    s.append('g').attr('transform', `translate(${m.l},0)`).call(d3.axisLeft(Y).ticks(6))
    s.append('text').attr('x', w / 2).attr('y', h - 10).attr('text-anchor', 'middle').attr('class', 'axl').text(tb.axis)
    s.append('text').attr('transform', 'rotate(-90)').attr('x', -h / 2).attr('y', 14).attr('text-anchor', 'middle').attr('class', 'axl').text('HLS (tahun)')
    const mx = d3.mean(pts, d => d.x), my = d3.mean(pts, d => d.y)
    const b = d3.sum(pts, d => (d.x - mx) * (d.y - my)) / d3.sum(pts, d => (d.x - mx) ** 2), a = my - b * mx, [x0, x1] = X.domain()
    s.selectAll('circle').data(pts).join('circle').attr('cx', d => X(d.x)).attr('cy', d => Y(d.y)).attr('r', 3.6)
      .attr('fill', d => colorScale(String(d.f.properties[P.cluster]))).attr('opacity', 0.75)
      .append('title').text(d => `${d.f.properties[P.nama]}\n${tb.label}: ${d.raw.toFixed(2)}\nHLS: ${d.y.toFixed(2)}`)
    s.append('line').attr('x1', X(x0)).attr('x2', X(x1)).attr('y1', Y(a + b * x0)).attr('y2', Y(a + b * x1)).attr('class', 'trend')
  }, [geo, tab])

  return (
    <div>
      <div className="tabs">{TABS.map((x, i) => <button key={x.key} className={i === tab ? 'on' : ''} onClick={() => setTab(i)}>{x.label}</button>)}</div>
      <Row title={tb.title} vtitle={`HLS dan ${tb.lab}, satu titik = satu kabupaten/kota`} glass={<>
        <p><b>Cara membaca:</b> sumbu tegak adalah HLS, {tb.read} Warna titik menunjukkan cluster.</p>
        <p>20% wilayah dengan {tb.lab} tertinggi rata-rata ber-HLS <b>{fmt(highY)} tahun</b>, sedangkan 20% terendah <b>{fmt(lowY)} tahun</b>: selisih {fmt(Math.abs(highY - lowY))} tahun.</p>
        <p>{tb.text}</p>
        <p className="note">Korelasi r = {fmt(r, 2)} (−1 sampai 1). Garis putus-putus = tren. Ini menunjukkan keterkaitan, bukan sebab-akibat.</p>
      </>}>
        <div ref={ref} className="chart"><svg ref={svg} viewBox={`0 0 ${w || 10} ${h}`} width="100%" /></div>
      </Row>
    </div>
  )
}

import { goTo } from './Navbar'
import { fmt, title } from '../stats'
import { img, P, num } from '../config'
import { Photo, Gl } from './Row'

const BULB = <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#FFB162" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" /></svg>
const ACTIONS = [
  'Wilayah dengan HLS dan RLS rendah → penguatan akses dan keberlanjutan pendidikan dasar-menengah.',
  'Wilayah dengan GAP besar tetapi HLS masih rendah → jangan hanya mengejar harapan pendidikan, tetapi juga memperkuat kondisi pendidikan saat ini.',
  'Wilayah dengan ketimpangan tinggi dalam satu provinsi → intervensi perlu memperhatikan kabupaten/kota yang tertinggal, bukan hanya rata-rata provinsi.',
  'Wilayah dengan kondisi sosial-ekonomi berbeda → kebijakan pendidikan perlu mempertimbangkan konteks wilayah, bukan pendekatan yang sama untuk semua daerah.',
]

export default function Closing({ st }) {
  const c = Object.keys(st.cl), c1 = st.cl[c[0]], c3 = st.cl[c.at(-1)], w = st.pr[0]
  const cards = [
    { k: 'c', t: 'Jaraknya Lebar, Bahkan di Satu Provinsi', p: <>{fmt(st.range)} tahun memisahkan HLS tertinggi ({title(st.hi.properties[P.nama])}) dan terendah ({title(st.lo.properties[P.nama])}. Jarak serupa muncul di dalam satu provinsi: di {title(w.prov)}, selisih antar kabupatennya mencapai {fmt(w.spread)} tahun.</> },
    { k: 'd', t: 'Harapan Naik, Titik Awalnya Berbeda', p: <>Generasi baru diharapkan sekolah lebih lama di semua wilayah, tetapi mereka berangkat dari capaian orang tua yang tidak sama: RLS rata-rata {fmt(c1.rls)} tahun di Cluster {c[0]}, hanya {fmt(c3.rls)} tahun di Cluster {c.at(-1)}.</> },
    { k: 'e', t: 'Konteks Berhubungan, Tidak Menentukan', p: <>Kemiskinan (r = {fmt(st.rMiskin, 2)}) dan PDRB (r = {fmt(st.rPdrb, 2)}) hanya menjelaskan sebagian pola. Sisanya ada pada pasar kerja, geografis, dan faktor lain yang tak tertangkap angka.</> },
  ]
  return (
    <>
      <section id="penutup" className="close1" style={{ backgroundImage: `url(${img('b')})` }}>
        <div className="close-in">
          <h2 className="big">Jadi, seberapa jauh pendidikan kita berbeda?</h2>
          <p className="sub">Dari Sumatra hingga Papua, perbedaan pendidikan tidak hanya terlihat dari angka HLS. Di baliknya terdapat kondisi ekonomi, kemiskinan, pasar kerja, kepadatan penduduk, dan karakteristik demografi yang berbeda.</p>
          <div className="cards3">
            {cards.map(x => (
              <div className="glass ccard3" key={x.k}><Photo k={x.k} /><h4>{x.t}</h4><p>{x.p}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="close2">
        <h2 className="big">Lalu apa yang bisa dilakukan?</h2>
        <div className="grid8">
          {ACTIONS.map((a, i) => {
            const text = <div className="glass act" key={'t' + i}>{BULB}<p>{a}</p></div>
            const photo = <Photo key={'p' + i} k={'fghi'[i]} className="tall" />
            return i < 2 ? [photo, text] : [text, photo]
          })}
        </div>
        <p className="statement">Indonesia tidak memiliki satu cerita pendidikan.<br />Ada banyak cerita di balik petanya.</p>
        <button className="cta" onClick={() => goTo('home')}>BACK TO TOP</button>
        <div className="credit">Winni Elfira – 222313423 – 3SD2 (UAS Visualisasi Data 2026)</div>
      </section>
    </>
  )
}

import { img } from '../config'
// Glow teks berkedip untuk menandai wilayah sampel
export const Gl = ({ c = '#FFB162', children }) => <span className="gl" style={{ '--c': c }}>{children}</span>
export const Photo = ({ k, className = '' }) => (
  <div className={`photo ${className}`}><img src={img(k)} alt="" loading="lazy" onError={e => { e.currentTarget.style.visibility = 'hidden' }} /></div>
)
// Judul besar (warna aksen) + kotak kaca berisi interpretasi di satu sisi, visual + judulnya di sisi lain
export default function Row({ title, vtitle, glass, flip, children }) {
  return (
    <div className={`row ${flip ? 'flip' : ''}`}>
      <div className="vis"><h5 className="vtitle">{vtitle}</h5>{children}</div>
      <div className="txt"><h3 className="rtitle">{title}</h3><div className="glass">{glass}</div></div>
    </div>
  )
}

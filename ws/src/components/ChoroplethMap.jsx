import { useState } from 'react'
import * as d3 from 'd3'
import { useSize } from '../hooks'
import { P } from '../config'

function Legend({ scale }) {
  if (scale.interpolator) {
    const stops = d3.range(0, 1.01, 0.1).map(t => scale.interpolator()(t)).join(',')
    const dom = scale.domain()
    return (
      <div className="legend">
        <div className="bar" style={{ background: `linear-gradient(to right,${stops})` }} />
        <div className="lab"><span>{dom[0].toFixed(1)}</span><span>{dom[dom.length - 1].toFixed(1)}</span></div>
      </div>
    )
  }
  return <div className="legend swatches">{scale.domain().map(d => <span key={d}><i style={{ background: scale(d) }} />Cluster {d}</span>)}</div>
}

// marks: [{f, color}] = wilayah sampel yang diberi efek glow berkedip
export default function ChoroplethMap({ geo, getValue, scale, tip, marks = [] }) {
  const [ref, w] = useSize()
  const [t, setT] = useState(null)
  const h = Math.max(w * 0.5, 260)
  let paths = [], glows = []
  if (geo && w) {
    const path = d3.geoPath(d3.geoMercator().fitSize([w, h], geo))
    paths = geo.features.map((f, i) => {
      const v = getValue(f)
      return <path key={i} d={path(f)} fill={v == null ? '#3a4656' : scale(v)} className="area"
        onMouseMove={e => { const r = ref.current.getBoundingClientRect(); setT({ x: e.clientX - r.left, y: e.clientY - r.top, f }) }}
        onMouseLeave={() => setT(null)} />
    })
    glows = marks.map(({ f, color }, i) => {
      const [cx, cy] = path.centroid(f)
      return <g key={i} style={{ '--c': color }} pointerEvents="none">
        <path d={path(f)} className="glow" /><circle cx={cx} cy={cy} r={Math.max(7, w * 0.011)} className="ring" />
      </g>
    })
  }
  return (
    <div ref={ref} className="chart">
      <svg viewBox={`0 0 ${w || 10} ${h}`} width="100%">{paths}{glows}</svg>
      <Legend scale={scale} />
      {t && (
        <div className="tip" style={{ left: Math.min(t.x + 12, w - 160), top: t.y + 12 }}>
          <b>{t.f.properties[P.nama]}</b>
          {tip(t.f).map(l => <div key={l}>{l}</div>)}
        </div>
      )}
    </div>
  )
}

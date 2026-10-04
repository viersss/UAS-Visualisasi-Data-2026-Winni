import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { useSize } from '../hooks'
import { P, num, LOADINGS } from '../config'

export default function PCABiplot({ geo, colorScale }) {
  const [ref, w] = useSize()
  const svg = useRef(null)
  const [t, setT] = useState(null)
  const h = Math.min(Math.max(w * 0.75, 300), 480)

  useEffect(() => {
    if (!geo || !w) return
    const m = 32
    const pts = geo.features.map(f => ({ f, x: num(f, 'pc1'), y: num(f, 'pc2') })).filter(d => d.x != null && d.y != null)
    const s = d3.select(svg.current); s.selectAll('*').remove()
    if (!pts.length) return
    const X = d3.scaleLinear(d3.extent(pts, d => d.x), [m, w - m]).nice()
    const Y = d3.scaleLinear(d3.extent(pts, d => d.y), [h - m, m]).nice()
    s.append('g').attr('transform', `translate(0,${Y(0)})`).call(d3.axisBottom(X).ticks(5))
    s.append('g').attr('transform', `translate(${X(0)},0)`).call(d3.axisLeft(Y).ticks(5))
    s.selectAll('circle').data(pts).join('circle')
      .attr('cx', d => X(d.x)).attr('cy', d => Y(d.y)).attr('r', 3.5).attr('opacity', 0.75)
      .attr('fill', d => colorScale(String(d.f.properties[P.cluster])))
      .on('mousemove', (e, d) => { const r = ref.current.getBoundingClientRect(); setT({ x: e.clientX - r.left, y: e.clientY - r.top, f: d.f }) })
      .on('mouseleave', () => setT(null))
    // panah loading (skala disesuaikan agar terlihat)
    const k = Math.min(X(X.domain()[1]) - X(0), Y(0) - Y(Y.domain()[1])) * 0.9
    LOADINGS.forEach(l => {
      s.append('line').attr('x1', X(0)).attr('y1', Y(0)).attr('x2', X(0) + l.pc1 * k).attr('y2', Y(0) - l.pc2 * k).attr('class', 'arrow')
      s.append('text').attr('x', X(0) + l.pc1 * k * 1.08).attr('y', Y(0) - l.pc2 * k * 1.08).attr('class', 'axl').text(l.label)
    })
  }, [geo, w, h])

  return (
    <div ref={ref} className="chart">
      <svg ref={svg} viewBox={`0 0 ${w || 10} ${h}`} width="100%" />
      {t && <div className="tip" style={{ left: Math.min(t.x + 12, w - 160), top: t.y + 12 }}><b>{t.f.properties[P.nama]}</b></div>}
    </div>
  )
}

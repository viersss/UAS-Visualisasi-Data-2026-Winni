import * as d3 from 'd3'
import { useChart } from '../hooks'
import { P, num } from '../config'

const COLS = [['hls', 'HLS'], ['rls', 'RLS'], ['miskin', 'Miskin'], ['p1', 'P1'], ['tpt', 'TPT'], ['pdrb', 'PDRB', true], ['kepadatan', 'Padat', true]]
const val = (f, k, log) => { const v = num(f, k); return v == null ? null : log ? Math.log10(Math.max(v, 1e-9)) : v }
const fv = v => (v >= 100 ? d3.format(',.0f')(v) : v.toFixed(1))

// Warna = rata-rata cluster dibanding rata-rata nasional (z-score); angka = median asli
export default function ClusterHeatmap({ geo, colorScale }) {
  const cls = colorScale.domain()
  const [ref, svg, w, h] = useChart(() => cls.length * 56 + 70, (s, w, h) => {
    const m = { t: 34, r: 4, b: 28, l: 38 }, cw = (w - m.l - m.r) / COLS.length
    const col = d3.scaleDiverging(d3.interpolateRgbBasis(['#5E86AD', '#2C3B4D', '#FFB162'])).domain([-1.5, 0, 1.5])
    COLS.forEach(([k, l, log], j) => {
      const all = geo.features.map(f => val(f, k, log)).filter(v => v != null)
      const mu = d3.mean(all), sd = d3.deviation(all)
      s.append('text').attr('x', m.l + j * cw + cw / 2).attr('y', m.t - 10).attr('text-anchor', 'middle').text(l)
      cls.forEach((c, i) => {
        const fs = geo.features.filter(f => String(f.properties[P.cluster]) === c)
        const z = (d3.mean(fs, f => val(f, k, log)) - mu) / sd
        const g = s.append('g').attr('transform', `translate(${m.l + j * cw},${m.t + i * 56})`)
        g.append('rect').attr('width', cw - 3).attr('height', 52).attr('rx', 6).attr('fill', col(z))
        g.append('text').attr('x', (cw - 3) / 2).attr('y', 30).attr('text-anchor', 'middle').attr('class', 'cell')
          .attr('fill', z > 0.7 ? '#1B2632' : '#EEE9DF').text(fv(d3.median(fs, f => num(f, k))))
      })
    })
    cls.forEach((c, i) => s.append('text').attr('x', 0).attr('y', m.t + i * 56 + 30).attr('fill', colorScale(c)).attr('class', 'axl').text(`C${c}`))
    s.append('text').attr('x', m.l).attr('y', h - 6).text('Biru = di bawah rata-rata nasional · oranye = di atas · angka = median')
  }, [geo])
  return <div ref={ref} className="chart"><svg ref={svg} viewBox={`0 0 ${w || 10} ${h}`} width="100%" /></div>
}

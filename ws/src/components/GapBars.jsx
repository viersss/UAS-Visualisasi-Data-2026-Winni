import * as d3 from 'd3'
import { useChart } from '../hooks'
import { P, num } from '../config'
import { fmt } from '../stats'

// Top-k wilayah dengan GAP terbesar: batang = RLS (capaian dewasa) + GAP, ujung batang = HLS
export default function GapBars({ rows }) {
  const [ref, svg, w, h] = useChart(() => rows.length * 40 + 60, (s, w, h) => {
    const m = { t: 30, r: 16, b: 28, l: w < 520 ? 96 : 140 }, X = d3.scaleLinear([0, 22], [m.l, w - m.r])
    s.append('g').attr('transform', `translate(0,${h - m.b})`).call(d3.axisBottom(X).ticks(7))
    s.append('line').attr('x1', X(12)).attr('x2', X(12)).attr('y1', m.t - 10).attr('y2', h - m.b).attr('class', 'ref')
    s.append('text').attr('x', X(12) + 4).attr('y', m.t - 14).text('12 tahun')
    rows.forEach((f, i) => {
      const y = m.t + i * 40, a = num(f, 'rls'), b = num(f, 'hls')
      s.append('text').attr('x', m.l - 8).attr('y', y + 14).attr('text-anchor', 'end').text(f.properties[P.nama])
      s.append('rect').attr('x', X(0)).attr('y', y).attr('width', X(a) - X(0)).attr('height', 20).attr('rx', 3).attr('fill', '#C9C1B1')
      s.append('rect').attr('x', X(a)).attr('y', y).attr('width', X(b) - X(a)).attr('height', 20).attr('rx', 3).attr('fill', b < 12 ? '#A35139' : '#FFB162')
        .append('title').text(`${f.properties[P.nama]}: RLS ${a.toFixed(2)}, HLS ${b.toFixed(2)}, GAP ${(b - a).toFixed(2)}`)
      s.append('text').attr('x', X(b) + 6).attr('y', y + 14).style('fill', '#EEE9DF').text(`HLS ${fmt(b)}`)
    })
  }, [rows])
  return (
    <div>
      <div ref={ref} className="chart"><svg ref={svg} viewBox={`0 0 ${w || 10} ${h}`} width="100%" /></div>
      <div className="legend swatches">
        <span><i style={{ background: '#C9C1B1' }} />RLS (capaian dewasa)</span>
        <span><i style={{ background: '#FFB162' }} />GAP, HLS ≥ 12</span>
        <span><i style={{ background: '#A35139' }} />GAP, HLS &lt; 12</span>
      </div>
    </div>
  )
}

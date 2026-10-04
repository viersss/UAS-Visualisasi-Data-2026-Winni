import * as d3 from 'd3'
import { useChart } from '../hooks'
import { num } from '../config'

export default function Histogram({ geo }) {
  const [ref, svg, w, h] = useChart(w => Math.min(Math.max(w * 0.55, 240), 360), (s, w, h) => {
    const m = { t: 28, r: 12, b: 44, l: 40 }
    const bins = d3.bin().domain([4, 18]).thresholds(d3.range(5, 18))(geo.features.map(f => num(f, 'hls')).filter(v => v != null))
    const X = d3.scaleLinear([4, 18], [m.l, w - m.r])
    const Y = d3.scaleLinear([0, d3.max(bins, b => b.length)], [h - m.b, m.t]).nice()
    s.append('g').attr('transform', `translate(0,${h - m.b})`).call(d3.axisBottom(X).ticks(7))
    s.append('g').attr('transform', `translate(${m.l},0)`).call(d3.axisLeft(Y).ticks(5))
    s.selectAll('rect').data(bins).join('rect')
      .attr('x', d => X(d.x0) + 1).attr('width', d => Math.max(0, X(d.x1) - X(d.x0) - 2))
      .attr('y', d => Y(d.length)).attr('height', d => Y(0) - Y(d.length)).attr('rx', 2)
      .attr('fill', d => (d.x1 <= 12 ? '#A35139' : '#C9C1B1'))
      .append('title').text(d => `HLS ${d.x0}–${d.x1}: ${d.length} wilayah`)
    s.append('line').attr('x1', X(12)).attr('x2', X(12)).attr('y1', m.t - 8).attr('y2', h - m.b).attr('class', 'ref')
    s.append('text').attr('x', X(12) + 6).attr('y', m.t - 2).text('Sudah 12 tahun atau lebih →')
    s.append('text').attr('x', X(12) - 6).attr('y', m.t - 2).attr('text-anchor', 'end').text('← Belum 12 tahun')
    s.append('text').attr('x', w / 2).attr('y', h - 6).attr('text-anchor', 'middle').attr('class', 'axl').text('HLS (tahun)')
    s.append('text').attr('transform', 'rotate(-90)').attr('x', -h / 2).attr('y', 12).attr('text-anchor', 'middle').attr('class', 'axl').text('Jumlah kab/kota')
  }, [geo])
  return <div ref={ref} className="chart"><svg ref={svg} viewBox={`0 0 ${w || 10} ${h}`} width="100%" /></div>
}

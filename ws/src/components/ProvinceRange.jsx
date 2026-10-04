import * as d3 from 'd3'
import { useChart } from '../hooks'
import { P, num } from '../config'
import { fmt, title } from '../stats'

// Top-k provinsi dengan jarak HLS terlebar antara kabupaten/kota tertinggi dan terendah
export default function ProvinceRange({ rows }) {
  const [ref, svg, w, h] = useChart(() => rows.length * 56 + 50, (s, w, h) => {
    const m = { t: 14, r: 18, b: 30, l: 18 }, X = d3.scaleLinear([3, 19.5], [m.l, w - m.r])
    s.append('g').attr('transform', `translate(0,${h - m.b})`).call(d3.axisBottom(X).ticks(7))
    s.append('line').attr('x1', X(12)).attr('x2', X(12)).attr('y1', m.t).attr('y2', h - m.b).attr('class', 'ref')
    rows.forEach((d, i) => {
      const y = m.t + i * 56 + 34, a = num(d.min, 'hls'), b = num(d.max, 'hls')
      s.append('text').attr('x', m.l).attr('y', y - 16).attr('class', 'axl').attr('fill', '#EEE9DF').style('fill', '#EEE9DF').text(`${title(d.prov)} · selisih ${fmt(d.spread)} th`)
      s.append('line').attr('x1', X(a)).attr('x2', X(b)).attr('y1', y).attr('y2', y).attr('class', 'span')
      s.append('circle').attr('cx', X(a)).attr('cy', y).attr('r', 6).attr('fill', '#ff6a4d')
      s.append('circle').attr('cx', X(b)).attr('cy', y).attr('r', 6).attr('fill', '#FFB162')
      s.append('text').attr('x', X(a)).attr('y', y + 20).text(`${d.min.properties[P.nama]} ${fmt(a)}`)
      s.append('text').attr('x', X(b)).attr('y', y + 20).attr('text-anchor', 'end').text(`${d.max.properties[P.nama]} ${fmt(b)}`)
    })
  }, [rows])
  return <div ref={ref} className="chart"><svg ref={svg} viewBox={`0 0 ${w || 10} ${h}`} width="100%" /></div>
}

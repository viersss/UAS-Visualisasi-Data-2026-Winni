import * as d3 from 'd3'
import { P, num } from './config'

export const fmt = (v, d = 1) => v.toFixed(d).replace('.', ',')
export const title = s => s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())

export function corr(geo, kx, log = false) {
  const pts = geo.features.map(f => [num(f, kx), num(f, 'hls')]).filter(([x, y]) => x != null && y != null && (!log || x > 0))
    .map(([x, y]) => [log ? Math.log10(x) : x, y])
  const mx = d3.mean(pts, p => p[0]), my = d3.mean(pts, p => p[1])
  return d3.sum(pts, p => (p[0] - mx) * (p[1] - my)) / Math.sqrt(d3.sum(pts, p => (p[0] - mx) ** 2) * d3.sum(pts, p => (p[1] - my) ** 2))
}

export function computeStats(geo) {
  const F = geo.features
  const hl = f => num(f, 'hls')
  const sorted = [...F].sort((a, b) => hl(a) - hl(b))
  const lo = sorted[0], hi = sorted.at(-1)
  const gaps = F.map(f => hl(f) - num(f, 'rls'))
  const prov = d3.rollups(F, v => ({ m: d3.mean(v, hl), spread: d3.max(v, hl) - d3.min(v, hl), n: v.length }), f => f.properties[P.prov])
  const byMean = [...prov].sort((a, b) => b[1].m - a[1].m)
  const widest = [...prov].filter(d => d[1].n >= 5).sort((a, b) => b[1].spread - a[1].spread)[0]
  const low10 = sorted.slice(0, 10), top10 = sorted.slice(-10)
  const clusters = [...new Set(F.map(f => String(f.properties[P.cluster])))].sort()
  const cl = {}
  clusters.forEach(c => {
    const v = F.filter(f => String(f.properties[P.cluster]) === c)
    const m = k => d3.mean(v, f => num(f, k))
    cl[c] = { n: v.length, hls: m('hls'), rls: m('rls'), miskin: m('miskin'), p1: m('p1'), pdrb: d3.median(v, f => num(f, 'pdrb')), padat: d3.median(v, f => num(f, 'kepadatan')), gap: d3.mean(v, f => hl(f) - num(f, 'rls')),
      provs: d3.rollups(v, a => a.length, f => title(f.properties[P.prov])).sort((a, b) => b[1] - a[1]).slice(0, 3) }
  })
  const gp = f => hl(f) - num(f, 'rls')
  const pr = d3.groups(F, f => f.properties[P.prov]).filter(([, v]) => v.length >= 4).map(([p, v]) => {
    const t = [...v].sort((a, b) => hl(a) - hl(b)); return { prov: p, min: t[0], max: t.at(-1), spread: hl(t.at(-1)) - hl(t[0]) }
  }).sort((a, b) => b.spread - a.spread)
  const topGap = [...F].sort((a, b) => gp(b) - gp(a)).slice(0, 8)
  const c3top = F.filter(f => String(f.properties[P.cluster]) === clusters.at(-1)).sort((a, b) => num(b, 'miskin') - num(a, 'miskin'))[0]
  return {
    pr, topGap, maxGap: topGap[0], c3top, gp, n: F.length, lo, hi, range: hl(hi) - hl(lo), ratio: hl(hi) / hl(lo),
    below12: F.filter(f => hl(f) < 12).length, teens: d3.sum(F, f => +f.properties[P.remaja12] || 0),
    gapMin: d3.min(gaps), gapMax: d3.max(gaps), gapMed: d3.median(gaps),
    provTop: byMean[0], provLow: byMean.at(-1), widest,
    low10: { hls: d3.mean(low10, hl), rls: d3.mean(low10, f => num(f, 'rls')) },
    top10: { hls: d3.mean(top10, hl), rls: d3.mean(top10, f => num(f, 'rls')) },
    cl, rMiskin: corr(geo, 'miskin'), rPdrb: corr(geo, 'pdrb', true),
  }
}

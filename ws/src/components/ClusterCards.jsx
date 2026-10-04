import { CLUSTER_TEXT } from '../config'
import { fmt } from '../stats'

// Ringkasan tiap cluster, semua angka dihitung dari data
export default function ClusterCards({ st, colorScale }) {
  return (
    <>
      {colorScale.domain().map(c => {
        const d = st.cl[c]
        return (
          <div className="ccard" key={c} style={{ borderLeftColor: colorScale(c) }}>
            <h4>Cluster {c}: {CLUSTER_TEXT[c] || ''} <small>({d.n} wilayah)</small></h4>
            <p>HLS {fmt(d.hls)} · RLS {fmt(d.rls)} · miskin {fmt(d.miskin)}% · P1 {fmt(d.p1)}</p>
            <p>Dominan di: {d.provs.map(([p, n]) => `${p} (${n})`).join(', ')}</p>
          </div>
        )
      })}
    </>
  )
}

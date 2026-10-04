import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import { GEOJSON_URL } from './config'

export function useSize() {
  const ref = useRef(null)
  const [w, setW] = useState(0)
  useEffect(() => {
    const ro = new ResizeObserver(e => setW(e[0].contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return [ref, w]
}

export function useGeo() {
  const [geo, setGeo] = useState(null)
  const [error, setError] = useState(null)
  useEffect(() => {
    fetch(GEOJSON_URL).then(r => r.json()).then(setGeo)
      .catch(() => setError(`Gagal memuat ${GEOJSON_URL}. Pastikan file ada di public/data/.`))
  }, [])
  return { geo, error }
}

// Hook umum chart D3: ukuran responsif + gambar ulang saat deps berubah
export function useChart(hFn, draw, deps = []) {
  const [ref, w] = useSize()
  const svg = useRef(null)
  const h = hFn(w)
  useEffect(() => {
    if (!w || !svg.current) return
    const s = d3.select(svg.current); s.selectAll('*').remove(); draw(s, w, h)
  }, [w, h, ...deps])
  return [ref, svg, w, h]
}

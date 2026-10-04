import { useEffect, useState } from 'react'
export default function ProgressBar() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const f = () => { const m = document.documentElement.scrollHeight - innerHeight; setP(m > 0 ? scrollY / m : 0) }
    f(); addEventListener('scroll', f, { passive: true })
    return () => removeEventListener('scroll', f)
  }, [])
  return <div className="progress"><div style={{ width: `${p * 100}%` }} /></div>
}

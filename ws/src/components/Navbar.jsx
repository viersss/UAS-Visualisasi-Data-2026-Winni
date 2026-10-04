import { useEffect, useState } from 'react'
const LINKS = [['home', 'HOME'], ['pendidikan', 'PENDIDIKAN'], ['kesenjangan', 'KESENJANGAN'], ['konteks', 'KONTEKS'], ['pola', 'POLA'], ['penutup', 'PENUTUP']]
export const goTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
export default function Navbar() {
  const [active, setActive] = useState('home')
  useEffect(() => {
    const f = () => {
      let cur = 'home'
      LINKS.forEach(([id]) => { const e = document.getElementById(id); if (e && e.getBoundingClientRect().top <= 140) cur = id })
      setActive(cur)
    }
    f(); addEventListener('scroll', f, { passive: true })
    return () => removeEventListener('scroll', f)
  }, [])
  return (
    <nav className="nav">
      {LINKS.map(([id, label]) => <button key={id} className={id === active ? 'act' : ''} onClick={() => goTo(id)}>{label}</button>)}
    </nav>
  )
}

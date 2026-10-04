import { goTo } from './Navbar'
import { img } from '../config'
export default function Hero() {
  return (
    <section id="home" className="hero" style={{ backgroundImage: `url(${img('a')})` }}>
      <div className="hero-in">
        <h1>DARI SUMATRA HINGGA PAPUA: SEBERAPA JAUH PENDIDIKAN KITA BERBEDA?</h1>
        <p>Ada cerita berbeda tentang kesempatan pendidikan di setiap sudut Indonesia</p>
        <button className="cta" onClick={() => goTo('pendidikan')}>EXPLORE NOW</button>
      </div>
    </section>
  )
}

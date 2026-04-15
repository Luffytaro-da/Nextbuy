import { Link } from 'react-router-dom';

const HeroSection = () => (
  <section className="nb-hero">
    <div className="container">
      <div className="row align-items-center g-4">
        <div className="col-12 col-lg-7">
          <div className="nb-hero-badge">🎧 New Arrivals 2025</div>
          <h1 className="mb-3">
            Premium Sound &amp;<br />
            Smart Tech — Delivered
          </h1>
          <p className="mb-4">
            Explore top headphones, speakers, wearables, gaming gear and more.
            Hand-picked products at the best prices.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <Link to="/" className="btn nb-hero-cta">
              Shop Now →
            </Link>
            <Link to="/category/headphones" className="btn nb-hero-outline">
              Browse Headphones
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="col-12 col-lg-5">
          <div className="row g-3 text-center">
            {[
              { value: '15+', label: 'Products' },
              { value: '5', label: 'Categories' },
              { value: 'Free', label: 'Shipping ₹999+' },
              { value: '24/7', label: 'Support' },
            ].map(({ value, label }) => (
              <div className="col-6" key={label}>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '12px',
                    padding: '1.1rem 0.5rem',
                  }}
                >
                  <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#fff' }}>
                    {value}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;

import { Link } from 'react-router-dom';

export default function TeamSection() {
  return (
    <div className="home-team">
      <div className="home-team-header">
        <h2 className="home-team-title">Notre Équipe</h2>
        <p className="home-team-subtitle">Les experts derrière la plateforme RenovateEnergy.</p>
      </div>
      <div className="home-team-grid">
        {/* Tayier NIMAIT */}
        <div className="home-team-card">
          <div className="home-team-avatar-container">
            <div className="home-team-avatar-inset">
              <img
                alt="Portrait de Tayier NIMAIT"
                className="home-team-avatar"
                src="/static/assets/tayier_photo_pro.jpg"
              />
            </div>
          </div>
          <h3 className="home-team-name">Tayier NIMAIT</h3>
          <p className="home-team-role">ARCHITECTE IA &amp; SYSTÈMES</p>
          <div className="home-team-socials">
            <a className="home-team-social-link" href="mailto:ntparis9@gmail.com" title="Email">
              <span className="material-symbols-outlined home-team-social-icon">mail</span>
            </a>
            <a className="home-team-social-link" href="https://github.com/ta-dev-ai/Django-enterprise-platform" target="_blank" rel="noopener noreferrer" title="GitHub">
              <span className="material-symbols-outlined home-team-social-icon">code</span>
            </a>
            <a className="home-team-social-link" href="https://linkedin.com/in/tayier-nimait" target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <span className="material-symbols-outlined home-team-social-icon">share</span>
            </a>
          </div>
          <Link to="/cv" className="home-team-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <span className="material-symbols-outlined">visibility</span> Voir mon CV
          </Link>
        </div>

        {/* Thomas Dubois */}
        <div className="home-team-card">
          <div className="home-team-avatar-container">
            <div className="home-team-avatar-inset">
              <img
                alt="Portrait de Thomas Dubois"
                className="home-team-avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHGY6KK6KaQixhBTaf2ZjRgSvxxZTCvnX8DnNmWQD5wLPCz-Lh0LzPLAq8IiObuVBZs_u5YQ36PeayS8-x1laAGjGnTPj7r60dmMYggNilGH2iLg0KNJLRS6tr3ehLrc4C1QoP0r6sbpup5nz7jHnGcdskCoJNFZRONpknCBoG2oGxEO9o5SenNngZWWcRbBWWZ2l8dllP0eyBJMv9egAKTuDJkNf-BsGFxL_oEdznCwRe5S2hG5N6m808Q1QEWV8jBFvsWR9Aeevx"
              />
            </div>
          </div>
          <h3 className="home-team-name">Thomas Dubois</h3>
          <p className="home-team-role">CHEF DE PROJET</p>
          <div className="home-team-socials">
            <a className="home-team-social-link" href="#"><span className="material-symbols-outlined home-team-social-icon">mail</span></a>
            <a className="home-team-social-link" href="#"><span className="material-symbols-outlined home-team-social-icon">call</span></a>
          </div>
          <button className="home-team-btn"><span className="material-symbols-outlined">download</span> CV</button>
        </div>

        {/* Julien Lefevre */}
        <div className="home-team-card">
          <div className="home-team-avatar-container">
            <div className="home-team-avatar-inset">
              <img
                alt="Portrait de Julien Lefevre"
                className="home-team-avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3X2zfVhvUreC0aVPWhPjeNypHiCm6-XR7W_7ZGDgWJRA5_V0j41ilZP-M8szuewrmRwTL3It2Q0raVdN7uy44Ad27OLKvQn2vrteT9INGKl_2Q_q5jQ60jtFNVfGtdrC5hzcN9pZxcV1DPvqb1B09t_8ekM2dZ0LEq-I8QFEggFmJmqSsw651Gl4W9qLvsY2N09LF62wgln8qmams0Q3UK6dc4vTyZ9XJrkPV_84CSnAyTNHFQszlk380I-JYDRXLmTxrhp1o4HJc"
              />
            </div>
          </div>
          <h3 className="home-team-name">Julien Lefevre</h3>
          <p className="home-team-role">DEV BACK-END</p>
          <div className="home-team-socials">
            <a className="home-team-social-link" href="#"><span className="material-symbols-outlined home-team-social-icon">mail</span></a>
            <a className="home-team-social-link" href="#"><span className="material-symbols-outlined home-team-social-icon">call</span></a>
          </div>
          <button className="home-team-btn"><span className="material-symbols-outlined">download</span> CV</button>
        </div>

        {/* Nicolas Moreau */}
        <div className="home-team-card">
          <div className="home-team-avatar-container">
            <div className="home-team-avatar-inset">
              <img
                alt="Portrait de Nicolas Moreau"
                className="home-team-avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLlAPnAPsEMoGDxPRDN4tNkfo1WWJyoOqTIt-fRQK6uojCurC6P7gGPRTk7TKnJYdW-8VlfZZmCtkB7GpapOO-DYYLgsMb6gND5qrnP4Tkm8Xv4CYFL6NtWfGCJg9Tlsy_fJJbhGwKFKZ2tEgP9o3XFD4dynJjG7S1xK3nxQJnBrWvbhCLTn9JFiSYRj2jQ4YRwZhMjWsG2eIZJPvp4x_If8ISlhOLKz8XZexbocvAbUsK0EmOHWcx8bCy7ydT_WtM88mMCokvgvyZ"
              />
            </div>
          </div>
          <h3 className="home-team-name">Nicolas Moreau</h3>
          <p className="home-team-role">CONCEPTEUR LOGICIEL</p>
          <div className="home-team-socials">
            <a className="home-team-social-link" href="#"><span className="material-symbols-outlined home-team-social-icon">mail</span></a>
            <a className="home-team-social-link" href="#"><span className="material-symbols-outlined home-team-social-icon">call</span></a>
          </div>
          <button className="home-team-btn"><span className="material-symbols-outlined">download</span> CV</button>
        </div>
      </div>
    </div>
  );
}

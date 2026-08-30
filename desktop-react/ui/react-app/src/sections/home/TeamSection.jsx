import { Link } from 'react-router-dom';

export default function TeamSection() {
  return (
    <section id="team" className="home-team">
      <div className="home-team-header">
        <h2 className="home-team-title">Notre Équipe</h2>
        <p className="home-team-subtitle">Les experts derrière la plateforme RenovateEnergy.</p>
      </div>

      <div className="home-team-grid">
        {/* Tayier Misahi */}
        <div className="team-profile-card">
          <div className="team-avatar-frame">
            <img
              alt="Tayier Misahi"
              className="team-avatar-img"
              src="/static/assets/tayier_photo_pro.jpg"
            />
          </div>
          <h3 className="team-member-name">Tayier Misahi</h3>
          <span className="team-member-role">Architecte IA</span>
          <div className="team-social-icons">
            <a href="mailto:contact@renovateenergy.fr" className="social-circle" title="Email">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mail</span>
            </a>
            <a href="https://www.linkedin.com/in/tayier-dev-ai-data/" target="_blank" rel="noreferrer" className="social-circle" title="LinkedIn">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>share</span>
            </a>
          </div>
          <Link to="/cv" className="team-profile-btn">
            Voir le profil <span className="arrow">&rarr;</span>
          </Link>
        </div>

        {/* Théomont Lahdet */}
        <div className="team-profile-card">
          <div className="team-avatar-frame">
            <img
              alt="Théomont Lahdet"
              className="team-avatar-img"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
            />
          </div>
          <h3 className="team-member-name">Théomont Lahdet</h3>
          <span className="team-member-role">Chef de projet</span>
          <div className="team-social-icons">
            <a href="mailto:contact@renovateenergy.fr" className="social-circle" title="Email">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mail</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-circle" title="LinkedIn">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>share</span>
            </a>
          </div>
          <Link to="/contact" className="team-profile-btn">
            Voir le profil <span className="arrow">&rarr;</span>
          </Link>
        </div>

        {/* Julien Lefevre */}
        <div className="team-profile-card">
          <div className="team-avatar-frame">
            <img
              alt="Julien Lefevre"
              className="team-avatar-img"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
            />
          </div>
          <h3 className="team-member-name">Julien Lefevre</h3>
          <span className="team-member-role">Dev Back-end</span>
          <div className="team-social-icons">
            <a href="mailto:contact@renovateenergy.fr" className="social-circle" title="Email">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mail</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-circle" title="LinkedIn">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>share</span>
            </a>
          </div>
          <Link to="/contact" className="team-profile-btn">
            Voir le profil <span className="arrow">&rarr;</span>
          </Link>
        </div>

        {/* Nathan Merveau */}
        <div className="team-profile-card">
          <div className="team-avatar-frame">
            <img
              alt="Nathan Merveau"
              className="team-avatar-img"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80"
            />
          </div>
          <h3 className="team-member-name">Nathan Merveau</h3>
          <span className="team-member-role">Concepteur Logiciel</span>
          <div className="team-social-icons">
            <a href="mailto:contact@renovateenergy.fr" className="social-circle" title="Email">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mail</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-circle" title="LinkedIn">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>share</span>
            </a>
          </div>
          <Link to="/contact" className="team-profile-btn">
            Voir le profil <span className="arrow">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';

function TeamSocialLinks({ linkedinUrl, profileTo }) {
  return (
    <div className="team-social-icons">
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noreferrer"
        className="social-circle social-circle-linkedin"
        title="LinkedIn"
      >
        in
      </a>
      <Link to={profileTo} className="social-circle" title="Voir le profil">
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
          link
        </span>
      </Link>
    </div>
  );
}

export default function TeamSection() {
  return (
    <section id="team" className="home-team">
      <div className="home-team-header">
        <h2 className="home-team-title">Notre Équipe</h2>
        <p className="home-team-subtitle">Les experts derrière la plateforme RenovateEnergy.</p>
      </div>

      <div className="home-team-grid">
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
          <TeamSocialLinks
            linkedinUrl="https://www.linkedin.com/in/tayier-dev-ai-data/"
            profileTo="/cv"
          />
          <Link to="/cv" className="team-profile-btn">
            Voir le profil <span className="arrow">&rarr;</span>
          </Link>
        </div>

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
          <TeamSocialLinks linkedinUrl="https://linkedin.com" profileTo="/contact" />
          <Link to="/contact" className="team-profile-btn">
            Voir le profil <span className="arrow">&rarr;</span>
          </Link>
        </div>

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
          <TeamSocialLinks linkedinUrl="https://linkedin.com" profileTo="/contact" />
          <Link to="/contact" className="team-profile-btn">
            Voir le profil <span className="arrow">&rarr;</span>
          </Link>
        </div>

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
          <TeamSocialLinks linkedinUrl="https://linkedin.com" profileTo="/contact" />
          <Link to="/contact" className="team-profile-btn">
            Voir le profil <span className="arrow">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

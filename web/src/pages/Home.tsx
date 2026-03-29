import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          letterSpacing: '-0.06em',
          lineHeight: 1,
          marginBottom: '1.25rem',
          color: 'var(--black)',
        }}>
          pact.
        </h1>

        <p style={{
          fontSize: '1.0625rem',
          color: 'var(--muted)',
          marginBottom: '2.5rem',
          lineHeight: 1.6,
        }}>
          Créez et faites signer vos contrats en ligne,<br />
          sans intermédiaire.
        </p>

        <Link to="/create">
          <button className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
            Créer un accord de confidentialité →
          </button>
        </Link>

        <div style={{
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border)',
        }}>
          {[
            ['Lien unique', 'Partageable en un clic'],
            ['Signature électronique', 'Par les deux parties'],
            ['Document scellé', 'Archivé définitivement'],
          ].map(([title, sub]) => (
            <div key={title} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)' }}>{title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--subtle)', marginTop: '0.2rem' }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
      <Footer />
    </div>
  );
}

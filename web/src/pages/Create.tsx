import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createContract } from '../api';
import Footer from '../components/Footer';

interface Form {
  p1Name: string;
  p1EntityType: string;
  p1Siret: string;
  p1Address: string;
  p1RepName: string;
  p1RepTitle: string;
  p2Civility: string;
  p2Name: string;
  p2Address: string;
  p2Status: string;
  p2Siren: string;
  p2Function: string;
  effectiveDate: string;
  city: string;
  documentDate: string;
}

const today = new Date().toISOString().split('T')[0];

const defaults: Form = {
  p1Name: '',
  p1EntityType: 'Entreprise individuelle',
  p1Siret: '',
  p1Address: '',
  p1RepName: '',
  p1RepTitle: 'Gérant',
  p2Civility: 'Monsieur',
  p2Name: '',
  p2Address: '',
  p2Status: 'Bénévole',
  p2Siren: '',
  p2Function: 'Développeur',
  effectiveDate: today,
  city: 'Paris',
  documentDate: today,
};

interface Result {
  id: string;
  password: string;
}

export default function Create() {
  const [form, setForm] = useState<Form>(defaults);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const set =
    (field: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createContract({
        type: 'nda',
        data: {
          party1: {
            name: form.p1Name,
            entityType: form.p1EntityType,
            siret: form.p1Siret,
            address: form.p1Address,
            representativeName: form.p1RepName,
            representativeTitle: form.p1RepTitle,
          },
          party2: {
            civility: form.p2Civility,
            name: form.p2Name,
            address: form.p2Address,
            status: form.p2Status,
            siren: form.p2Siren,
            function: form.p2Function,
          },
          effectiveDate: form.effectiveDate,
          city: form.city,
          documentDate: form.documentDate,
        },
      });
      setResult(res);
    } finally {
      setLoading(false);
    }
  }

  function copyLink() {
    const url = `${window.location.origin}/contract/${result!.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (result) {
    const url = `${window.location.origin}/contract/${result.id}`;
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ maxWidth: '480px', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: '3rem', height: '3rem',
                borderRadius: '50%',
                background: 'var(--green-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '1.25rem',
              }}>✓</div>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                Contrat créé
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9375rem' }}>
                Partagez le lien <strong>et</strong> le mot de passe avec l'autre partie.
              </p>
            </div>

            <div style={{
              background: 'var(--black)',
              color: 'var(--white)',
              borderRadius: 'var(--radius)',
              padding: '1.25rem 1.5rem',
              marginBottom: '1rem',
            }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '0.5rem' }}>
                Mot de passe
              </div>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '1.875rem', fontWeight: 700, letterSpacing: '0.12em' }}>
                {result.password}
              </div>
              <div style={{ fontSize: '0.8125rem', opacity: 0.6, marginTop: '0.5rem' }}>
                Notez-le — il ne sera plus affiché.
              </div>
            </div>

            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--subtle)', marginBottom: '0.625rem' }}>
                Lien du contrat
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <code style={{ flex: 1, fontSize: '0.8125rem', wordBreak: 'break-all', color: 'var(--muted)' }}>
                  {url}
                </code>
                <button
                  onClick={copyLink}
                  className="btn"
                  style={{
                    background: copied ? 'var(--green)' : 'var(--black)',
                    color: 'white',
                    padding: '0.4rem 0.875rem',
                    fontSize: '0.8125rem',
                    borderRadius: '6px',
                    flexShrink: 0,
                  }}
                >
                  {copied ? '✓ Copié' : 'Copier'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => navigate(`/contract/${result.id}`)}
              >
                Voir et signer →
              </button>
              <Link to="/"><button className="btn btn-ghost">Accueil</button></Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
      <div style={{ flex: 1, padding: '2rem' }}>
        <div style={{ maxWidth: '660px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <Link to="/" style={{ color: 'var(--subtle)', fontSize: '0.875rem' }}>← Retour</Link>
            <div>
              <h1 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Accord de confidentialité</h1>
              <p style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>NDA entre deux parties</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Party 1 */}
            <div className="card" style={{ marginBottom: '1rem' }}>
              <div className="section-title">La Société</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="field">
                  <label className="field-label">Nom / Raison sociale *</label>
                  <input value={form.p1Name} onChange={set('p1Name')} placeholder="Ex : JOSSELIN BRUNET" required />
                </div>
                <div className="grid-2">
                  <div className="field">
                    <label className="field-label">Type d'entité *</label>
                    <select value={form.p1EntityType} onChange={set('p1EntityType')}>
                      <option>Entreprise individuelle</option>
                      <option>SARL</option>
                      <option>SAS</option>
                      <option>SA</option>
                      <option>EURL</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">Numéro SIRET</label>
                    <input value={form.p1Siret} onChange={set('p1Siret')} placeholder="979 852 886" />
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">Adresse du siège social *</label>
                  <input value={form.p1Address} onChange={set('p1Address')} placeholder="29 RUE TRONCHET, 75008 PARIS" required />
                </div>
                <div className="grid-2">
                  <div className="field">
                    <label className="field-label">Représentant(e) *</label>
                    <input value={form.p1RepName} onChange={set('p1RepName')} placeholder="Prénom NOM" required />
                  </div>
                  <div className="field">
                    <label className="field-label">Qualité *</label>
                    <input value={form.p1RepTitle} onChange={set('p1RepTitle')} placeholder="Gérant" required />
                  </div>
                </div>
              </div>
            </div>

            {/* Party 2 */}
            <div className="card" style={{ marginBottom: '1rem' }}>
              <div className="section-title">Le Collaborateur</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '1rem' }}>
                  <div className="field">
                    <label className="field-label">Civilité</label>
                    <select value={form.p2Civility} onChange={set('p2Civility')}>
                      <option>Monsieur</option>
                      <option>Madame</option>
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">Nom complet *</label>
                    <input value={form.p2Name} onChange={set('p2Name')} placeholder="Prénom NOM" required />
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">Adresse *</label>
                  <input value={form.p2Address} onChange={set('p2Address')} placeholder="1 rue de la Paix, 75001 Paris" required />
                </div>
                <div className="grid-3">
                  <div className="field">
                    <label className="field-label">Statut *</label>
                    <select value={form.p2Status} onChange={set('p2Status')}>
                      <option>Bénévole</option>
                      <option>Salarié</option>
                      <option>Prestataire</option>
                      <option>Auto-entrepreneur</option>
                      <option>Freelance</option>
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">SIREN</label>
                    <input value={form.p2Siren} onChange={set('p2Siren')} placeholder="123 456 789" />
                  </div>
                  <div className="field">
                    <label className="field-label">Fonction *</label>
                    <input value={form.p2Function} onChange={set('p2Function')} placeholder="Développeur" required />
                  </div>
                </div>
              </div>
            </div>

            {/* Contract details */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="section-title">Détails du contrat</div>
              <div className="grid-3">
                <div className="field">
                  <label className="field-label">Date d'effet *</label>
                  <input type="date" value={form.effectiveDate} onChange={set('effectiveDate')} required />
                </div>
                <div className="field">
                  <label className="field-label">Ville *</label>
                  <input value={form.city} onChange={set('city')} placeholder="Paris" required />
                </div>
                <div className="field">
                  <label className="field-label">Date du document *</label>
                  <input type="date" value={form.documentDate} onChange={set('documentDate')} required />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ fontSize: '1rem', padding: '1rem' }}>
              {loading ? 'Génération…' : 'Générer le contrat →'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

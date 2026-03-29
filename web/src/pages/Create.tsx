import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createContract } from '../api';
import Footer from '../components/Footer';
import { templateList, type Template } from '../templates/index';

interface Result {
  id: string;
  password: string;
}

export default function Create() {
  const [selected, setSelected]   = useState<Template | null>(null);
  const [formData, setFormData]   = useState<Record<string, unknown>>({});
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState<Result | null>(null);
  const [copied, setCopied]       = useState(false);
  const navigate = useNavigate();

  function selectTemplate(t: Template) {
    setSelected(t);
    setFormData(t.defaultData());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    try {
      const res = await createContract({ type: selected.id, data: formData });
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

  /* ── Success screen ─────────────────────── */
  if (result) {
    const url = `${window.location.origin}/contract/${result.id}`;
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ maxWidth: '480px', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'var(--green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.25rem' }}>✓</div>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '0.4rem' }}>Contrat créé</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9375rem' }}>Partagez le lien <strong>et</strong> le mot de passe avec l'autre partie.</p>
            </div>

            <div style={{ background: 'var(--black)', color: 'var(--white)', borderRadius: 'var(--radius)', padding: '1.25rem 1.5rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '0.5rem' }}>Mot de passe</div>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '1.875rem', fontWeight: 700, letterSpacing: '0.12em' }}>{result.password}</div>
              <div style={{ fontSize: '0.8125rem', opacity: 0.6, marginTop: '0.5rem' }}>Notez-le — il ne sera plus affiché.</div>
            </div>

            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--subtle)', marginBottom: '0.625rem' }}>Lien du contrat</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <code style={{ flex: 1, fontSize: '0.8125rem', wordBreak: 'break-all', color: 'var(--muted)' }}>{url}</code>
                <button onClick={copyLink} className="btn" style={{ background: copied ? 'var(--green)' : 'var(--black)', color: 'white', padding: '0.4rem 0.875rem', fontSize: '0.8125rem', borderRadius: '6px', flexShrink: 0 }}>
                  {copied ? '✓ Copié' : 'Copier'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate(`/contract/${result.id}`)}>Voir et signer →</button>
              <Link to="/"><button className="btn btn-ghost">Accueil</button></Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Template picker ────────────────────── */
  if (!selected) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
        <div style={{ flex: 1, padding: '2rem' }}>
          <div style={{ maxWidth: '660px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <Link to="/" style={{ color: 'var(--subtle)', fontSize: '0.875rem' }}>← Retour</Link>
              <div>
                <h1 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Nouveau contrat</h1>
                <p style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Choisissez un type de document</p>
              </div>
            </div>

            {Object.entries(
              templateList.reduce<Record<string, typeof templateList>>((acc, t) => {
                (acc[t.category] ??= []).push(t);
                return acc;
              }, {})
            ).map(([category, group]) => (
              <div key={category} style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--subtle)', marginBottom: '0.75rem' }}>
                  {category}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                  {group.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => selectTemplate(t)}
                      style={{
                        textAlign: 'left',
                        background: 'var(--white)',
                        border: '1.5px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        padding: '1.25rem 1.5rem',
                        cursor: 'pointer',
                        transition: 'border-color 0.12s, box-shadow 0.12s',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--black)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow-sm)'; }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.4rem' }}>{t.label}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.5 }}>{t.description}</div>
                      <div style={{ marginTop: '1rem', fontSize: '0.8125rem', color: 'var(--black)', fontWeight: 500 }}>Créer →</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Form ───────────────────────────────── */
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
      <div style={{ flex: 1, padding: '2rem' }}>
        <div style={{ maxWidth: '660px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <button type="button" onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--subtle)', fontSize: '0.875rem', cursor: 'pointer', padding: 0 }}>← Retour</button>
            <div>
              <h1 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{selected.label}</h1>
              <p style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>{selected.description}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <selected.Form data={formData} onChange={setFormData} />
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

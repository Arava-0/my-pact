import React from 'react';

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export const docStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: '10.5pt',
  lineHeight: 1.75,
  color: '#1a1a1a',
};

export const articleTitle: React.CSSProperties = {
  fontFamily: 'system-ui, sans-serif',
  fontWeight: 700,
  fontSize: '9pt',
  letterSpacing: '0.05em',
  marginTop: '1.75rem',
  marginBottom: '0.75rem',
  paddingBottom: '0.3rem',
  borderBottom: '1px solid #1a1a1a',
};

export const para: React.CSSProperties = { marginBottom: '0.75rem' };
export const ul: React.CSSProperties = { paddingLeft: '1.5rem', marginBottom: '0.75rem' };
export const li: React.CSSProperties = { marginBottom: '0.3rem' };

export function SignatureBlock({ label, name, signedAt }: { label: string; name: string; signedAt: string | null }) {
  return (
    <div>
      <p style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '9pt', marginBottom: '0.75rem' }}>
        {label}
      </p>
      {signedAt ? (
        <div style={{ border: '1.5px solid var(--green)', borderRadius: '6px', padding: '0.875rem 1rem', background: 'var(--green-bg)' }}>
          <div style={{ color: 'var(--green)', fontSize: '0.8125rem', fontWeight: 600, fontFamily: 'system-ui, sans-serif', marginBottom: '0.3rem' }}>
            ✓ Signé électroniquement
          </div>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8125rem', color: '#1a1a1a', marginBottom: '0.2rem' }}>{name}</div>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: 'var(--muted)' }}>le {fmtDateTime(signedAt)}</div>
        </div>
      ) : (
        <div style={{ border: '1.5px dashed var(--border)', borderRadius: '6px', padding: '0.875rem 1rem', fontFamily: 'system-ui, sans-serif', fontSize: '0.8125rem', color: 'var(--subtle)' }}>
          Signature en attente
        </div>
      )}
    </div>
  );
}

import React from 'react';
import type { Template, FormProps, DocumentProps } from './index';
import { fmtDate, docStyle, articleTitle, para, ul, li, SignatureBlock } from './shared';

interface PrestationData {
  client: { firstName: string; lastName: string; tradeName: string; siret: string; address: string };
  provider: { firstName: string; lastName: string; siret: string; address: string };
  missions: string;
  revenueShare: number;
  paymentDeadline: number;
  durationType: 'determined' | 'undetermined';
  durationMonths: string;
  noticeDays: number;
  effectiveDate: string;
  city: string;
  documentDate: string;
}

const today = () => new Date().toISOString().split('T')[0];

function defaultData(): Record<string, unknown> {
  return {
    client: { firstName: '', lastName: '', tradeName: '', siret: '', address: '' },
    provider: { firstName: '', lastName: '', siret: '', address: '' },
    missions: 'Développement technique\nMaintenance et corrections\nParticipation à l\'amélioration des fonctionnalités',
    revenueShare: 20,
    paymentDeadline: 15,
    durationType: 'undetermined',
    durationMonths: '6',
    noticeDays: 30,
    effectiveDate: today(),
    city: '',
    documentDate: today(),
  };
}

function PrestationForm({ data, onChange }: FormProps) {
  const d = data as unknown as PrestationData;

  const setClient = (field: keyof PrestationData['client']) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...d, client: { ...d.client, [field]: e.target.value } });

  const setProvider = (field: keyof PrestationData['provider']) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...d, provider: { ...d.provider, [field]: e.target.value } });

  const setRoot = (field: keyof Omit<PrestationData, 'client' | 'provider'>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = (field === 'revenueShare' || field === 'paymentDeadline' || field === 'noticeDays')
        ? Number(e.target.value)
        : e.target.value;
      onChange({ ...d, [field]: value });
    };

  return (
    <>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="section-title">Le Client</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid-2">
            <div className="field">
              <label className="field-label">Prénom *</label>
              <input value={d.client.firstName} onChange={setClient('firstName')} placeholder="Quentin" required />
            </div>
            <div className="field">
              <label className="field-label">Nom *</label>
              <input value={d.client.lastName} onChange={setClient('lastName')} placeholder="Dupont" required />
            </div>
          </div>
          <div className="grid-2">
            <div className="field">
              <label className="field-label">Nom commercial</label>
              <input value={d.client.tradeName} onChange={setClient('tradeName')} placeholder="Emerixe" />
            </div>
            <div className="field">
              <label className="field-label">Numéro SIRET</label>
              <input value={d.client.siret} onChange={setClient('siret')} placeholder="979 852 886 00010" />
            </div>
          </div>
          <div className="field">
            <label className="field-label">Adresse *</label>
            <input value={d.client.address} onChange={setClient('address')} placeholder="1 rue de la Paix, 75001 Paris" required />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="section-title">Le Prestataire</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid-2">
            <div className="field">
              <label className="field-label">Prénom *</label>
              <input value={d.provider.firstName} onChange={setProvider('firstName')} placeholder="Albin" required />
            </div>
            <div className="field">
              <label className="field-label">Nom *</label>
              <input value={d.provider.lastName} onChange={setProvider('lastName')} placeholder="Martin" required />
            </div>
          </div>
          <div className="field">
            <label className="field-label">Numéro SIRET</label>
            <input value={d.provider.siret} onChange={setProvider('siret')} placeholder="979 852 886 00010" />
          </div>
          <div className="field">
            <label className="field-label">Adresse *</label>
            <input value={d.provider.address} onChange={setProvider('address')} placeholder="5 avenue des Lilas, 69001 Lyon" required />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="section-title">Missions</div>
        <div className="field">
          <label className="field-label">Missions du prestataire * (une par ligne)</label>
          <textarea
            value={d.missions}
            onChange={setRoot('missions')}
            required
            style={{ resize: 'vertical', minHeight: '90px' }}
          />
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="section-title">Rémunération</div>
        <div className="grid-2">
          <div className="field">
            <label className="field-label">Part du chiffre d'affaires (%)*</label>
            <input type="number" min={1} max={100} value={d.revenueShare} onChange={setRoot('revenueShare')} required />
          </div>
          <div className="field">
            <label className="field-label">Délai de paiement (jours) *</label>
            <input type="number" min={1} value={d.paymentDeadline} onChange={setRoot('paymentDeadline')} required />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="section-title">Durée et résiliation</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="field">
            <label className="field-label">Type de durée *</label>
            <select value={d.durationType} onChange={setRoot('durationType')}>
              <option value="undetermined">Indéterminée (recommandé)</option>
              <option value="determined">Déterminée</option>
            </select>
          </div>
          {d.durationType === 'determined' && (
            <div className="field" style={{ maxWidth: '200px' }}>
              <label className="field-label">Durée (mois) *</label>
              <input value={d.durationMonths} onChange={setRoot('durationMonths')} placeholder="6" required />
            </div>
          )}
          <div className="field" style={{ maxWidth: '200px' }}>
            <label className="field-label">Préavis de résiliation (jours) *</label>
            <input type="number" min={1} value={d.noticeDays} onChange={setRoot('noticeDays')} required />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="section-title">Dates et lieu</div>
        <div className="grid-3">
          <div className="field">
            <label className="field-label">Date d'effet *</label>
            <input type="date" value={d.effectiveDate} onChange={setRoot('effectiveDate')} required />
          </div>
          <div className="field">
            <label className="field-label">Ville *</label>
            <input value={d.city} onChange={setRoot('city')} placeholder="Paris" required />
          </div>
          <div className="field">
            <label className="field-label">Date du document *</label>
            <input type="date" value={d.documentDate} onChange={setRoot('documentDate')} required />
          </div>
        </div>
      </div>
    </>
  );
}

function PrestationDocument({ data, party1SignedAt, party2SignedAt }: DocumentProps) {
  const d = data as unknown as PrestationData;
  const clientName = `${d.client.firstName} ${d.client.lastName}`;
  const providerName = `${d.provider.firstName} ${d.provider.lastName}`;
  const missionLines = d.missions.split('\n').map(s => s.trim()).filter(Boolean);

  return (
    <div style={docStyle}>
      <h1 style={{ textAlign: 'center', fontFamily: 'system-ui, sans-serif', fontWeight: 800, fontSize: '12pt', letterSpacing: '0.03em', marginBottom: '0.5rem', lineHeight: 1.4 }}>
        CONTRAT DE PRESTATION DE SERVICES
      </h1>
      <p style={{ textAlign: 'center', fontFamily: 'system-ui, sans-serif', fontWeight: 600, fontSize: '9pt', letterSpacing: '0.05em', color: '#444', marginBottom: '2rem' }}>
        AVEC RÉMUNÉRATION VARIABLE INDEXÉE SUR LE CHIFFRE D'AFFAIRES
      </p>

      <hr style={{ border: 'none', borderTop: '2px solid #1a1a1a', marginBottom: '1.75rem' }} />

      <p style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '9pt', letterSpacing: '0.06em', marginBottom: '1rem' }}>ENTRE LES SOUSSIGNÉS</p>

      <p style={para}>
        <strong>{clientName},</strong><br />
        Entrepreneur individuel{d.client.tradeName ? `, exerçant sous le nom commercial <strong>${d.client.tradeName}</strong>,` : ','}<br />
        {d.client.siret && <>Immatriculé sous le numéro SIRET : <strong>{d.client.siret}</strong>,<br /></>}
        Dont le siège est situé à : <strong>{d.client.address}</strong>,<br />
        Ci-après dénommé <strong>« le Client »</strong>, <strong>ET</strong>
      </p>

      <p style={para}>
        <strong>{providerName},</strong><br />
        Entrepreneur individuel (micro-entreprise),<br />
        {d.provider.siret && <>Immatriculé sous le numéro SIRET : <strong>{d.provider.siret}</strong>,<br /></>}
        Dont le siège est situé à : <strong>{d.provider.address}</strong>,<br />
        Ci-après dénommé <strong>« le Prestataire »</strong>,
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid #d1d5db', margin: '1.5rem 0' }} />

      <p style={articleTitle}>ARTICLE 1 — OBJET</p>
      <p style={para}>Le présent contrat a pour objet de définir les conditions dans lesquelles le Prestataire intervient dans le cadre du développement, de la maintenance et/ou de l'exploitation d'un serveur de jeu en ligne exploité par le Client.</p>

      <p style={articleTitle}>ARTICLE 2 — MISSIONS DU PRESTATAIRE</p>
      <p style={para}>Le Prestataire s'engage à réaliser les missions suivantes :</p>
      <ul style={ul}>
        {missionLines.map((m, i) => <li key={i} style={li}>{m}</li>)}
      </ul>
      <p style={para}>Le Prestataire agit en totale indépendance, sans lien de subordination.</p>

      <p style={articleTitle}>ARTICLE 3 — RÉMUNÉRATION</p>
      <p style={para}>En contrepartie des prestations réalisées, le Prestataire percevra une rémunération variable définie comme suit :</p>
      <ul style={ul}>
        <li style={li}><strong>{d.revenueShare} %</strong> du chiffre d'affaires mensuel généré par le serveur,</li>
        <li style={li}>Ce chiffre d'affaires correspond aux revenus effectivement encaissés par le Client, hors frais bancaires et commissions des plateformes.</li>
      </ul>
      <p style={para}>Le Prestataire émettra une facture mensuelle correspondant au montant dû.</p>
      <p style={para}>Le paiement interviendra dans un délai de <strong>{d.paymentDeadline} jours</strong> à compter de la réception de la facture.</p>

      <p style={articleTitle}>ARTICLE 4 — ACCÈS AUX INFORMATIONS</p>
      <p style={para}>Le Client s'engage à fournir au Prestataire, de manière transparente :</p>
      <ul style={ul}>
        <li style={li}>un relevé mensuel du chiffre d'affaires du serveur ;</li>
        <li style={li}>les justificatifs si demandés (plateformes de paiement, etc.).</li>
      </ul>

      <p style={articleTitle}>ARTICLE 5 — DURÉE</p>
      <p style={para}>
        Le présent contrat est conclu pour une durée{' '}
        {d.durationType === 'determined'
          ? <><strong>déterminée de {d.durationMonths} mois</strong>.</>
          : <><strong>indéterminée</strong>.</>
        }
      </p>
      <p style={para}>Il prend effet à compter du <strong>{fmtDate(d.effectiveDate)}</strong>.</p>

      <p style={articleTitle}>ARTICLE 6 — RÉSILIATION</p>
      <p style={para}>Chaque partie peut résilier le contrat :</p>
      <ul style={ul}>
        <li style={li}>avec un préavis de <strong>{d.noticeDays} jours</strong> ;</li>
        <li style={li}>par notification écrite (email ou courrier).</li>
      </ul>
      <p style={para}>En cas de manquement grave, la résiliation peut être immédiate.</p>

      <p style={articleTitle}>ARTICLE 7 — PROPRIÉTÉ</p>
      <p style={para}>Sauf mention contraire, le serveur et l'ensemble du projet restent la propriété du Client. Le présent contrat n'accorde aucun droit de propriété ou de parts au Prestataire.</p>

      <p style={articleTitle}>ARTICLE 8 — RESPONSABILITÉS</p>
      <p style={para}>Chaque partie est responsable de ses obligations légales, fiscales et sociales. Le Prestataire est responsable de ses propres déclarations en tant que micro-entrepreneur.</p>

      <p style={articleTitle}>ARTICLE 9 — CONFORMITÉ</p>
      <p style={para}>Le Client s'engage à respecter les conditions d'utilisation de Mojang Studios concernant la monétisation du serveur.</p>

      <p style={articleTitle}>ARTICLE 10 — DROIT APPLICABLE</p>
      <p style={para}>Le présent contrat est soumis au <strong>droit français</strong>. Tout litige sera soumis aux tribunaux compétents.</p>

      <hr style={{ border: 'none', borderTop: '2px solid #1a1a1a', margin: '2rem 0 1.5rem' }} />
      <p style={{ ...para, fontFamily: 'system-ui, sans-serif' }}><strong>Fait à {d.city}, le {fmtDate(d.documentDate)}</strong></p>
      <p style={{ ...para, fontFamily: 'system-ui, sans-serif', marginBottom: '2rem' }}>En deux exemplaires originaux.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <SignatureBlock label="Le Client" name={clientName} signedAt={party1SignedAt} />
        <SignatureBlock label="Le Prestataire" name={providerName} signedAt={party2SignedAt} />
      </div>
    </div>
  );
}

export const prestation: Template = {
  id: 'prestation',
  label: 'Contrat de prestation',
  description: 'Rémunération variable indexée sur le chiffre d\'affaires.',
  party1Label: 'Le Client',
  party2Label: 'Le Prestataire',
  defaultData,
  getParty1Name: (data) => {
    const d = data as unknown as PrestationData;
    return `${d.client.firstName} ${d.client.lastName}`;
  },
  getParty2Name: (data) => {
    const d = data as unknown as PrestationData;
    return `${d.provider.firstName} ${d.provider.lastName}`;
  },
  getParty1ConsentText: (data) => {
    const d = data as unknown as PrestationData;
    return <>Je, <strong>{d.client.firstName} {d.client.lastName}</strong>, reconnais avoir lu et accepté les termes du présent contrat de prestation et le signe électroniquement en tant que Client.</>;
  },
  getParty2ConsentText: (data) => {
    const d = data as unknown as PrestationData;
    return <>Je, <strong>{d.provider.firstName} {d.provider.lastName}</strong>, reconnais avoir lu et accepté les termes du présent contrat de prestation et le signe électroniquement en tant que Prestataire.</>;
  },
  Form: PrestationForm,
  Document: PrestationDocument,
};

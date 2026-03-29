import React from 'react';
import type { Template, FormProps, DocumentProps } from './index';
import { fmtDate, docStyle, articleTitle, para, ul, li, SignatureBlock } from './shared';

interface NdaGenericData {
  party1: { name: string; entityType: string; siret: string; address: string; representativeName: string; representativeTitle: string };
  party2: { civility: string; name: string; address: string; status: string; siren: string; function: string };
  contexte: string;
  categoriesInfosConf: string;
  dureeAns: number;
  juridiction: string;
  effectiveDate: string;
  city: string;
  documentDate: string;
}

const today = () => new Date().toISOString().split('T')[0];

const DEFAULT_CATEGORIES = `Informations techniques et commerciales
Données clients et partenaires
Documents contractuels et financiers
Tout document ou information identifié comme confidentiel`;

function defaultData(): Record<string, unknown> {
  return {
    party1: { name: '', entityType: 'Entreprise individuelle', siret: '', address: '', representativeName: '', representativeTitle: 'Gérant' },
    party2: { civility: 'Monsieur', name: '', address: '', status: 'Bénévole', siren: '', function: '' },
    contexte: '',
    categoriesInfosConf: DEFAULT_CATEGORIES,
    dureeAns: 5,
    juridiction: '',
    effectiveDate: today(),
    city: '',
    documentDate: today(),
  };
}

function NdaGenericForm({ data, onChange }: FormProps) {
  const d = data as unknown as NdaGenericData;

  const setP1 = (field: keyof NdaGenericData['party1']) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onChange({ ...d, party1: { ...d.party1, [field]: e.target.value } });

  const setP2 = (field: keyof NdaGenericData['party2']) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onChange({ ...d, party2: { ...d.party2, [field]: e.target.value } });

  const set = (field: keyof Omit<NdaGenericData, 'party1' | 'party2'>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = field === 'dureeAns' ? Number(e.target.value) : e.target.value;
      onChange({ ...d, [field]: value });
    };

  return (
    <>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="section-title">La Société</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="field">
            <label className="field-label">Nom / Raison sociale *</label>
            <input value={d.party1.name} onChange={setP1('name')} placeholder="Ex : DBYFly" required />
          </div>
          <div className="grid-2">
            <div className="field">
              <label className="field-label">Type d'entité *</label>
              <select value={d.party1.entityType} onChange={setP1('entityType')}>
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
              <input value={d.party1.siret} onChange={setP1('siret')} placeholder="979 852 886" />
            </div>
          </div>
          <div className="field">
            <label className="field-label">Adresse du siège social *</label>
            <input value={d.party1.address} onChange={setP1('address')} placeholder="1 RUE DES ENTREPRENEURS, 75001 PARIS" required />
          </div>
          <div className="grid-2">
            <div className="field">
              <label className="field-label">Représentant(e) *</label>
              <input value={d.party1.representativeName} onChange={setP1('representativeName')} placeholder="Prénom NOM" required />
            </div>
            <div className="field">
              <label className="field-label">Qualité *</label>
              <input value={d.party1.representativeTitle} onChange={setP1('representativeTitle')} placeholder="Gérant" required />
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="section-title">Le Collaborateur</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '1rem' }}>
            <div className="field">
              <label className="field-label">Civilité</label>
              <select value={d.party2.civility} onChange={setP2('civility')}>
                <option>Monsieur</option>
                <option>Madame</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label">Nom complet *</label>
              <input value={d.party2.name} onChange={setP2('name')} placeholder="Prénom NOM" required />
            </div>
          </div>
          <div className="field">
            <label className="field-label">Adresse *</label>
            <input value={d.party2.address} onChange={setP2('address')} placeholder="1 rue de la Paix, 75001 Paris" required />
          </div>
          <div className="grid-3">
            <div className="field">
              <label className="field-label">Statut *</label>
              <select value={d.party2.status} onChange={setP2('status')}>
                <option>Bénévole</option>
                <option>Salarié</option>
                <option>Prestataire</option>
                <option>Auto-entrepreneur</option>
                <option>Freelance</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label">SIREN</label>
              <input value={d.party2.siren} onChange={setP2('siren')} placeholder="123 456 789" />
            </div>
            <div className="field">
              <label className="field-label">Fonction</label>
              <input value={d.party2.function} onChange={setP2('function')} placeholder="Consultant" />
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="section-title">Contenu du NDA</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="field">
            <label className="field-label">Contexte de la collaboration * (préambule)</label>
            <textarea
              value={d.contexte}
              onChange={set('contexte')}
              placeholder="Ex : Dans le cadre du lancement de leur nouveau produit, la Société est amenée à confier au Collaborateur des missions impliquant l'accès à des informations sensibles."
              required
              style={{ resize: 'vertical', minHeight: '80px' }}
            />
          </div>
          <div className="field">
            <label className="field-label">Catégories d'informations confidentielles * (une par ligne)</label>
            <textarea
              value={d.categoriesInfosConf}
              onChange={set('categoriesInfosConf')}
              required
              style={{ resize: 'vertical', minHeight: '100px' }}
            />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="section-title">Durée et juridiction</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid-3">
            <div className="field">
              <label className="field-label">Date d'effet *</label>
              <input type="date" value={d.effectiveDate} onChange={set('effectiveDate')} required />
            </div>
            <div className="field">
              <label className="field-label">Ville *</label>
              <input value={d.city} onChange={set('city')} placeholder="Paris" required />
            </div>
            <div className="field">
              <label className="field-label">Date du document *</label>
              <input type="date" value={d.documentDate} onChange={set('documentDate')} required />
            </div>
          </div>
          <div className="grid-2">
            <div className="field">
              <label className="field-label">Durée de confidentialité après fin de collaboration (ans) *</label>
              <input type="number" min={1} max={20} value={d.dureeAns} onChange={set('dureeAns')} required />
            </div>
            <div className="field">
              <label className="field-label">Juridiction (tribunaux compétents) *</label>
              <input value={d.juridiction} onChange={set('juridiction')} placeholder="Paris" required />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function NdaGenericDocument({ data, party1SignedAt, party2SignedAt }: DocumentProps) {
  const d = data as unknown as NdaGenericData;
  const { party1, party2, effectiveDate, city, documentDate } = d;
  const categories = d.categoriesInfosConf.split('\n').map(s => s.trim()).filter(Boolean);

  return (
    <div style={docStyle}>
      <h1 style={{ textAlign: 'center', fontFamily: 'system-ui, sans-serif', fontWeight: 800, fontSize: '13pt', letterSpacing: '0.04em', marginBottom: '2rem' }}>
        ACCORD DE CONFIDENTIALITÉ
      </h1>
      <hr style={{ border: 'none', borderTop: '2px solid #1a1a1a', marginBottom: '1.75rem' }} />

      <p style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '9pt', letterSpacing: '0.06em', marginBottom: '1rem' }}>ENTRE LES SOUSSIGNÉS</p>

      <p style={para}><strong>La société</strong></p>
      <p style={para}>
        <strong>{party1.name.toUpperCase()},</strong><br />
        {party1.entityType} immatriculée sous le numéro <strong>{party1.siret}</strong>,<br />
        Dont le siège social est situé <strong>{party1.address.toUpperCase()}</strong>,<br />
        Représentée par <strong>{party1.representativeName}</strong>, {party1.representativeTitle},<br />
        Ci-après dénommée <strong>« la Société »</strong>, <strong>ET</strong>
      </p>

      <p style={para}>
        <strong>{party2.civility} : {party2.name},</strong><br />
        Demeurant à : <strong>{party2.address}</strong>,<br />
        Statut : {party2.status}{party2.siren ? ` (numéro de SIREN : ${party2.siren})` : ''},{party2.function ? <><br />Fonction : <strong>{party2.function}</strong></> : null}<br />
        Ci-après dénommé <strong>« le Collaborateur »</strong>,
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid #d1d5db', margin: '1.5rem 0' }} />

      <p style={{ ...articleTitle, borderBottom: 'none', marginTop: 0 }}>PRÉAMBULE</p>
      <p style={para}>{d.contexte}</p>
      <p style={{ ...para, marginBottom: 0 }}>Il a donc été convenu ce qui suit.</p>

      <p style={articleTitle}>ARTICLE 1 – DÉFINITION DES INFORMATIONS CONFIDENTIELLES</p>
      <p style={para}>Sont considérées comme <strong>Informations Confidentielles</strong>, sans que cette liste soit limitative :</p>
      <ul style={ul}>
        {categories.map((cat, i) => <li key={i} style={li}>{cat} ;</li>)}
      </ul>
      <p style={para}>Ces informations peuvent être communiquées <strong>oralement, par écrit, sous forme numérique ou sur tout autre support</strong>.</p>

      <p style={articleTitle}>ARTICLE 2 – OBLIGATION DE CONFIDENTIALITÉ</p>
      <p style={para}>Le Collaborateur s'engage à :</p>
      <ol style={{ ...ul, listStyle: 'decimal' }}>
        <li style={li}><strong>Garder strictement confidentielles</strong> toutes les Informations Confidentielles ;</li>
        <li style={li}><strong>Ne pas les divulguer</strong>, directement ou indirectement, à des tiers, sans autorisation écrite préalable de la Société ;</li>
        <li style={li}><strong>Ne les utiliser que dans le strict cadre de sa mission</strong> pour la Société ;</li>
        <li style={li}><strong>Ne pas les exploiter à des fins personnelles ou pour le compte d'un tiers</strong>.</li>
      </ol>

      <p style={articleTitle}>ARTICLE 3 – PROTECTION DES INFORMATIONS</p>
      <p style={para}>Le Collaborateur s'engage à :</p>
      <ul style={ul}>
        <li style={li}>mettre en œuvre toutes les mesures raisonnables de sécurité pour protéger les Informations Confidentielles ;</li>
        <li style={li}>ne pas copier, reproduire ou conserver lesdites informations au-delà de ce qui est strictement nécessaire à l'exécution de sa mission ;</li>
        <li style={li}>restituer ou supprimer l'ensemble des supports contenant des Informations Confidentielles à la fin de la mission ou sur simple demande de la Société.</li>
      </ul>

      <p style={articleTitle}>ARTICLE 4 – PROPRIÉTÉ DES INFORMATIONS</p>
      <p style={para}>Toutes les Informations Confidentielles demeurent <strong>la propriété exclusive de la Société</strong>.</p>
      <p style={para}>Aucune disposition du présent accord ne saurait être interprétée comme conférant au Collaborateur un quelconque droit de propriété intellectuelle ou d'usage autonome.</p>

      <p style={articleTitle}>ARTICLE 5 – EXCLUSIONS</p>
      <p style={para}>Les obligations de confidentialité ne s'appliquent pas aux informations :</p>
      <ul style={ul}>
        <li style={li}>tombées dans le domaine public sans faute du Collaborateur ;</li>
        <li style={li}>déjà connues du Collaborateur de manière légitime avant leur communication ;</li>
        <li style={li}>obtenues légalement auprès d'un tiers autorisé à les divulguer.</li>
      </ul>

      <p style={articleTitle}>ARTICLE 6 – DURÉE</p>
      <p style={para}>Le présent accord prend effet à compter du <strong>{fmtDate(effectiveDate)}</strong>.</p>
      <p style={para}>
        L'obligation de confidentialité demeure en vigueur{' '}
        <strong>pendant toute la durée de la collaboration et pendant une durée de {d.dureeAns === 1 ? 'un (1) an' : `${d.dureeAns === 2 ? 'deux' : d.dureeAns === 3 ? 'trois' : d.dureeAns === 4 ? 'quatre' : d.dureeAns === 5 ? 'cinq' : d.dureeAns} (${d.dureeAns}) ans`} après sa cessation</strong>,
        {' '}sauf si les Informations Confidentielles tombent dans le domaine public plus tôt.
      </p>

      <p style={articleTitle}>ARTICLE 7 – MUTATION OU CHANGEMENT DE STATUT</p>
      <p style={para}>Le présent accord demeure applicable en cas de modification du statut du Collaborateur ou de poursuite de la collaboration sous une autre forme contractuelle.</p>

      <p style={articleTitle}>ARTICLE 8 – DROIT APPLICABLE ET JURIDICTION</p>
      <p style={para}>Le présent accord est soumis au <strong>droit français</strong>.</p>
      <p style={para}>Tout litige relatif à son interprétation ou à son exécution relève de la compétence exclusive des <strong>tribunaux de {d.juridiction}</strong>.</p>

      <hr style={{ border: 'none', borderTop: '2px solid #1a1a1a', margin: '2rem 0 1.5rem' }} />
      <p style={{ ...para, fontFamily: 'system-ui, sans-serif' }}><strong>Document créé à {city}, le {fmtDate(documentDate)}</strong></p>
      <p style={{ ...para, fontFamily: 'system-ui, sans-serif', marginBottom: '2rem' }}>En un unique exemplaire non-modifiable en ligne.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <SignatureBlock label="La Société" name={party1.representativeName} signedAt={party1SignedAt} />
        <SignatureBlock label="Le Collaborateur" name={`${party2.civility} ${party2.name}`} signedAt={party2SignedAt} />
      </div>
    </div>
  );
}

export const ndaGeneric: Template = {
  id: 'nda-generic',
  category: 'Accord de confidentialité',
  label: 'NDA — Générique',
  description: 'Contexte et catégories d\'informations confidentielles entièrement libres. Adaptable à tout secteur d\'activité.',
  party1Label: 'La Société',
  party2Label: 'Le Collaborateur',
  defaultData,
  getParty1Name: (data) => (data as unknown as NdaGenericData).party1.representativeName,
  getParty2Name: (data) => {
    const d = data as unknown as NdaGenericData;
    return `${d.party2.civility} ${d.party2.name}`;
  },
  getParty1ConsentText: (data) => {
    const d = data as unknown as NdaGenericData;
    return <>Je, <strong>{d.party1.representativeName}</strong>, reconnais avoir lu et accepté les termes de cet accord de confidentialité et le signe électroniquement en tant que représentant de <strong>{d.party1.name}</strong>.</>;
  },
  getParty2ConsentText: (data) => {
    const d = data as unknown as NdaGenericData;
    return <>Je, <strong>{d.party2.civility} {d.party2.name}</strong>, reconnais avoir lu et accepté les termes de cet accord de confidentialité et le signe électroniquement.</>;
  },
  Form: NdaGenericForm,
  Document: NdaGenericDocument,
};

import type { ContractData } from '../api';

interface Props {
  data: ContractData['data'];
  party1SignedAt: string | null;
  party2SignedAt: string | null;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const doc: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: '10.5pt',
  lineHeight: 1.75,
  color: '#1a1a1a',
};

const articleTitle: React.CSSProperties = {
  fontFamily: 'system-ui, sans-serif',
  fontWeight: 700,
  fontSize: '9pt',
  letterSpacing: '0.05em',
  marginTop: '1.75rem',
  marginBottom: '0.75rem',
  paddingBottom: '0.3rem',
  borderBottom: '1px solid #1a1a1a',
};

const para: React.CSSProperties = { marginBottom: '0.75rem' };
const ul: React.CSSProperties = { paddingLeft: '1.5rem', marginBottom: '0.75rem' };
const li: React.CSSProperties = { marginBottom: '0.3rem' };

export default function NdaDocument({ data, party1SignedAt, party2SignedAt }: Props) {
  const { party1, party2, effectiveDate, city, documentDate } = data;

  return (
    <div style={doc}>
      <h1 style={{
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
        fontWeight: 800,
        fontSize: '13pt',
        letterSpacing: '0.04em',
        marginBottom: '2rem',
      }}>
        ACCORD DE CONFIDENTIALITÉ
      </h1>

      <hr style={{ border: 'none', borderTop: '2px solid #1a1a1a', marginBottom: '1.75rem' }} />

      <p style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '9pt', letterSpacing: '0.06em', marginBottom: '1rem' }}>
        ENTRE LES SOUSSIGNÉS
      </p>

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
        Statut : {party2.status}{party2.siren ? ` (numéro de SIREN : ${party2.siren})` : ''},<br />
        Fonction : <strong>{party2.function}</strong><br />
        Ci-après dénommé <strong>« le Collaborateur »</strong>,
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid #d1d5db', margin: '1.5rem 0' }} />

      <p style={{ ...articleTitle, borderBottom: 'none', marginTop: 0 }}>PRÉAMBULE</p>

      <p style={para}>
        Dans le cadre de ses activités, la Société est amenée à confier au Collaborateur des
        missions de <strong>développement informatique</strong>, impliquant l'accès à des informations
        sensibles, techniques et stratégiques.
      </p>
      <p style={para}>
        Ces informations nécessitent une protection particulière afin d'éviter toute utilisation
        ou divulgation non autorisée.
      </p>
      <p style={{ ...para, marginBottom: '0' }}>Il a donc été convenu ce qui suit.</p>

      <p style={articleTitle}>ARTICLE 1 – DÉFINITION DES INFORMATIONS CONFIDENTIELLES</p>

      <p style={para}>Sont considérées comme <strong>Informations Confidentielles</strong>, sans que cette liste soit limitative :</p>
      <ul style={ul}>
        <li style={li}>le code source, code objet, scripts, bibliothèques, algorithmes, API, architectures logicielles ;</li>
        <li style={li}>les bases de données, schémas, modèles, structures et contenus ;</li>
        <li style={li}>les spécifications fonctionnelles et techniques ;</li>
        <li style={li}>les méthodes de développement, outils internes, environnements, procédures ;</li>
        <li style={li}>les informations commerciales, financières, contractuelles ou stratégiques ;</li>
        <li style={li}>les données clients, utilisateurs ou partenaires ;</li>
        <li style={li}>toute information identifiée comme confidentielle ou dont le caractère confidentiel est raisonnablement identifiable.</li>
      </ul>
      <p style={para}>
        Ces informations peuvent être communiquées{' '}
        <strong>oralement, par écrit, sous forme numérique ou sur tout autre support</strong>.
      </p>

      <p style={articleTitle}>ARTICLE 2 – OBLIGATION DE CONFIDENTIALITÉ</p>

      <p style={para}>Le Collaborateur s'engage à :</p>
      <ol style={{ ...ul, listStyle: 'decimal' }}>
        <li style={li}><strong>Garder strictement confidentielles</strong> toutes les Informations Confidentielles ;</li>
        <li style={li}><strong>Ne pas les divulguer</strong>, directement ou indirectement, à des tiers, sans autorisation écrite préalable de la Société ;</li>
        <li style={li}><strong>Ne les utiliser que dans le strict cadre de sa mission</strong> pour la Société ;</li>
        <li style={li}><strong>Ne pas les exploiter à des fins personnelles ou pour le compte d'un tiers</strong>. Est considéré comme tiers toute personne physique ou morale autre que la Société.</li>
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
      <p style={para}>
        Aucune disposition du présent accord ne saurait être interprétée comme conférant au Collaborateur
        un quelconque droit de propriété intellectuelle ou d'usage autonome.
      </p>

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
        <strong>pendant toute la durée de la collaboration et pendant une durée de cinq (5) ans après sa cessation</strong>,
        sauf si les Informations Confidentielles tombent dans le domaine public plus tôt.
      </p>

      <p style={articleTitle}>ARTICLE 7 – MUTATION OU CHANGEMENT DE STATUT</p>

      <p style={para}>
        Le présent accord demeure applicable en cas de modification du statut du Collaborateur ou
        de poursuite de la collaboration sous une autre forme contractuelle.
      </p>

      <p style={articleTitle}>ARTICLE 8 – DROIT APPLICABLE ET JURIDICTION</p>

      <p style={para}>Le présent accord est soumis au <strong>droit français</strong>.</p>
      <p style={para}>
        Tout litige relatif à son interprétation ou à son exécution relève de la compétence
        exclusive des <strong>tribunaux de Paris</strong>.
      </p>

      <hr style={{ border: 'none', borderTop: '2px solid #1a1a1a', margin: '2rem 0 1.5rem' }} />

      <p style={{ ...para, fontFamily: 'system-ui, sans-serif' }}>
        <strong>Fait à {city}, le {fmtDate(documentDate)}</strong>
      </p>
      <p style={{ ...para, fontFamily: 'system-ui, sans-serif', marginBottom: '2rem' }}>
        En deux exemplaires originaux.
      </p>

      {/* Signature blocks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <SignatureBlock
          label="La Société"
          name={party1.representativeName}
          signedAt={party1SignedAt}
        />
        <SignatureBlock
          label="Le Collaborateur"
          name={`${party2.civility} ${party2.name}`}
          signedAt={party2SignedAt}
        />
      </div>
    </div>
  );
}

function SignatureBlock({ label, name, signedAt }: { label: string; name: string; signedAt: string | null }) {
  return (
    <div>
      <p style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '9pt', marginBottom: '0.75rem' }}>
        {label}
      </p>
      {signedAt ? (
        <div style={{
          border: '1.5px solid var(--green)',
          borderRadius: '6px',
          padding: '0.875rem 1rem',
          background: 'var(--green-bg)',
        }}>
          <div style={{ color: 'var(--green)', fontSize: '0.8125rem', fontWeight: 600, fontFamily: 'system-ui, sans-serif', marginBottom: '0.3rem' }}>
            ✓ Signé électroniquement
          </div>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8125rem', color: '#1a1a1a', marginBottom: '0.2rem' }}>
            {name}
          </div>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: 'var(--muted)' }}>
            le {fmtDateTime(signedAt)}
          </div>
        </div>
      ) : (
        <div style={{
          border: '1.5px dashed var(--border)',
          borderRadius: '6px',
          padding: '0.875rem 1rem',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '0.8125rem',
          color: 'var(--subtle)',
        }}>
          Signature en attente
        </div>
      )}
    </div>
  );
}

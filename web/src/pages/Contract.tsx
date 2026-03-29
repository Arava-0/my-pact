import { useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getContract, signContract, uploadFile, deleteFile, openFile, type ContractData, type FileAttachment } from '../api';
import NdaDocument from '../components/NdaDocument';
import Footer from '../components/Footer';

function statusBadge(status: ContractData['status']) {
  if (status === 'completed')
    return <span className="badge badge-done">✓ Signé par les deux parties</span>;
  if (status === 'party1_signed')
    return <span className="badge badge-pending">En attente de la 2ème signature</span>;
  return <span className="badge badge-draft">En attente de signature</span>;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default function Contract() {
  const { id } = useParams<{ id: string }>();
  const [pwdInput, setPwdInput]   = useState('');
  const [password, setPassword]   = useState('');
  const [contract, setContract]   = useState<ContractData | null>(null);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [signing, setSigning]     = useState(false);
  const [agreed, setAgreed]       = useState(false);
  const [signError, setSignError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await getContract(id!, pwdInput.trim().toUpperCase());
      setContract(data);
      setPassword(pwdInput.trim().toUpperCase());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg === 'wrong_password') setError('Mot de passe incorrect.');
      else if (msg === 'not_found')  setError('Contrat introuvable.');
      else                           setError('Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  }

  async function sign(party: 'party1' | 'party2') {
    setSigning(true);
    setSignError('');
    try {
      setContract(await signContract(id!, password, party));
      setAgreed(false);
    } catch {
      setSignError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSigning(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setUploading(true);
    setUploadError('');
    try {
      setContract(await uploadFile(id!, password, file));
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Erreur lors de l\'upload.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteFile(fileId: string) {
    setUploadError('');
    try {
      setContract(await deleteFile(id!, password, fileId));
    } catch {
      setUploadError('Erreur lors de la suppression.');
    }
  }

  async function handleOpenFile(fileId: string) {
    try {
      await openFile(id!, password, fileId);
    } catch {
      setUploadError('Impossible d\'ouvrir le fichier.');
    }
  }

  /* ── Password gate ─────────────────────── */
  if (!contract) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ maxWidth: '360px', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <Link to="/" style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.05em', color: 'var(--black)' }}>
                pact.
              </Link>
              <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', marginTop: '0.75rem' }}>
                Entrez le mot de passe pour accéder au contrat.
              </p>
            </div>

            <form onSubmit={unlock} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="field">
                <label className="field-label">Mot de passe</label>
                <input
                  type="text"
                  value={pwdInput}
                  onChange={(e) => setPwdInput(e.target.value.toUpperCase())}
                  placeholder="XXXX-XXXX"
                  autoFocus
                  autoComplete="off"
                  style={{
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: '1.25rem',
                    letterSpacing: '0.12em',
                    textAlign: 'center',
                    padding: '0.875rem',
                  }}
                />
                {error && <p className="error-text">{error}</p>}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading || !pwdInput.trim()}
                style={{ fontSize: '1rem', padding: '0.875rem' }}
              >
                {loading ? '…' : 'Accéder →'}
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { status } = contract;
  const canSignParty1 = status === 'draft';
  const canSignParty2 = status === 'party1_signed';
  const editable      = status !== 'completed';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '1.5rem', paddingBottom: '2.5rem' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>

          {/* Top bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--black)' }}>
              pact.
            </Link>
            {statusBadge(status)}
          </div>

          {/* Document */}
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)',
            padding: 'clamp(2rem, 6vw, 4.5rem)',
            marginBottom: '1.25rem',
          }}>
            <NdaDocument
              data={contract.data}
              party1SignedAt={contract.party1SignedAt}
              party2SignedAt={contract.party2SignedAt}
            />
          </div>

          {/* Attachments */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div className="section-title">Documents joints</div>

            {contract.files.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                {contract.files.map((file) => (
                  <FileRow
                    key={file.id}
                    file={file}
                    editable={editable}
                    onOpen={() => handleOpenFile(file.id)}
                    onDelete={() => handleDeleteFile(file.id)}
                  />
                ))}
              </div>
            )}

            {uploadError && <p className="error-text" style={{ marginBottom: '0.75rem' }}>{uploadError}</p>}

            {editable && (
              <>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ fontSize: '0.875rem' }}
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? 'Envoi…' : '+ Joindre un document'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </>
            )}

            {!editable && contract.files.length === 0 && (
              <p style={{ fontSize: '0.875rem', color: 'var(--subtle)' }}>Aucun document joint.</p>
            )}
          </div>

          {/* Signing panel */}
          {editable && (
            <div className="card">
              {canSignParty1 && (
                <SigningPanel
                  title={`Signature de ${contract.data.party1.representativeName}`}
                  subtitle="La Société"
                  consentText={
                    <>
                      Je, <strong>{contract.data.party1.representativeName}</strong>, reconnais avoir lu et
                      accepté les termes de cet accord de confidentialité et le signe électroniquement en
                      tant que représentant de <strong>{contract.data.party1.name}</strong>.
                    </>
                  }
                  agreed={agreed}
                  onToggle={() => setAgreed((v) => !v)}
                  onSign={() => sign('party1')}
                  signing={signing}
                  error={signError}
                />
              )}

              {canSignParty2 && (
                <div>
                  <div style={{
                    fontSize: '0.8125rem', color: 'var(--green)', fontWeight: 500,
                    marginBottom: '1.25rem', paddingBottom: '1.25rem',
                    borderBottom: '1px solid var(--border)',
                  }}>
                    ✓ La Société a signé le{' '}
                    {new Date(contract.party1SignedAt!).toLocaleDateString('fr-FR', {
                      day: '2-digit', month: 'long', year: 'numeric',
                    })}
                  </div>
                  <SigningPanel
                    title={`Signature de ${contract.data.party2.civility} ${contract.data.party2.name}`}
                    subtitle="Le Collaborateur"
                    consentText={
                      <>
                        Je, <strong>{contract.data.party2.civility} {contract.data.party2.name}</strong>,
                        reconnais avoir lu et accepté les termes de cet accord de confidentialité et le
                        signe électroniquement.
                      </>
                    }
                    agreed={agreed}
                    onToggle={() => setAgreed((v) => !v)}
                    onSign={() => sign('party2')}
                    signing={signing}
                    error={signError}
                  />
                </div>
              )}
            </div>
          )}

          {status === 'completed' && (
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--green)', fontWeight: 600, fontSize: '1rem', marginBottom: '0.4rem' }}>
                ✓ Document signé par les deux parties
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
                Complété le{' '}
                {new Date(contract.completedAt!).toLocaleDateString('fr-FR', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                })}
                . Ce document est archivé et ne peut plus être modifié.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function FileRow({
  file,
  editable,
  onOpen,
  onDelete,
}: {
  file: FileAttachment;
  editable: boolean;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const isPdf = file.mimetype === 'application/pdf';
  const isImg = file.mimetype.startsWith('image/');

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.625rem 0.875rem',
      background: 'var(--surface)',
      borderRadius: '6px',
      border: '1px solid var(--border)',
    }}>
      <span style={{ fontSize: '1rem', flexShrink: 0, color: 'var(--muted)' }}>
        {isPdf ? '▤' : isImg ? '▨' : '▪'}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {file.originalName}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--subtle)' }}>
          {formatSize(file.size)} · {new Date(file.uploadedAt).toLocaleDateString('fr-FR')}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
        <button
          onClick={onOpen}
          className="btn btn-ghost"
          style={{ fontSize: '0.8125rem', padding: '0.3rem 0.7rem' }}
        >
          Ouvrir
        </button>
        {editable && (
          <button
            onClick={onDelete}
            className="btn"
            style={{ fontSize: '0.8125rem', padding: '0.3rem 0.7rem', background: 'transparent', color: 'var(--red)', border: '1px solid var(--border)' }}
          >
            Supprimer
          </button>
        )}
      </div>
    </div>
  );
}

function SigningPanel({
  title, subtitle, consentText, agreed, onToggle, onSign, signing, error,
}: {
  title: string; subtitle: string; consentText: React.ReactNode;
  agreed: boolean; onToggle: () => void; onSign: () => void;
  signing: boolean; error: string;
}) {
  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{title}</div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>{subtitle}</div>
      </div>

      <label style={{
        display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer',
        marginBottom: '1.25rem', padding: '1rem', background: 'var(--surface)',
        borderRadius: '6px', border: `1.5px solid ${agreed ? 'var(--black)' : 'var(--border)'}`,
        transition: 'border-color 0.12s',
      }}>
        <input type="checkbox" checked={agreed} onChange={onToggle} style={{ marginTop: '0.15rem' }} />
        <span style={{ fontSize: '0.875rem', color: 'var(--ink)', lineHeight: 1.6 }}>{consentText}</span>
      </label>

      {error && <p className="error-text" style={{ marginBottom: '0.75rem' }}>{error}</p>}

      <button className="btn btn-primary" onClick={onSign} disabled={!agreed || signing} style={{ minWidth: '180px' }}>
        {signing ? '…' : 'Signer le document'}
      </button>
    </div>
  );
}

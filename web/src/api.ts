const BASE = '/api';

export interface FileAttachment {
  id: string;
  originalName: string;
  mimetype: string;
  size: number;
  uploadedAt: string;
}

export interface ContractData {
  id: string;
  type: string;
  status: 'draft' | 'party1_signed' | 'completed';
  data: {
    party1: {
      name: string;
      entityType: string;
      siret: string;
      address: string;
      representativeName: string;
      representativeTitle: string;
    };
    party2: {
      civility: string;
      name: string;
      address: string;
      status: string;
      siren: string;
      function: string;
    };
    effectiveDate: string;
    city: string;
    documentDate: string;
  };
  files: FileAttachment[];
  party1SignedAt: string | null;
  party2SignedAt: string | null;
  createdAt: string;
  completedAt: string | null;
}

export async function createContract(body: { type: string; data: unknown }): Promise<{ id: string; password: string }> {
  const res = await fetch(`${BASE}/contracts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getContract(id: string, password: string): Promise<ContractData> {
  const res = await fetch(`${BASE}/contracts/${id}`, {
    headers: { 'x-password': password },
  });
  if (res.status === 401) throw new Error('wrong_password');
  if (res.status === 404) throw new Error('not_found');
  if (!res.ok) throw new Error('fetch_error');
  return res.json();
}

export async function signContract(id: string, password: string, party: 'party1' | 'party2'): Promise<ContractData> {
  const res = await fetch(`${BASE}/contracts/${id}/sign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-password': password },
    body: JSON.stringify({ party }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function uploadFile(id: string, password: string, file: File): Promise<ContractData> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE}/contracts/${id}/files`, {
    method: 'POST',
    headers: { 'x-password': password },
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteFile(id: string, password: string, fileId: string): Promise<ContractData> {
  const res = await fetch(`${BASE}/contracts/${id}/files/${fileId}`, {
    method: 'DELETE',
    headers: { 'x-password': password },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function openFile(id: string, password: string, fileId: string): Promise<void> {
  const res = await fetch(`${BASE}/contracts/${id}/files/${fileId}`, {
    headers: { 'x-password': password },
  });
  if (!res.ok) throw new Error('File not found');
  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

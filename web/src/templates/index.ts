import type { ReactNode, FC } from 'react';
import { nda } from './nda';
import { prestation } from './prestation';

export interface FormProps {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}

export interface DocumentProps {
  data: Record<string, unknown>;
  party1SignedAt: string | null;
  party2SignedAt: string | null;
}

export interface Template {
  id: string;
  label: string;
  description: string;
  party1Label: string;
  party2Label: string;
  defaultData: () => Record<string, unknown>;
  getParty1Name: (data: Record<string, unknown>) => string;
  getParty2Name: (data: Record<string, unknown>) => string;
  getParty1ConsentText: (data: Record<string, unknown>) => ReactNode;
  getParty2ConsentText: (data: Record<string, unknown>) => ReactNode;
  Form: FC<FormProps>;
  Document: FC<DocumentProps>;
}

export const templates: Record<string, Template> = { nda, prestation };
export const templateList: Template[] = [nda, prestation];

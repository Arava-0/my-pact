import { Schema, model } from 'mongoose';

export interface FileAttachment {
  id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  uploadedAt: Date;
}

export interface IContract {
  _id: string;
  passwordHash: string;
  type: string;
  status: 'draft' | 'party1_signed' | 'completed';
  data: Record<string, unknown>;
  files: FileAttachment[];
  party1SignedAt: Date | null;
  party1SignedIp: string | null;
  party2SignedAt: Date | null;
  party2SignedIp: string | null;
  createdAt: Date;
  completedAt: Date | null;
  expiresAt: Date | null;
}

const fileSchema = new Schema<FileAttachment>(
  {
    id:           { type: String, required: true },
    originalName: { type: String, required: true },
    filename:     { type: String, required: true },
    mimetype:     { type: String, required: true },
    size:         { type: Number, required: true },
    uploadedAt:   { type: Date,   default: Date.now },
  },
  { _id: false }
);

const contractSchema = new Schema<IContract>(
  {
    _id:           { type: String, required: true },
    passwordHash:  { type: String, required: true },
    type:          { type: String, default: 'nda' },
    status:        { type: String, enum: ['draft', 'party1_signed', 'completed'], default: 'draft' },
    data:          { type: Schema.Types.Mixed, required: true },
    files:         { type: [fileSchema], default: [] },
    party1SignedAt: { type: Date,   default: null },
    party1SignedIp: { type: String, default: null },
    party2SignedAt: { type: Date,   default: null },
    party2SignedIp: { type: String, default: null },
    completedAt:   { type: Date,   default: null },
    expiresAt:     { type: Date,   default: null },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false },
  }
);

contractSchema.set('toJSON', {
  versionKey: false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.passwordHash;
    return ret;
  },
});

export const Contract = model<IContract>('Contract', contractSchema, 'contracts');

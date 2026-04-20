import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INote extends Document {
  leadId: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      index: true,
    },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const Note = mongoose.model<INote>('Note', NoteSchema);

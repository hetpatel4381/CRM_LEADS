import mongoose from 'mongoose';
import { Note, INote } from '../models/Note.model';
import { CreateNoteDto } from '@crm/shared';
import { leadService } from './lead.service';

export class NoteService {
  async create(leadId: string, data: CreateNoteDto): Promise<INote> {
    await leadService.findById(leadId);
    const note = new Note({ leadId: new mongoose.Types.ObjectId(leadId), content: data.content });
    return note.save();
  }

  async findByLeadId(leadId: string): Promise<INote[]> {
    await leadService.findById(leadId);
    return Note.find({ leadId }).sort({ createdAt: -1 }).lean() as unknown as INote[];
  }
}

export const noteService = new NoteService();

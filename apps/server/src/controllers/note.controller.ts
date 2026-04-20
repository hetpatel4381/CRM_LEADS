import { Request, Response, NextFunction } from 'express';
import { noteService } from '../services/note.service';
import { sendSuccess } from '../utils/apiResponse';

export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const note = await noteService.create(req.params.id, req.body);
    sendSuccess(res, note, 'Note added successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notes = await noteService.findByLeadId(req.params.id);
    sendSuccess(res, notes);
  } catch (err) {
    next(err);
  }
};

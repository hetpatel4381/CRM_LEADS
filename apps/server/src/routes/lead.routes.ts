import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
} from '../controllers/lead.controller';
import { createNote, getNotes } from '../controllers/note.controller';
import { validateBody } from '../middlewares/validate';
import {
  createLeadSchema,
  updateLeadSchema,
  updateLeadStatusSchema,
  createNoteSchema,
} from '@crm/shared';

const router = Router();

router.post('/', validateBody(createLeadSchema), createLead);
router.get('/', getLeads);
router.get('/:id', getLeadById);
router.put('/:id', validateBody(updateLeadSchema), updateLead);
router.patch('/:id/status', validateBody(updateLeadStatusSchema), updateLeadStatus);
router.delete('/:id', deleteLead);

router.post('/:id/notes', validateBody(createNoteSchema), createNote);
router.get('/:id/notes', getNotes);

export default router;

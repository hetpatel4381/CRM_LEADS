import { z } from 'zod';
import { LeadStatus, LeadSource, PropertyType } from './enums';

export const createLeadSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone is required')
    .regex(/^[+]?[\d\s\-()]{7,15}$/, 'Invalid phone number format'),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  budget: z
    .number({ invalid_type_error: 'Budget must be a number' })
    .positive('Budget must be a positive number'),
  location: z.string().trim().min(1, 'Location is required').max(200),
  propertyType: z.nativeEnum(PropertyType, {
    errorMap: () => ({ message: 'Invalid property type' }),
  }),
  source: z.nativeEnum(LeadSource, {
    errorMap: () => ({ message: 'Invalid lead source' }),
  }),
});

export const updateLeadSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[\d\s\-()]{7,15}$/, 'Invalid phone number format')
    .optional(),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  budget: z.number().positive('Budget must be a positive number').optional(),
  location: z.string().trim().min(1).max(200).optional(),
  propertyType: z.nativeEnum(PropertyType).optional(),
  source: z.nativeEnum(LeadSource).optional(),
});

export const updateLeadStatusSchema = z.object({
  status: z.nativeEnum(LeadStatus, {
    errorMap: () => ({ message: 'Invalid status value' }),
  }),
});

export const createNoteSchema = z.object({
  content: z.string().trim().min(1, 'Note content cannot be empty').max(2000),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;

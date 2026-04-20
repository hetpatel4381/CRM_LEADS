import { Request, Response, NextFunction } from 'express';
import { leadService } from '../services/lead.service';
import { sendSuccess } from '../utils/apiResponse';
import { LeadFilters } from '@crm/shared';

export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await leadService.create(req.body);
    sendSuccess(res, lead, 'Lead created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters: LeadFilters = {
      search: req.query.search as string | undefined,
      source: req.query.source as LeadFilters['source'],
      status: req.query.status as LeadFilters['status'],
      sortBy: (req.query.sortBy as LeadFilters['sortBy']) || 'createdAt',
      sortOrder: (req.query.sortOrder as LeadFilters['sortOrder']) || 'desc',
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
    };
    const result = await leadService.findAll(filters);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

export const getLeadById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await leadService.findById(req.params.id);
    sendSuccess(res, lead);
  } catch (err) {
    next(err);
  }
};

export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await leadService.update(req.params.id, req.body);
    sendSuccess(res, lead, 'Lead updated successfully');
  } catch (err) {
    next(err);
  }
};

export const updateLeadStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await leadService.updateStatus(req.params.id, req.body);
    sendSuccess(res, lead, 'Status updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await leadService.delete(req.params.id);
    sendSuccess(res, null, 'Lead deleted successfully');
  } catch (err) {
    next(err);
  }
};

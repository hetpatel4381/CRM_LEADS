import mongoose from 'mongoose';
import { Lead, ILead } from '../models/Lead.model';
import {
  CreateLeadDto,
  UpdateLeadDto,
  UpdateLeadStatusDto,
  LeadFilters,
  PaginatedLeads,
} from '@crm/shared';

export class LeadService {
  async create(data: CreateLeadDto): Promise<ILead> {
    const existing = await Lead.findOne({ phone: data.phone });
    if (existing) {
      const err = new Error('A lead with this phone number already exists') as Error & { statusCode: number };
      err.statusCode = 409;
      throw err;
    }
    const lead = new Lead({
      ...data,
      email: data.email || undefined,
    });
    return lead.save();
  }

  async findAll(filters: LeadFilters): Promise<PaginatedLeads> {
    const {
      search,
      source,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = filters;

    const query: mongoose.FilterQuery<ILead> = {};

    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [{ name: regex }, { phone: regex }];
    }

    if (source) query.source = source;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const sortDir = sortOrder === 'asc' ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort({ [sortBy]: sortDir })
        .skip(skip)
        .limit(limit)
        .lean(),
      Lead.countDocuments(query),
    ]);

    return {
      leads: leads as unknown as PaginatedLeads['leads'],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<ILead> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('Invalid lead ID') as Error & { statusCode: number };
      err.statusCode = 400;
      throw err;
    }
    const lead = await Lead.findById(id);
    if (!lead) {
      const err = new Error('Lead not found') as Error & { statusCode: number };
      err.statusCode = 404;
      throw err;
    }
    return lead;
  }

  async update(id: string, data: UpdateLeadDto): Promise<ILead> {
    await this.findById(id);

    if (data.phone) {
      const existing = await Lead.findOne({ phone: data.phone, _id: { $ne: id } });
      if (existing) {
        const err = new Error('A lead with this phone number already exists') as Error & { statusCode: number };
        err.statusCode = 409;
        throw err;
      }
    }

    const updated = await Lead.findByIdAndUpdate(
      id,
      { ...data, email: data.email || undefined },
      { new: true, runValidators: true }
    );
    if (!updated) {
      const err = new Error('Lead not found') as Error & { statusCode: number };
      err.statusCode = 404;
      throw err;
    }
    return updated;
  }

  async updateStatus(id: string, data: UpdateLeadStatusDto): Promise<ILead> {
    await this.findById(id);
    const updated = await Lead.findByIdAndUpdate(
      id,
      { status: data.status, statusUpdatedAt: new Date() },
      { new: true }
    );
    if (!updated) {
      const err = new Error('Lead not found') as Error & { statusCode: number };
      err.statusCode = 404;
      throw err;
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await Lead.findByIdAndDelete(id);
  }
}

export const leadService = new LeadService();

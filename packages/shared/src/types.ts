import { LeadStatus, LeadSource, PropertyType } from './enums';

export interface Lead {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  budget: number;
  location: string;
  propertyType: PropertyType;
  source: LeadSource;
  status: LeadStatus;
  statusUpdatedAt?: string;
  lastContactedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  _id: string;
  leadId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedLeads {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LeadFilters {
  search?: string;
  source?: LeadSource;
  status?: LeadStatus;
  sortBy?: 'createdAt' | 'budget';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface DashboardSummary {
  totalLeads: number;
  conversionRate: number;
  byStatus: Array<{ status: LeadStatus; count: number }>;
  bySource: Array<{ source: LeadSource; count: number }>;
}

export interface CreateLeadDto {
  name: string;
  phone: string;
  email?: string;
  budget: number;
  location: string;
  propertyType: PropertyType;
  source: LeadSource;
}

export interface UpdateLeadDto {
  name?: string;
  phone?: string;
  email?: string;
  budget?: number;
  location?: string;
  propertyType?: PropertyType;
  source?: LeadSource;
}

export interface UpdateLeadStatusDto {
  status: LeadStatus;
}

export interface CreateNoteDto {
  content: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

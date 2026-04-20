import apiClient from './client';
import {
  Lead,
  PaginatedLeads,
  LeadFilters,
  CreateLeadDto,
  UpdateLeadDto,
  UpdateLeadStatusDto,
  Note,
  CreateNoteDto,
  ApiResponse,
} from '@crm/shared';

export const leadsApi = {
  getAll: async (filters: LeadFilters): Promise<PaginatedLeads> => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
    );
    const { data } = await apiClient.get<ApiResponse<PaginatedLeads>>('/leads', { params });
    return data.data!;
  },

  getById: async (id: string): Promise<Lead> => {
    const { data } = await apiClient.get<ApiResponse<Lead>>(`/leads/${id}`);
    return data.data!;
  },

  create: async (payload: CreateLeadDto): Promise<Lead> => {
    const { data } = await apiClient.post<ApiResponse<Lead>>('/leads', payload);
    return data.data!;
  },

  update: async (id: string, payload: UpdateLeadDto): Promise<Lead> => {
    const { data } = await apiClient.put<ApiResponse<Lead>>(`/leads/${id}`, payload);
    return data.data!;
  },

  updateStatus: async (id: string, payload: UpdateLeadStatusDto): Promise<Lead> => {
    const { data } = await apiClient.patch<ApiResponse<Lead>>(`/leads/${id}/status`, payload);
    return data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/leads/${id}`);
  },

  getNotes: async (leadId: string): Promise<Note[]> => {
    const { data } = await apiClient.get<ApiResponse<Note[]>>(`/leads/${leadId}/notes`);
    return data.data!;
  },

  createNote: async (leadId: string, payload: CreateNoteDto): Promise<Note> => {
    const { data } = await apiClient.post<ApiResponse<Note>>(`/leads/${leadId}/notes`, payload);
    return data.data!;
  },
};

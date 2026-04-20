import apiClient from './client';
import { DashboardSummary, ApiResponse } from '@crm/shared';

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    const { data } = await apiClient.get<ApiResponse<DashboardSummary>>('/dashboard/summary');
    return data.data!;
  },
};

import { apiClient } from './client';
import { ApiResponse } from '../types/api';
import { DashboardMetrics } from '../types/dashboard';

export const dashboardApi = {
  async getDashboard(): Promise<DashboardMetrics> {
    const res = await apiClient.get<ApiResponse<DashboardMetrics>>('/dashboard');
    return res.data;
  },
};

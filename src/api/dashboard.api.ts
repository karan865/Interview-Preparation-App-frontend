import { DashboardMetrics } from '../types/dashboard';
import { localDataService } from '../services/localDataService';

export const dashboardApi = {
  async getDashboard(): Promise<DashboardMetrics> {
    return localDataService.getDashboard();
  },
};

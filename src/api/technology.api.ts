import { apiClient } from './client';
import { ApiResponse } from '../types/api';
import { Technology } from '../types/technology';

export const technologyApi = {
  async getTechnologies(category?: string): Promise<Technology[]> {
    const res = await apiClient.get<ApiResponse<Technology[]>>('/technologies', { category });
    return res.data;
  },

  async getTechnologyByIdOrSlug(idOrSlug: string): Promise<Technology> {
    const res = await apiClient.get<ApiResponse<Technology>>(`/technologies/${idOrSlug}`);
    return res.data;
  },
};

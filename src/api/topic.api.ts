import { apiClient } from './client';
import { ApiResponse } from '../types/api';
import { Topic, PreparationLevel } from '../types/topic';

export const topicApi = {
  async getTopics(technology?: string): Promise<Topic[]> {
    const res = await apiClient.get<ApiResponse<Topic[]>>('/topics', { technology });
    return res.data;
  },

  async getTopicByIdOrSlug(idOrSlug: string): Promise<Topic> {
    const res = await apiClient.get<ApiResponse<Topic>>(`/topics/${idOrSlug}`);
    return res.data;
  },

  async getPreparationLevels(): Promise<PreparationLevel[]> {
    const res = await apiClient.get<ApiResponse<PreparationLevel[]>>('/preparation-levels');
    return res.data;
  },
};

import { Topic, PreparationLevel } from '../types/topic';
import { localDataService } from '../services/localDataService';

export const topicApi = {
  async getTopics(technology?: string): Promise<Topic[]> {
    return localDataService.getTopics(technology);
  },

  async getTopicByIdOrSlug(idOrSlug: string): Promise<Topic> {
    return localDataService.getTopicByIdOrSlug(idOrSlug);
  },

  async getPreparationLevels(): Promise<PreparationLevel[]> {
    return localDataService.getPreparationLevels();
  },
};

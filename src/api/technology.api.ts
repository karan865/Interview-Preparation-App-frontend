import { Technology } from '../types/technology';
import { localDataService } from '../services/localDataService';

export const technologyApi = {
  async getTechnologies(category?: string): Promise<Technology[]> {
    return localDataService.getTechnologies(category);
  },

  async getTechnologyByIdOrSlug(idOrSlug: string): Promise<Technology> {
    return localDataService.getTechnologyByIdOrSlug(idOrSlug);
  },
};

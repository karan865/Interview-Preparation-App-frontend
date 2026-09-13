import { Technology } from './technology';

export interface Topic {
  _id: string;
  id?: string;
  technologyId: string | Technology;
  name: string;
  slug: string;
  description?: string;
  order: number;
  isActive: boolean;
  questionCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PreparationLevel {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  order: number;
  description?: string;
  questionCount?: number;
}

export interface Technology {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'system-design' | 'general' | 'other';
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  questionCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

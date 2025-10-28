export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
  avatarUrl?: string;
}

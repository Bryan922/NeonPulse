export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface UserData {
  email: string;
  displayName?: string;
  createdAt: Date;
  lastLogin: Date;
  role: 'user' | 'admin';
} 
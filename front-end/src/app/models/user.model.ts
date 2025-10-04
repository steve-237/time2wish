import { Birthday } from "./birthday.model";

export interface UserProfile {
  id: string;
  profilePicture?: string;
  fullName: string;
  email: string;
  passwordHash: string;
  bio?: string;
  notificationsEnabled: boolean;
  birthdays: Birthday[];
  theme: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  status: 'active' | 'inactive' | 'pending';
}
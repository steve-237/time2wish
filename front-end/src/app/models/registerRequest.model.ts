export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  notificationsEnabled?: boolean;
  language?: string;
  theme?: string;
}
import { UserProfile } from "./user.model";

export interface AuthResponse {
  user: UserProfile;
  token?: string;
}
export interface Birthday {
  id: number;
  name: string;
  city: string;
  category: string;
  date: Date;
  photo?: string;
  email?: string;
  phone?: string;
  notes?: string;
  enableReminders: boolean;
  passed: boolean;
  userId?: string; // Référence à l'utilisateur propriétaire
  createdAt?: Date;
  updatedAt?: Date;
  preferencies?: string [];
}

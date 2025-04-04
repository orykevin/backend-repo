export interface User {
  id: string;
  email?: string | null;
  displayName?: string | null;
  createdAt: admin.firestore.Timestamp;
  lastLogin?: admin.firestore.Timestamp;
  customData?: {
    [key: string]: any;
  };
}

export type UserUpdateData = Partial<Omit<User, 'id' | 'email' | 'createdAt'>>;

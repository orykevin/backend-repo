import { admin } from "../config/firebaseConfig";

export interface User {
  id: string;
  email?: string | null;
  displayName?: string | null;
  createdAt: admin.firestore.Timestamp;
  hobby?: string;
  address?: string;
  phoneNumber?: string;
}

export type UserUpdateData = Partial<Omit<User, 'id' | 'email' | 'createdAt'>>;


export const USER_ROLE = {
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    ALL: 'All',
};

export type UserRole = 'ADMIN' | 'MANAGER';

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  isSynced: boolean;
}

export interface DeletedUser {
  id: string;
  userId: string;
  deletedAt: string;
}

export enum USER_ROLES  {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    ALL = 'ALL',
}
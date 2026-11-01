export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory = 'work' | 'personal' | 'study' | 'health' | 'finance' | 'other';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export interface FilterOptions {
  searchQuery: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  category: TaskCategory | 'all';
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title';
  sortOrder: 'asc' | 'desc';
}

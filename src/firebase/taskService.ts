import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError } from './config.ts';
import { Task, TaskPriority, TaskCategory, TaskStatus, UserProfile, OperationType } from '../types/index.ts';

// Helper to sanitize alphanumeric IDs matching firestore.rules regex: '^[a-zA-Z0-9_\\-]+$'
function generateSafeId(prefix = 'task'): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${randomStr}`;
}

/**
 * Real-time listener for current user's tasks
 * Adheres strictly to rule: `allow list: if isSignedIn() && resource.data.userId == request.auth.uid;`
 */
export function subscribeToUserTasks(
  userId: string,
  onTasksUpdated: (tasks: Task[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const tasksRef = collection(db, 'tasks');
  const userTasksQuery = query(tasksRef, where('userId', '==', userId));

  return onSnapshot(
    userTasksQuery,
    (snapshot) => {
      const tasksList: Task[] = [];
      snapshot.forEach((docSnapshot) => {
        tasksList.push(docSnapshot.data() as Task);
      });
      // Sort primarily by updated/created descending by default in memory
      tasksList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onTasksUpdated(tasksList);
    },
    (error) => {
      console.error('Subscription error on tasks collection:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, 'tasks');
    }
  );
}

/**
 * Creates a new task in Cloud Firestore
 */
export async function createTask(
  userId: string,
  data: {
    title: string;
    description?: string;
    priority: TaskPriority;
    category: TaskCategory;
    dueDate?: string;
    status?: TaskStatus;
  }
): Promise<Task> {
  const taskId = generateSafeId('task');
  const now = new Date().toISOString();

  // Strict sanitization & bounds enforcement from blueprint
  const cleanTitle = data.title.trim().slice(0, 140);
  if (!cleanTitle) {
    throw new Error('Task title cannot be empty.');
  }

  const cleanDescription = data.description?.trim().slice(0, 1000);
  const cleanDueDate = data.dueDate?.trim().slice(0, 50);

  const newTask: Task = {
    id: taskId,
    userId,
    title: cleanTitle,
    status: data.status || 'todo',
    priority: data.priority,
    category: data.category,
    createdAt: now,
    updatedAt: now,
  };

  if (cleanDescription) {
    newTask.description = cleanDescription;
  }
  if (cleanDueDate) {
    newTask.dueDate = cleanDueDate;
  }

  const docPath = `tasks/${taskId}`;
  try {
    await setDoc(doc(db, 'tasks', taskId), newTask);
    return newTask;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

/**
 * Updates an existing task
 */
export async function updateTask(
  taskId: string,
  updates: Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
  const docPath = `tasks/${taskId}`;
  const now = new Date().toISOString();

  const sanitizedUpdates: Record<string, unknown> = {
    updatedAt: now,
  };

  if (updates.title !== undefined) {
    const cleanTitle = updates.title.trim().slice(0, 140);
    if (!cleanTitle) throw new Error('Task title cannot be empty.');
    sanitizedUpdates.title = cleanTitle;
  }

  if (updates.description !== undefined) {
    sanitizedUpdates.description = updates.description.trim().slice(0, 1000);
  }

  if (updates.status !== undefined) {
    sanitizedUpdates.status = updates.status;
    if (updates.status === 'completed') {
      sanitizedUpdates.completedAt = now;
    }
  }

  if (updates.priority !== undefined) {
    sanitizedUpdates.priority = updates.priority;
  }

  if (updates.category !== undefined) {
    sanitizedUpdates.category = updates.category;
  }

  if (updates.dueDate !== undefined) {
    sanitizedUpdates.dueDate = updates.dueDate.trim().slice(0, 50);
  }

  try {
    await updateDoc(doc(db, 'tasks', taskId), sanitizedUpdates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

/**
 * Quick toggle task status between completed and todo
 */
export async function toggleTaskComplete(task: Task): Promise<void> {
  const docPath = `tasks/${task.id}`;
  const now = new Date().toISOString();
  const willBeCompleted = task.status !== 'completed';

  const updates: Record<string, unknown> = {
    status: willBeCompleted ? 'completed' : 'todo',
    updatedAt: now,
  };

  if (willBeCompleted) {
    updates.completedAt = now;
  }

  try {
    await updateDoc(doc(db, 'tasks', task.id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

/**
 * Deletes a task by ID
 */
export async function deleteTask(taskId: string): Promise<void> {
  const docPath = `tasks/${taskId}`;
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

/**
 * Syncs user profile metadata to /users/{userId}
 */
export async function syncUserProfile(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}): Promise<void> {
  const docPath = `users/${user.uid}`;
  const now = new Date().toISOString();

  const profileData: UserProfile = {
    id: user.uid,
    email: user.email || 'user@example.com',
    displayName: user.displayName || 'Task Manager User',
    photoURL: user.photoURL || '',
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(doc(db, 'users', user.uid), profileData, { merge: true });
  } catch (error) {
    // Non-fatal if user profile write fails; logging error
    console.warn('User profile sync error (may need verified token or initial sign-in):', error);
  }
}

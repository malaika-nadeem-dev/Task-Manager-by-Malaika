# Security Specification: My Task Manager

## 1. Data Invariants
1. **User Identity Isolation**: A user can only access, create, read, update, or delete their own user profile document (`/users/{userId}` where `userId == request.auth.uid`).
2. **Task Ownership Invariant**: A task can only be created with `userId` strictly matching `request.auth.uid`. No user can create or update a task belonging to another user.
3. **Task Immutability**: The `userId` and `createdAt` fields of a task are immutable and cannot be altered after creation.
4. **Valid Schema Enforcement**: Every task must satisfy strict length bounds (title <= 140 chars, description <= 1000 chars), valid enums (`status` in ['todo', 'in_progress', 'completed'], `priority` in ['low', 'medium', 'high', 'urgent'], `category` in ['work', 'personal', 'study', 'health', 'finance', 'other']).
5. **No Blanket Queries**: Querying tasks requires filtering by the current authenticated user's `userId`. No global or cross-tenant query execution is permitted.
6. **Default Deny**: All unmatched collections and documents are rejected by default.

---

## 2. The "Dirty Dozen" Payloads (Must Return PERMISSION_DENIED)

1. **Unauthenticated Read**: Attempting to read `/tasks/task_123` with `auth == null`.
2. **Unauthenticated Write**: Attempting to create a task with `auth == null`.
3. **Cross-User Task Read**: User `attacker_uid` attempting to read a task where `resource.data.userId == 'victim_uid'`.
4. **Cross-User Task List Query**: User `attacker_uid` executing `getDocs(collection(db, 'tasks'))` without filtering by their own `userId`.
5. **Identity Spoofing on Task Create**: User `attacker_uid` creating a task with `incoming().userId = 'victim_uid'`.
6. **Task Ownership Hijacking**: User `attacker_uid` updating `existing().userId` from `attacker_uid` to `victim_uid` or modifying another user's task.
7. **Created Date Tampering**: User trying to mutate `createdAt` on update (`incoming().createdAt != existing().createdAt`).
8. **Shadow Field Injection**: Attempting to inject malicious or unexpected ghost fields (e.g., `isAdmin: true` or `role: 'superadmin'`) on task creation.
9. **Title String Bomb**: Creating a task with title exceeding 140 characters or description exceeding 1000 characters.
10. **Enum Poisoning**: Creating a task with invalid status `status: 'hacked'` or invalid priority `priority: 'critical_zero'`.
11. **Cross-User Profile Tampering**: User `attacker_uid` attempting to overwrite `/users/victim_uid`.
12. **Malicious Document ID**: Attempting to write to `/tasks/` using a path variable ID containing forbidden characters or oversized length (> 128 chars).

---

## 3. Test Runner Specification
The test suite validates that unauthenticated calls, privilege escalations, cross-tenant reads, and schema boundary violations are rejected with `PERMISSION_DENIED`.

import SQLite from 'react-native-sqlite-storage';
import { User } from '../types';
// Enable promise-based API
SQLite.enablePromise(true);


class SQLiteService {
  private db: SQLite.SQLiteDatabase | null = null;
  private readonly DB_NAME = 'ZellerApp.db';
 

  async initDatabase(): Promise<void> {
    try {
      this.db = await SQLite.openDatabase({
        name: this.DB_NAME,
        location: 'default',
      });

      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        is_synced INTEGER NOT NULL DEFAULT 0
      )
    `;

    const createDeletedUsersTable = `
      CREATE TABLE IF NOT EXISTS deleted_users (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        deleted_at TEXT NOT NULL
      )
    `;

    await this.db.executeSql(createUsersTable);
    await this.db.executeSql(createDeletedUsersTable);
  }

  // User operations
  async getAllUsers(): Promise<User[]> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql(
      'SELECT * FROM users ORDER BY name ASC'
    );

    const users: User[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      users.push({
        id: row.id,
        name: row.name,
        email: row.email || undefined,
        role: row.role,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        isSynced: Boolean(row.is_synced),
      });
    }

    return users;
  }

  async getUserById(id: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (results.rows.length === 0) {
      return null;
    }

    const row = results.rows.item(0);
    return {
      id: row.id,
      name: row.name,
      email: row.email || undefined,
      role: row.role,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isSynced: Boolean(row.is_synced),
    };
  }

  async getUsersByRole(role: 'ADMIN' | 'MANAGER'): Promise<User[]> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql(
      'SELECT * FROM users WHERE role = ? ORDER BY name ASC',
      [role]
    );

    const users: User[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      users.push({
        id: row.id,
        name: row.name,
        email: row.email || undefined,
        role: row.role,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        isSynced: Boolean(row.is_synced),
      });
    }

    return users;
  }

  async searchUsers(query: string): Promise<User[]> {
    if (!this.db) throw new Error('Database not initialized');

    const searchTerm = `%${query.toLowerCase()}%`;
    const [results] = await this.db.executeSql(
      'SELECT * FROM users WHERE LOWER(name) LIKE ? OR LOWER(email) LIKE ? ORDER BY name ASC',
      [searchTerm, searchTerm]
    );

    const users: User[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      users.push({
        id: row.id,
        name: row.name,
        email: row.email || undefined,
        role: row.role,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        isSynced: Boolean(row.is_synced),
      });
    }

    return users;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isSynced'>, isSynced: boolean = false): Promise<User> {
    if (!this.db) throw new Error('Database not initialized');

    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const now = new Date().toISOString();

    await this.db.executeSql(
      'INSERT INTO users (id, name, email, role, created_at, updated_at, is_synced) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, userData.name, userData.email || null, userData.role, now, now, isSynced ? 1 : 0]
    );

    return {
      id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      createdAt: now,
      updatedAt: now,
      isSynced,
    };
  }

  async updateUser(id: string, userData: Partial<Omit<User, 'id' | 'createdAt' | 'isSynced'>>): Promise<User> {
    if (!this.db) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];

    if (userData.name !== undefined) {
      updates.push('name = ?');
      values.push(userData.name);
    }
    if (userData.email !== undefined) {
      updates.push('email = ?');
      values.push(userData.email || null);
    }
    if (userData.role !== undefined) {
      updates.push('role = ?');
      values.push(userData.role);
    }

    updates.push('updated_at = ?');
    values.push(now);
    values.push(id);

    await this.db.executeSql(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const updatedUser = await this.getUserById(id);
    if (!updatedUser) {
      throw new Error('User not found after update');
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Track the deleted user
    const deletedId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const now = new Date().toISOString();

    await this.db.executeSql(
      'INSERT INTO deleted_users (id, user_id, deleted_at) VALUES (?, ?, ?)',
      [deletedId, id, now]
    );

    // Delete the user
    await this.db.executeSql('DELETE FROM users WHERE id = ?', [id]);
  }

  async getDeletedUserIds(): Promise<Set<string>> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql('SELECT user_id FROM deleted_users');
    const deletedIds = new Set<string>();

    for (let i = 0; i < results.rows.length; i++) {
      deletedIds.add(results.rows.item(i).user_id);
    }

    return deletedIds;
  }

  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.executeSql('DELETE FROM users');
    await this.db.executeSql('DELETE FROM deleted_users');
  }

  async closeDatabase(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

export const sqliteService = new SQLiteService();

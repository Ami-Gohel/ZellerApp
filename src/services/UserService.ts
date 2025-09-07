import { apolloClient } from '../graphql/client';
import { LIST_ZELLER_CUSTOMERS } from '../graphql/queries';
import { User, UserRole } from '../types';
import { sqliteService } from './SQLiteService';

interface ZellerCustomer {
  id: string;
  name: string;
  email?: string;
  role: string;
}

interface ListZellerCustomersResponse {
  listZellerCustomers: {
    items: ZellerCustomer[];
    nextToken?: string;
  };
}

export class UserService {
  static async syncUsersFromAPI(): Promise<void> {
    try {
      const { data } = await apolloClient.query<ListZellerCustomersResponse>({
        query: LIST_ZELLER_CUSTOMERS,
        fetchPolicy: 'network-only',
      });

      if (data?.listZellerCustomers?.items) {
        const apiUsers = data.listZellerCustomers.items;

        // Get all existing users
        const existingUsers = await sqliteService.getAllUsers();

        // Get all deleted user IDs
        const deletedUserIds = await sqliteService.getDeletedUserIds();

        // Create a map of API users by their ID for quick lookup
        const apiUsersMap = new Map(apiUsers.map(user => [user.id, user]));

        // Process existing users
        for (const existingUser of existingUsers) {
          const apiUser = apiUsersMap.get(existingUser.id);
          
          if (apiUser) {
            // User exists in API - update if it's a synced user, or keep local changes
            if (existingUser.isSynced) {
              // Update synced user with API data
              await sqliteService.updateUser(existingUser.id, {
                name: apiUser.name || '',
                email: apiUser.email || undefined,
                role: apiUser.role as UserRole,
              });
            }
            // If user is not synced (has local changes), keep it as is
            apiUsersMap.delete(existingUser.id); // Remove from map so we don't create duplicate
          } else {
            // User doesn't exist in API - delete if it's a synced user
            if (existingUser.isSynced) {
              await sqliteService.deleteUser(existingUser.id);
            }
            // If user is not synced (local user), keep it
          }
        }

        // Add new users from API that don't exist locally and haven't been deleted
        for (const userData of apiUsersMap.values()) {
          // Skip users that have been deleted locally
          if (deletedUserIds.has(userData.id)) {
            continue;
          }
          
          await sqliteService.createUser({
            name: userData.name || '',
            email: userData.email || undefined,
            role: userData.role as UserRole,
          }, true);
        }
      }
    } catch (error) {
      console.error('Error syncing users from API:', error);
      throw error;
    }
  }

  static async getAllUsers(): Promise<User[]> {
    return await sqliteService.getAllUsers();
  }

  static async getUsersByRole(role: UserRole): Promise<User[]> {
    return await sqliteService.getUsersByRole(role);
  }

  static async searchUsers(query: string): Promise<User[]> {
    return await sqliteService.searchUsers(query);
  }

  static async createUser(
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isSynced'>,
  ): Promise<User> {
    return await sqliteService.createUser(userData);
  }

  static async updateUser(
    userId: string,
    userData: Partial<Omit<User, 'id' | 'createdAt' | 'isSynced'>>,
  ): Promise<User> {
    return await sqliteService.updateUser(userId, userData);
  }

  static async deleteUser(userId: string): Promise<void> {
    return await sqliteService.deleteUser(userId);
  }

  static async getUserById(userId: string): Promise<User | null> {
    return await sqliteService.getUserById(userId);
  }
}

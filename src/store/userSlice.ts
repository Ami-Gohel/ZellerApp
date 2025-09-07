import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole } from '../types';
import { UserService } from '../services/UserService';
// Define the state interface
interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  searchQuery: string;
  currentPage: number;
}

// Initial state
const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  refreshing: false,
  searchQuery: '',
  currentPage: 0,
};

// Async thunks for API calls
export const loadUsers = createAsyncThunk(
  'users/loadUsers',
  async (_, { rejectWithValue }) => {
    try {
      const users = await UserService.getAllUsers();
      return users;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load users');
    }
  }
);

export const refreshUsers = createAsyncThunk(
  'users/refreshUsers',
  async (_, { rejectWithValue }) => {
    try {
      await UserService.syncUsersFromAPI();
      const users = await UserService.getAllUsers();
      return users;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to refresh users');
    }
  }
);

export const addUser = createAsyncThunk(
  'users/addUser',
  async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isSynced'>, { rejectWithValue }) => {
    try {
      const newUser = await UserService.createUser(userData);
      return newUser;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, userData }: { userId: string; userData: Partial<Omit<User, 'id' | 'createdAt' | 'isSynced'>> }, { rejectWithValue }) => {
    try {
      const updatedUser = await UserService.updateUser(userId, userData);
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      await UserService.deleteUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete user');
    }
  }
);

export const getUserById = createAsyncThunk(
  'users/getUserById',
  async (userId: string, { rejectWithValue }) => {
    try {
      const user = await UserService.getUserById(userId);
      return user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to get user');
    }
  }
);

export const searchUsers = createAsyncThunk(
  'users/searchUsers',
  async (query: string, { rejectWithValue }) => {
    try {
      const users = await UserService.searchUsers(query);
      return users;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to search users');
    }
  }
);

export const getUsersByRole = createAsyncThunk(
  'users/getUsersByRole',
  async (role: UserRole, { rejectWithValue }) => {
    try {
      const users = await UserService.getUsersByRole(role);
      return users;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to get users by role');
    }
  }
);

// User slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    // Load users
    builder
      .addCase(loadUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(loadUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Refresh users
    builder
      .addCase(refreshUsers.pending, (state) => {
        state.refreshing = true;
        state.error = null;
      })
      .addCase(refreshUsers.fulfilled, (state, action) => {
        state.refreshing = false;
        state.users = action.payload;
      })
      .addCase(refreshUsers.rejected, (state, action) => {
        state.refreshing = false;
        state.error = action.payload as string;
      });

    // Add user
    builder
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        // Sort users alphabetically
        state.users.sort((a, b) => a.name.localeCompare(b.name));
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update user
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
          // Sort users alphabetically
          state.users.sort((a, b) => a.name.localeCompare(b.name));
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete user
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Search users
    builder
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    .addCase(searchUsers.fulfilled, (state, _action) => {
      state.loading = false;
      // Note: We don't replace the users array here, we let the component filter
      // The search results are available in action.payload if needed
    })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { setSearchQuery, setCurrentPage, clearError, clearSearch } = userSlice.actions;

// Selectors
export const selectUsers = (state: { users: UserState }) => state.users.users;
export const selectLoading = (state: { users: UserState }) => state.users.loading;
export const selectError = (state: { users: UserState }) => state.users.error;
export const selectRefreshing = (state: { users: UserState }) => state.users.refreshing;
export const selectSearchQuery = (state: { users: UserState }) => state.users.searchQuery;
export const selectCurrentPage = (state: { users: UserState }) => state.users.currentPage;

// Filtered users selector
export const selectFilteredUsers = (state: { users: UserState }) => {
  const { users, searchQuery, currentPage } = state.users;
  
  let filteredUsers = users;
  
  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(query)
    );
  }
  
  // Filter by role based on current page
  if (currentPage === 1) {
    filteredUsers = filteredUsers.filter(user => user.role === 'ADMIN');
  } else if (currentPage === 2) {
    filteredUsers = filteredUsers.filter(user => user.role === 'MANAGER');
  }
  // currentPage === 0 shows all users
  
  return [...filteredUsers].sort((a, b) => a.name.localeCompare(b.name));
};

export default userSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { findUserByEmail, addUser, findUserById } from '@/utils/mockStorage';
import { setTokenInStorage, removeTokenFromStorage } from '@/utils/jwt';

interface User {
  id: string;
  email: string;
  full_name?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  status: 'idle',
  error: null,
};

// Generate a mock JWT token
const generateMockToken = (userId: string): string => {
  // Simple mock token (in production, use proper JWT)
  return btoa(JSON.stringify({ userId, timestamp: Date.now() }));
};

// Login thunk
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const user = findUserByEmail(credentials.email);
      
      if (!user) {
        throw new Error('User not found');
      }

      // In a real app, compare hashed passwords. For mock, simple comparison
      if (user.password !== credentials.password) {
        throw new Error('Invalid password');
      }

      const token = generateMockToken(user.id);
      const userData = {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      };

      // Store in localStorage
      setTokenInStorage(token);
      localStorage.setItem('user', JSON.stringify(userData));

      return { token, user: userData };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Register thunk
export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    credentials: { email: string; password: string; fullName: string },
    { rejectWithValue }
  ) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if user already exists
      const existingUser = findUserByEmail(credentials.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = addUser({
        email: credentials.email,
        password: credentials.password, // In production, hash this
        full_name: credentials.fullName,
      });

      const token = generateMockToken(newUser.id);
      const userData = {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
      };

      // Store in localStorage
      setTokenInStorage(token);
      localStorage.setItem('user', JSON.stringify(userData));

      return { token, user: userData };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
      removeTokenFromStorage();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
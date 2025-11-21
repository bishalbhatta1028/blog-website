import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getPosts, addPost as addPostToStorage, updatePost as updatePostInStorage, deletePost as deletePostFromStorage, findUserById } from '@/utils/mockStorage';

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
  image?: string | null;
  category?: string | null;
  profiles?: {
    full_name: string | null;
    email: string;
  };
}

interface PostsState {
  items: Post[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PostsState = {
  items: [],
  status: 'idle',
  error: null,
};

// Fetch all posts
export const fetchPosts = createAsyncThunk('posts/fetchAll', async (_, { rejectWithValue }) => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const posts = getPosts();
    
    // Enrich posts with user profile data
    const enrichedPosts: Post[] = posts.map((post) => {
      const user = findUserById(post.author_id);
      return {
        ...post,
        profiles: user
          ? {
              full_name: user.full_name || null,
              email: user.email,
            }
          : undefined,
      };
    });

    // Sort by created_at descending
    enrichedPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return enrichedPosts;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch posts');
  }
});

// Add new post
export const addPost = createAsyncThunk(
  'posts/add',
  async (
    payload: { title: string; content: string; excerpt?: string; author_id: string; image?: string; category?: string },
    { rejectWithValue }
  ) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const newPost = addPostToStorage(payload);
      const user = findUserById(payload.author_id);

      const enrichedPost: Post = {
        ...newPost,
        profiles: user
          ? {
              full_name: user.full_name || null,
              email: user.email,
            }
          : undefined,
      };

      return enrichedPost;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create post');
    }
  }
);

// Update post
export const updatePost = createAsyncThunk(
  'posts/update',
  async ({ id, data }: { id: string; data: Partial<Post> }, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const updatedPost = updatePostInStorage(id, data);
      if (!updatedPost) {
        throw new Error('Post not found');
      }

      const user = findUserById(updatedPost.author_id);
      const enrichedPost: Post = {
        ...updatedPost,
        profiles: user
          ? {
              full_name: user.full_name || null,
              email: user.email,
            }
          : undefined,
      };

      return enrichedPost;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update post');
    }
  }
);

// Delete post
export const deletePost = createAsyncThunk('posts/delete', async (id: string, { rejectWithValue }) => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const success = deletePostFromStorage(id);
    if (!success) {
      throw new Error('Post not found');
    }
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to delete post');
  }
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch posts
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    // Add post
    builder
      .addCase(addPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.items.unshift(action.payload);
      })
      .addCase(addPost.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Update post
    builder
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.items = state.items.map((post) =>
          post.id === action.payload.id ? action.payload : post
        );
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Delete post
    builder
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((post) => post.id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = postsSlice.actions;
export default postsSlice.reducer;
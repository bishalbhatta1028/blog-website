// Mock storage utility for posts and users using localStorage
// This simulates a backend API using localStorage

export interface MockPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
  image?: string | null;
  category?: string | null;
  userId?: number; // For jsonplaceholder compatibility
}

export interface MockUser {
  id: string;
  email: string;
  password: string; // Hashed in real app, plain for mock
  full_name?: string;
  created_at: string;
}

const POSTS_KEY = 'mock_posts';
const USERS_KEY = 'mock_users';

// Initialize mock data if not exists
export const initializeMockData = () => {
  if (!localStorage.getItem(POSTS_KEY)) {
    localStorage.setItem(POSTS_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(USERS_KEY)) {
    // Create a default user for testing
    const defaultUser: MockUser = {
      id: '1',
      email: 'demo@example.com',
      password: 'demo123', // Plain text for mock
      full_name: 'Demo User',
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([defaultUser]));
  }
};

// Posts operations
export const getPosts = (): MockPost[] => {
  const posts = localStorage.getItem(POSTS_KEY);
  return posts ? JSON.parse(posts) : [];
};

export const savePosts = (posts: MockPost[]) => {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
};

export const addPost = (post: Omit<MockPost, 'id' | 'created_at' | 'updated_at'>): MockPost => {
  const posts = getPosts();
  const newPost: MockPost = {
    ...post,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    userId: parseInt(post.author_id) || 1, // For jsonplaceholder compatibility
  };
  posts.unshift(newPost);
  savePosts(posts);
  return newPost;
};

export const updatePost = (id: string, updates: Partial<MockPost>): MockPost | null => {
  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return null;
  
  posts[index] = {
    ...posts[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  savePosts(posts);
  return posts[index];
};

export const deletePost = (id: string): boolean => {
  const posts = getPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) return false;
  savePosts(filtered);
  return true;
};

export const getPostById = (id: string): MockPost | null => {
  const posts = getPosts();
  return posts.find((p) => p.id === id) || null;
};

// Users operations
export const getUsers = (): MockUser[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: MockUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const findUserByEmail = (email: string): MockUser | null => {
  const users = getUsers();
  return users.find((u) => u.email === email) || null;
};

export const findUserById = (id: string): MockUser | null => {
  const users = getUsers();
  return users.find((u) => u.id === id) || null;
};

export const addUser = (user: Omit<MockUser, 'id' | 'created_at'>): MockUser => {
  const users = getUsers();
  const newUser: MockUser = {
    ...user,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

// Initialize on import
initializeMockData();


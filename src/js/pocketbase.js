import PocketBase from 'pocketbase';

// Initialize PocketBase instance
export const pb = new PocketBase('https://pocketbase-v0g004oc8w880o8ks0k40kwc.cscclub.space');

// Authentication functions
export const authStore = pb.authStore;

// Register a new user
export async function register(username, email, password, passwordConfirm) {
  try {
    const data = {
      username,
      email,
      password,
      passwordConfirm,
    };
    
    const response = await pb.collection('users').create(data);
    return { success: true, data: response };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
}

// Login a user
export async function login(usernameOrEmail, password) {
  try {
    const response = await pb.collection('users').authWithPassword(
      usernameOrEmail,
      password
    );
    return { success: true, data: response };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
}

// Logout the current user
export function logout() {
  pb.authStore.clear();
}

// Check if user is authenticated
export function isAuthenticated() {
  return pb.authStore.isValid;
}

// Get current user data
export function getCurrentUser() {
  return pb.authStore.model;
}

// Posts management functions

// Create a new post
export async function createPost(postData) {
  try {
    if (!isAuthenticated()) {
      throw new Error('User not authenticated');
    }
    
    // Add the current user as author
    const formData = new FormData();
    
    // Add text fields
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('summary', postData.summary || '');
    formData.append('category', postData.category);
    formData.append('tags', JSON.stringify(postData.tags || []));
    formData.append('featured', postData.featured ? 'true' : 'false');
    formData.append('author', pb.authStore.model.id);
    
    // Add image if provided
    if (postData.image instanceof File) {
      formData.append('image', postData.image);
    }
    
    const response = await pb.collection('posts').create(formData);
    return { success: true, data: response };
  } catch (error) {
    console.error('Create post error:', error);
    return { success: false, error: error.message };
  }
}

// Get all posts
export async function getPosts(options = {}) {
  try {
    const { page = 1, perPage = 20, filter = '', sort = '-created' } = options;
    
    const resultList = await pb.collection('posts').getList(page, perPage, {
      filter,
      sort,
      expand: 'category,author',
    });
    
    return { success: true, data: resultList };
  } catch (error) {
    console.error('Get posts error:', error);
    return { success: false, error: error.message };
  }
}

// Get a single post by ID
export async function getPost(id) {
  try {
    const record = await pb.collection('posts').getOne(id, {
      expand: 'category,author',
    });
    
    return { success: true, data: record };
  } catch (error) {
    console.error('Get post error:', error);
    return { success: false, error: error.message };
  }
}

// Get all categories
export async function getCategories() {
  try {
    const records = await pb.collection('categories').getFullList({
      sort: 'name',
    });
    
    return { success: true, data: records };
  } catch (error) {
    console.error('Get categories error:', error);
    return { success: false, error: error.message };
  }
} 
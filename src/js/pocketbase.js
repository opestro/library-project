/**
 * @fileoverview PocketBase API client for the Historical Library project
 * 
 * This module provides functions for interacting with the PocketBase backend,
 * including authentication, data fetching, and CRUD operations.
 */

// PocketBase server URL
const POCKETBASE_URL = 'http://127.0.0.1:8090';

// User token storage key
const TOKEN_KEY = 'historical_library_auth_token';
const USER_KEY = 'historical_library_user';

/**
 * Login user with email and password
 * 
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Result object with success status and user data or error
 */
export async function login(email, password) {
  try {
    const response = await fetch(`${POCKETBASE_URL}/api/collections/users/auth-with-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identity: email,
        password: password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Login failed'
      };
    }

    // Store authentication data
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.record));

    return {
      success: true,
      user: data.record
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message || 'Login failed'
    };
  }
}

/**
 * Register a new user
 * 
 * @param {string} name - User's full name
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} passwordConfirm - Password confirmation
 * @returns {Promise<Object>} Result object with success status and user data or error
 */
export async function register(name, email, password, passwordConfirm) {
  try {
    // Validate password matching
    if (password !== passwordConfirm) {
      return {
        success: false,
        error: 'Passwords do not match'
      };
    }

    const response = await fetch(`${POCKETBASE_URL}/api/collections/users/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Registration failed'
      };
    }

    return {
      success: true,
      user: data
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error.message || 'Registration failed'
    };
  }
}

/**
 * Login with Google OAuth
 * 
 * @returns {Promise<Object>} Result object with success status
 */
export async function loginWithGoogle() {
  try {
    // Open Google OAuth popup
    window.open(`${POCKETBASE_URL}/api/oauth2-redirect/google`, '_blank', 'width=500,height=600');
    
    // This is a simplified version. In a real implementation,
    // you'd need to handle the redirect and token exchange.
    return { success: true };
  } catch (error) {
    console.error('Google login error:', error);
    return {
      success: false,
      error: error.message || 'Google login failed'
    };
  }
}

/**
 * Login with Facebook OAuth
 * 
 * @returns {Promise<Object>} Result object with success status
 */
export async function loginWithFacebook() {
  try {
    // Open Facebook OAuth popup
    window.open(`${POCKETBASE_URL}/api/oauth2-redirect/facebook`, '_blank', 'width=500,height=600');
    
    // This is a simplified version. In a real implementation,
    // you'd need to handle the redirect and token exchange.
    return { success: true };
  } catch (error) {
    console.error('Facebook login error:', error);
    return {
      success: false,
      error: error.message || 'Facebook login failed'
    };
  }
}

/**
 * Check if user is authenticated
 * 
 * @returns {boolean} True if user is authenticated
 */
export function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY);
}

/**
 * Get current user data
 * 
 * @returns {Object|null} User data or null if not logged in
 */
export function getCurrentUser() {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
}

/**
 * Get authentication token
 * 
 * @returns {string|null} Authentication token or null
 */
export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Log out current user
 */
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Helper function to make authenticated API requests
 * 
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 */
async function authenticatedFetch(url, options = {}) {
  const token = getAuthToken();
  
  const headers = {
    ...(options.headers || {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return await response.json();
}

/**
 * Get historical ages
 * 
 * @returns {Promise<Array>} List of historical ages
 */
export async function getHistoricalAges() {
  try {
    const data = await authenticatedFetch(`${POCKETBASE_URL}/api/collections/historical_ages/records?sort=start_year`);
    return data.items || [];
  } catch (error) {
    console.error('Error fetching historical ages:', error);
    return [];
  }
}

/**
 * Get categories
 * 
 * @param {string} [parentId] - Parent category ID (optional)
 * @returns {Promise<Array>} List of categories
 */
export async function getCategories(parentId = null) {
  try {
    let url = `${POCKETBASE_URL}/api/collections/content_categories/records?sort=name`;
    
    if (parentId) {
      url += `&filter=(parent="${parentId}")`;
    } else {
      url += '&filter=(parent=null)';
    }

    const data = await authenticatedFetch(url);
    return data.items || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Get documents with pagination and filters
 * 
 * @param {Object} filters - Filter parameters
 * @param {number} page - Page number
 * @param {number} perPage - Items per page
 * @returns {Promise<Object>} Paginated documents
 */
export async function getDocuments(filters = {}, page = 1, perPage = 10) {
  try {
    let url = `${POCKETBASE_URL}/api/collections/historical_documents/records?page=${page}&perPage=${perPage}`;
    
    // Add expand parameter to get related records
    url += '&expand=category,age,author';
    
    // Add sorting (newest first)
    url += '&sort=-created';
    
    // Add filters
    const filterParts = [];
    
    if (filters.ageId) {
      filterParts.push(`(age="${filters.ageId}")`);
    }
    
    if (filters.categoryId) {
      filterParts.push(`(category="${filters.categoryId}")`);
    }
    
    if (filters.query) {
      const searchQuery = encodeURIComponent(filters.query);
      filterParts.push(`(title~"${searchQuery}" || content~"${searchQuery}" || summary~"${searchQuery}")`);
    }
    
    // Only published documents for regular users
    const user = getCurrentUser();
    if (!user || !user.isAdmin) {
      filterParts.push('(status="published")');
    }
    
    if (filterParts.length > 0) {
      url += `&filter=${filterParts.join(' && ')}`;
    }

    const data = await authenticatedFetch(url);
    
    return {
      items: data.items || [],
      totalItems: data.totalItems || 0,
      totalPages: data.totalPages || 1,
      page: data.page || 1
    };
  } catch (error) {
    console.error('Error fetching documents:', error);
    return {
      items: [],
      totalItems: 0,
      totalPages: 1,
      page: 1
    };
  }
}

/**
 * Get document by ID
 * 
 * @param {string} documentId - Document ID
 * @returns {Promise<Object|null>} Document data or null
 */
export async function getDocumentById(documentId) {
  try {
    const url = `${POCKETBASE_URL}/api/collections/historical_documents/records/${documentId}?expand=category,age,author`;
    
    // Increment view count
    await incrementViewCount(documentId);
    
    return await authenticatedFetch(url);
  } catch (error) {
    console.error('Error fetching document:', error);
    return null;
  }
}

/**
 * Increment document view count
 * 
 * @param {string} documentId - Document ID
 * @returns {Promise<void>}
 */
async function incrementViewCount(documentId) {
  try {
    // First get the current document to get the current view count
    const document = await authenticatedFetch(`${POCKETBASE_URL}/api/collections/historical_documents/records/${documentId}`);
    
    // Increment view count
    const currentViewCount = document.view_count || 0;
    const newViewCount = currentViewCount + 1;
    
    // Update the document with the new view count
    await authenticatedFetch(`${POCKETBASE_URL}/api/collections/historical_documents/records/${documentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        view_count: newViewCount
      })
    });
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
}

/**
 * Get media files for a document
 * 
 * @param {string} documentId - Document ID
 * @returns {Promise<Array>} List of media files
 */
export async function getDocumentMedia(documentId) {
  try {
    const url = `${POCKETBASE_URL}/api/collections/historical_document_media/records?filter=(document="${documentId}")`;
    
    const data = await authenticatedFetch(url);
    return data.items || [];
  } catch (error) {
    console.error('Error fetching document media:', error);
    return [];
  }
}

/**
 * Create a document request
 * 
 * @param {Object} requestData - Request data
 * @returns {Promise<Object|null>} Created request or null
 */
export async function createDocumentRequest(requestData) {
  try {
    // Check authentication
    if (!isAuthenticated()) {
      throw new Error('You must be logged in to create a request');
    }
    
    const user = getCurrentUser();
    
    // Add user ID to request data
    const data = {
      ...requestData,
      user: user.id
    };
    
    return await authenticatedFetch(`${POCKETBASE_URL}/api/collections/historical_document_requests/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error('Error creating document request:', error);
    throw error;
  }
}

/**
 * Submit a contact message
 * 
 * @param {Object} messageData - Message data
 * @returns {Promise<Object|null>} Created message or null
 */
export async function submitContactMessage(messageData) {
  try {
    return await authenticatedFetch(`${POCKETBASE_URL}/api/collections/contact_messages/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageData)
    });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    throw error;
  }
}

/**
 * Get file URL from PocketBase
 * 
 * @param {string} collectionId - Collection ID
 * @param {string} recordId - Record ID
 * @param {string} fileName - File name
 * @returns {string} Full file URL
 */
export function getFileUrl(collectionId, recordId, fileName) {
  return `${POCKETBASE_URL}/api/files/${collectionId}/${recordId}/${fileName}`;
} 
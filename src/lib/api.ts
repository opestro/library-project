import { getPocketBase, POCKETBASE_URL } from './pocketbase';
import type { 
  HistoricalAge,
  ContentCategory,
  HistoricalDocument,
  DocumentMedia,
  DocumentRequest,
  ContactMessage,
  User,
  DocumentStatus,
  RequestStatus
} from '../types';
import { removeEmptyValues } from './utils';
import PocketBase, { RecordModel, RecordSubscription } from 'pocketbase';

// Initialize PocketBase
const pb = new PocketBase('http://127.0.0.1:8090');

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  page: number;
  perPage: number;
  totalPages: number;
}

/**
 * Base API class with common CRUD operations
 */
export class BaseAPI<T> {
  protected collection: string;

  constructor(collection: string) {
    this.collection = collection;
  }

  /**
   * Get all records from the collection
   */
  async getAll(): Promise<ApiResponse<T[]>> {
    try {
      const records = await pb.collection(this.collection).getFullList<T>();
      return { success: true, data: records as unknown as T[] };
    } catch (error) {
      console.error(`Error getting all ${this.collection}:`, error);
      return { success: false, error: `Failed to get ${this.collection}` };
    }
  }

  /**
   * Get a single record by ID
   */
  async getById(id: string): Promise<ApiResponse<T>> {
    try {
      const record = await pb.collection(this.collection).getOne<T>(id);
      return { success: true, data: record as unknown as T };
    } catch (error) {
      console.error(`Error getting ${this.collection} by ID:`, error);
      return { success: false, error: `${this.collection} not found` };
    }
  }

  /**
   * Create a new record
   */
  async create(data: any): Promise<ApiResponse<T>> {
    try {
      const record = await pb.collection(this.collection).create<T>(data);
      return { success: true, data: record as unknown as T };
    } catch (error) {
      console.error(`Error creating ${this.collection}:`, error);
      return { success: false, error: `Failed to create ${this.collection}` };
    }
  }

  /**
   * Update a record
   */
  async update(id: string, data: any): Promise<ApiResponse<T>> {
    try {
      const record = await pb.collection(this.collection).update<T>(id, data);
      return { success: true, data: record as unknown as T };
    } catch (error) {
      console.error(`Error updating ${this.collection}:`, error);
      return { success: false, error: `Failed to update ${this.collection}` };
    }
  }

  /**
   * Delete a record
   */
  async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      await pb.collection(this.collection).delete(id);
      return { success: true, data: true };
    } catch (error) {
      console.error(`Error deleting ${this.collection}:`, error);
      return { success: false, error: `Failed to delete ${this.collection}` };
    }
  }

  /**
   * Get paginated records
   */
  async getPaginated(page: number = 1, perPage: number = 20): Promise<ApiResponse<PaginatedResponse<T>>> {
    try {
      const response = await pb.collection(this.collection).getList<T>(page, perPage);
      
      return {
        success: true,
        data: {
          items: response.items as unknown as T[],
          totalItems: response.totalItems,
          page: response.page,
          perPage: response.perPage,
          totalPages: response.totalPages,
        },
      };
    } catch (error) {
      console.error(`Error getting paginated ${this.collection}:`, error);
      return { success: false, error: `Failed to get ${this.collection}` };
    }
  }

  /**
   * Subscribe to real-time changes
   */
  subscribe(callback: (data: RecordSubscription<T>) => void): (() => void) {
    const unsubscribe = pb.collection(this.collection).subscribe<T>('*', callback);
    return () => {
      unsubscribe.then(unsub => unsub());
    };
  }
}

/**
 * Historical Age API for fetching historical periods
 */
export class HistoricalAgeAPI extends BaseAPI<any> {
  constructor() {
    super('historical_ages');
  }
}

/**
 * Content Category API for document categories
 */
export class ContentCategoryAPI extends BaseAPI<any> {
  constructor() {
    super('content_categories');
  }

  /**
   * Get top level categories
   */
  async getTopCategories(): Promise<ApiResponse<any[]>> {
    try {
      const records = await pb
        .collection(this.collection)
        .getFullList({
          filter: 'isMain = true',
          sort: 'name',
        });
      return { success: true, data: records };
    } catch (error) {
      console.error('Error getting top categories:', error);
      return { success: false, error: 'Failed to get top categories' };
    }
  }

  /**
   * Get subcategories for a given parent category
   */
  async getSubcategories(parentId: string): Promise<ApiResponse<any[]>> {
    try {
      const records = await pb
        .collection(this.collection)
        .getFullList({
          filter: `parentId = "${parentId}"`,
          sort: 'name',
        });
      return { success: true, data: records };
    } catch (error) {
      console.error('Error getting subcategories:', error);
      return { success: false, error: 'Failed to get subcategories' };
    }
  }
}

/**
 * Documents API for handling historical documents
 */
export class DocumentsAPI extends BaseAPI<any> {
  constructor() {
    super('documents');
  }

  /**
   * Get filtered documents with pagination and sorting
   */
  async getFiltered(
    filters: Record<string, string>,
    page: number = 1,
    perPage: number = 20,
    sortBy: string = 'createdDesc'
  ): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      // Build filter string
      const filterParts: string[] = [];
      
      if (filters.search) {
        filterParts.push(`(title ~ "${filters.search}" || author ~ "${filters.search}" || description ~ "${filters.search}")`);
      }
      
      if (filters.age) {
        filterParts.push(`age = "${filters.age}"`);
      }
      
      if (filters.category) {
        filterParts.push(`category = "${filters.category}"`);
      }
      
      const filterString = filterParts.length > 0 ? filterParts.join(' && ') : '';
      
      // Build sort string
      let sortString = '';
      switch(sortBy) {
        case 'createdDesc':
          sortString = '-created';
          break;
        case 'createdAsc':
          sortString = '+created';
          break;
        case 'titleAsc':
          sortString = '+title';
          break;
        case 'titleDesc':
          sortString = '-title';
          break;
        case 'viewCountDesc':
          sortString = '-viewCount';
          break;
        case 'downloadCountDesc':
          sortString = '-downloadCount';
          break;
        default:
          sortString = '-created';
      }
      
      // Fetch records
      const response = await pb.collection(this.collection).getList(page, perPage, {
        filter: filterString,
        sort: sortString,
        expand: 'age,category',
      });
      
      return {
        success: true,
        data: {
          items: response.items,
          totalItems: response.totalItems,
          page: response.page,
          perPage: response.perPage,
          totalPages: response.totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting filtered documents:', error);
      return { success: false, error: 'Failed to get documents' };
    }
  }

  /**
   * Increment view count for a document
   */
  async incrementViewCount(documentId: string): Promise<ApiResponse<boolean>> {
    try {
      const document = await pb.collection(this.collection).getOne(documentId);
      const currentViewCount = document.viewCount || 0;
      
      await pb.collection(this.collection).update(documentId, {
        viewCount: currentViewCount + 1,
      });
      
      return { success: true, data: true };
    } catch (error) {
      console.error('Error incrementing view count:', error);
      return { success: false, error: 'Failed to update view count' };
    }
  }

  /**
   * Increment download count for a document
   */
  async incrementDownloadCount(documentId: string): Promise<ApiResponse<boolean>> {
    try {
      const document = await pb.collection(this.collection).getOne(documentId);
      const currentDownloadCount = document.downloadCount || 0;
      
      await pb.collection(this.collection).update(documentId, {
        downloadCount: currentDownloadCount + 1,
      });
      
      return { success: true, data: true };
    } catch (error) {
      console.error('Error incrementing download count:', error);
      return { success: false, error: 'Failed to update download count' };
    }
  }

  /**
   * Get featured documents
   */
  async getFeatured(limit: number = 4): Promise<ApiResponse<any[]>> {
    try {
      const records = await pb
        .collection(this.collection)
        .getList(1, limit, {
          sort: '-viewCount',
          expand: 'age,category',
        });
      
      return { success: true, data: records.items };
    } catch (error) {
      console.error('Error getting featured documents:', error);
      return { success: false, error: 'Failed to get featured documents' };
    }
  }

  /**
   * Get documents by historical age
   */
  async getByHistoricalAge(ageId: string, limit: number = 8): Promise<ApiResponse<any[]>> {
    try {
      const records = await pb
        .collection(this.collection)
        .getList(1, limit, {
          filter: `age = "${ageId}"`,
          sort: '-created',
          expand: 'age,category',
        });
      
      return { success: true, data: records.items };
    } catch (error) {
      console.error('Error getting documents by age:', error);
      return { success: false, error: 'Failed to get documents' };
    }
  }

  /**
   * Get documents by category
   */
  async getByCategory(categoryId: string, limit: number = 8): Promise<ApiResponse<any[]>> {
    try {
      const records = await pb
        .collection(this.collection)
        .getList(1, limit, {
          filter: `category = "${categoryId}"`,
          sort: '-created',
          expand: 'age,category',
        });
      
      return { success: true, data: records.items };
    } catch (error) {
      console.error('Error getting documents by category:', error);
      return { success: false, error: 'Failed to get documents' };
    }
  }

  /**
   * Search documents
   */
  async search(query: string, limit: number = 20): Promise<ApiResponse<any[]>> {
    try {
      const records = await pb
        .collection(this.collection)
        .getList(1, limit, {
          filter: `title ~ "${query}" || author ~ "${query}" || description ~ "${query}"`,
          sort: '-created',
          expand: 'age,category',
        });
      
      return { success: true, data: records.items };
    } catch (error) {
      console.error('Error searching documents:', error);
      return { success: false, error: 'Failed to search documents' };
    }
  }
}

/**
 * Document Media API for handling document media files
 */
export class DocumentMediaAPI extends BaseAPI<any> {
  constructor() {
    super('document_media');
  }

  /**
   * Get media files for a document
   */
  async getByDocumentId(documentId: string): Promise<ApiResponse<any[]>> {
    try {
      const records = await pb
        .collection(this.collection)
        .getList(1, 100, {
          filter: `document = "${documentId}"`,
          sort: 'created',
        });
      
      return { success: true, data: records.items };
    } catch (error) {
      console.error('Error getting document media:', error);
      return { success: false, error: 'Failed to get document media' };
    }
  }
}

/**
 * Document Request API for handling document requests
 */
export class DocumentRequestAPI extends BaseAPI<any> {
  constructor() {
    super('document_requests');
  }

  /**
   * Get requests by user
   */
  async getByUserId(userId: string): Promise<ApiResponse<any[]>> {
    try {
      const records = await pb
        .collection(this.collection)
        .getList(1, 100, {
          filter: `user = "${userId}"`,
          sort: '-created',
        });
      
      return { success: true, data: records.items };
    } catch (error) {
      console.error('Error getting user requests:', error);
      return { success: false, error: 'Failed to get document requests' };
    }
  }
}

/**
 * Contact Message API for handling contact form submissions
 */
export class ContactMessageAPI extends BaseAPI<any> {
  constructor() {
    super('contact_messages');
  }
}

/**
 * User API for authentication and user management
 */
export class UserAPI {
  /**
   * Register a new user
   */
  async register(userData: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }): Promise<ApiResponse<User>> {
    try {
      const data = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        passwordConfirm: userData.passwordConfirm,
      };
      
      const record = await pb.collection('users').create(data);
      
      return { success: true, data: record as unknown as User };
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create account',
      };
    }
  }

  /**
   * Login a user
   */
  async login(email: string, password: string): Promise<ApiResponse<User>> {
    try {
      const authData = await pb
        .collection('users')
        .authWithPassword(email, password);
      
      return {
        success: true,
        data: authData.record as unknown as User,
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Invalid email or password',
      };
    }
  }

  /**
   * Logout the current user
   */
  logout(): void {
    pb.authStore.clear();
  }

  /**
   * Get the current authenticated user
   */
  getCurrentUser(): User | null {
    if (!pb.authStore.isValid) {
      return null;
    }
    
    const model = pb.authStore.model;
    if (!model) {
      return null;
    }
    
    return {
      id: model.id,
      collectionId: model.collectionId,
      collectionName: model.collectionName,
      created: model.created,
      updated: model.updated,
      email: model.email,
      name: model.name,
      avatar: model.avatar,
      emailVisibility: model.emailVisibility,
      verified: model.verified,
    } as User;
  }

  /**
   * Check if a user is authenticated
   */
  isAuthenticated(): boolean {
    return pb.authStore.isValid;
  }

  /**
   * Update user profile
   */
  async updateProfile(userData: {
    name?: string;
    avatar?: File;
  }): Promise<ApiResponse<User>> {
    try {
      if (!pb.authStore.isValid || !pb.authStore.model) {
        return { success: false, error: 'User not authenticated' };
      }
      
      const userId = pb.authStore.model.id;
      const record = await pb.collection('users').update(userId, userData);
      
      return { success: true, data: record as unknown as User };
    } catch (error: any) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update profile',
      };
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<ApiResponse<boolean>> {
    try {
      await pb.collection('users').requestPasswordReset(email);
      return { success: true, data: true };
    } catch (error: any) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        error: error.message || 'Failed to request password reset',
      };
    }
  }

  /**
   * Confirm password reset
   */
  async confirmPasswordReset(
    token: string,
    password: string,
    passwordConfirm: string
  ): Promise<ApiResponse<boolean>> {
    try {
      await pb.collection('users').confirmPasswordReset(
        token,
        password,
        passwordConfirm
      );
      return { success: true, data: true };
    } catch (error: any) {
      console.error('Password reset confirmation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to reset password',
      };
    }
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<ApiResponse<boolean>> {
    try {
      await pb.collection('users').confirmVerification(token);
      return { success: true, data: true };
    } catch (error: any) {
      console.error('Email verification error:', error);
      return {
        success: false,
        error: error.message || 'Failed to verify email',
      };
    }
  }
}

// Create instances of API classes for export
export const usersApi = new UserAPI();
export const historicalAgeApi = new HistoricalAgeAPI();
export const contentCategoryApi = new ContentCategoryAPI();
export const documentsApi = new DocumentsAPI();
export const documentMediaApi = new DocumentMediaAPI();
export const documentRequestApi = new DocumentRequestAPI();
export const contactMessageApi = new ContactMessageAPI(); 
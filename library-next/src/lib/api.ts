import PocketBase from 'pocketbase';
import { Record, ApiResponse, PaginatedResponse } from '@/types';

// Initialize PocketBase with default URL (can be overridden in .env files)
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090');

/**
 * Base API class that provides common CRUD operations for PocketBase collections
 */
class BaseAPI<T extends Record> {
  protected collection: string;

  constructor(collection: string) {
    this.collection = collection;
  }

  /**
   * Get all records from the collection
   * @returns ApiResponse with array of records
   */
  async getAll(): Promise<ApiResponse<T[]>> {
    try {
      const records = await pb.collection(this.collection).getFullList<T>();
      return { success: true, data: records };
    } catch (error) {
      console.error(`Error fetching ${this.collection}:`, error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  /**
   * Get a record by ID
   * @param id Record ID
   * @returns ApiResponse with the record
   */
  async getById(id: string): Promise<ApiResponse<T>> {
    try {
      const record = await pb.collection(this.collection).getOne<T>(id);
      return { success: true, data: record };
    } catch (error) {
      console.error(`Error fetching ${this.collection} with ID ${id}:`, error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  /**
   * Create a new record in the collection
   * @param data Record data
   * @returns ApiResponse with the created record
   */
  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const record = await pb.collection(this.collection).create<T>(data);
      return { success: true, data: record };
    } catch (error) {
      console.error(`Error creating ${this.collection}:`, error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  /**
   * Update an existing record
   * @param id Record ID
   * @param data Updated record data
   * @returns ApiResponse with the updated record
   */
  async update(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const record = await pb.collection(this.collection).update<T>(id, data);
      return { success: true, data: record };
    } catch (error) {
      console.error(`Error updating ${this.collection} with ID ${id}:`, error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  /**
   * Delete a record
   * @param id Record ID
   * @returns ApiResponse indicating success or failure
   */
  async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      await pb.collection(this.collection).delete(id);
      return { success: true, data: true };
    } catch (error) {
      console.error(`Error deleting ${this.collection} with ID ${id}:`, error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  /**
   * Get paginated records
   * @param page Page number (starting from 1)
   * @param perPage Records per page
   * @param sort Sort field and direction (e.g., "created-" for descending by created date)
   * @returns ApiResponse with paginated records
   */
  async getPaginated(
    page: number = 1,
    perPage: number = 20,
    sort: string = '-created'
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    try {
      const result = await pb.collection(this.collection).getList<T>(page, perPage, {
        sort,
      });

      const response: PaginatedResponse<T> = {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items,
      };

      return { success: true, data: response };
    } catch (error) {
      console.error(`Error fetching paginated ${this.collection}:`, error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  /**
   * Helper function to extract error message from PocketBase errors
   */
  protected getErrorMessage(error: any): string {
    if (error?.response?.message) {
      return error.response.message;
    }
    if (error?.data?.message) {
      return error.data.message;
    }
    if (error?.message) {
      return error.message;
    }
    return `Unknown error with ${this.collection}`;
  }
}

/**
 * API for historical ages
 */
class HistoricalAgeAPI extends BaseAPI<any> {
  constructor() {
    super('historical_ages');
  }
}

/**
 * API for content categories
 */
class ContentCategoryAPI extends BaseAPI<any> {
  constructor() {
    super('content_categories');
  }
}

/**
 * API for historical documents
 */
class DocumentsAPI extends BaseAPI<any> {
  constructor() {
    super('documents');
  }

  /**
   * Get filtered documents based on search criteria
   */
  async getFiltered(
    filters: Record<string, any> = {},
    page: number = 1,
    perPage: number = 20,
    sort: string = '-created'
  ): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const filter = Object.entries(filters)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${key}="${value}"`)
        .join(' && ');

      const result = await pb.collection('documents').getList(page, perPage, {
        filter,
        sort,
        expand: 'age,category',
      });

      const response: PaginatedResponse<any> = {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items,
      };

      return { success: true, data: response };
    } catch (error) {
      console.error('Error fetching filtered documents:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  /**
   * Increment view count for a document
   */
  async incrementViewCount(id: string): Promise<ApiResponse<any>> {
    try {
      const document = await pb.collection('documents').getOne(id);
      const viewCount = (document.view_count || 0) + 1;
      
      const updatedDocument = await pb.collection('documents').update(id, {
        view_count: viewCount,
      });
      
      return { success: true, data: updatedDocument };
    } catch (error) {
      console.error(`Error incrementing view count for document ${id}:`, error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  /**
   * Increment download count for a document
   */
  async incrementDownloadCount(id: string): Promise<ApiResponse<any>> {
    try {
      const document = await pb.collection('documents').getOne(id);
      const downloadCount = (document.download_count || 0) + 1;
      
      const updatedDocument = await pb.collection('documents').update(id, {
        download_count: downloadCount,
      });
      
      return { success: true, data: updatedDocument };
    } catch (error) {
      console.error(`Error incrementing download count for document ${id}:`, error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  /**
   * Get featured documents
   */
  async getFeatured(limit: number = 6): Promise<ApiResponse<any[]>> {
    try {
      const records = await pb.collection('documents').getList(1, limit, {
        filter: 'featured=true && status="published"',
        sort: '-created',
        expand: 'age,category',
      });
      
      return { success: true, data: records.items };
    } catch (error) {
      console.error('Error fetching featured documents:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  /**
   * Get documents by historical age
   */
  async getByHistoricalAge(ageId: string, limit: number = 10): Promise<ApiResponse<any[]>> {
    try {
      const records = await pb.collection('documents').getList(1, limit, {
        filter: `age="${ageId}" && status="published"`,
        sort: '-created',
        expand: 'age,category',
      });
      
      return { success: true, data: records.items };
    } catch (error) {
      console.error(`Error fetching documents by age ${ageId}:`, error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  /**
   * Get documents by category
   */
  async getByCategory(categoryId: string, limit: number = 10): Promise<ApiResponse<any[]>> {
    try {
      const records = await pb.collection('documents').getList(1, limit, {
        filter: `category="${categoryId}" && status="published"`,
        sort: '-created',
        expand: 'age,category',
      });
      
      return { success: true, data: records.items };
    } catch (error) {
      console.error(`Error fetching documents by category ${categoryId}:`, error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  /**
   * Search documents by query term
   */
  async search(query: string, page: number = 1, perPage: number = 20): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const result = await pb.collection('documents').getList(page, perPage, {
        filter: `(title~"${query}" || summary~"${query}" || description~"${query}") && status="published"`,
        sort: '-created',
        expand: 'age,category',
      });

      const response: PaginatedResponse<any> = {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items,
      };

      return { success: true, data: response };
    } catch (error) {
      console.error(`Error searching documents with query ${query}:`, error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }
}

/**
 * API for document media files
 */
class DocumentMediaAPI extends BaseAPI<any> {
  constructor() {
    super('document_media');
  }

  /**
   * Get media files for a specific document
   */
  async getByDocumentId(documentId: string): Promise<ApiResponse<any[]>> {
    try {
      const records = await pb.collection('document_media').getFullList({
        filter: `document="${documentId}"`,
        sort: 'display_order',
      });
      
      return { success: true, data: records };
    } catch (error) {
      console.error(`Error fetching media for document ${documentId}:`, error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }
}

/**
 * API for document requests
 */
class DocumentRequestAPI extends BaseAPI<any> {
  constructor() {
    super('document_requests');
  }

  /**
   * Get requests by user ID
   */
  async getByUserId(userId: string): Promise<ApiResponse<any[]>> {
    try {
      const records = await pb.collection('document_requests').getFullList({
        filter: `user="${userId}"`,
        sort: '-created',
        expand: 'age,category',
      });
      
      return { success: true, data: records };
    } catch (error) {
      console.error(`Error fetching requests for user ${userId}:`, error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }
}

/**
 * API for contact messages
 */
class ContactMessageAPI extends BaseAPI<any> {
  constructor() {
    super('contact_messages');
  }
}

/**
 * API for users
 */
class UserAPI extends BaseAPI<any> {
  constructor() {
    super('users');
  }

  /**
   * Register a new user
   */
  async register(
    email: string,
    password: string,
    passwordConfirm: string,
    name?: string
  ): Promise<ApiResponse<any>> {
    try {
      const data = {
        email,
        password,
        passwordConfirm,
        name,
      };

      const user = await pb.collection('users').create(data);
      
      return { success: true, data: user };
    } catch (error) {
      console.error('Error registering user:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  /**
   * Login a user with email and password
   */
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      
      return { success: true, data: authData };
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  /**
   * Log out the current user
   */
  logout(): void {
    pb.authStore.clear();
  }

  /**
   * Check if there is an authenticated user
   */
  isAuthenticated(): boolean {
    return pb.authStore.isValid;
  }

  /**
   * Get the current authenticated user
   */
  getCurrentUser(): any | null {
    if (this.isAuthenticated()) {
      return pb.authStore.model;
    }
    return null;
  }

  /**
   * Update current user's profile
   */
  async updateProfile(data: Partial<any>): Promise<ApiResponse<any>> {
    try {
      if (!this.isAuthenticated()) {
        return { success: false, error: 'Not authenticated' };
      }
      
      const userId = pb.authStore.model.id;
      const user = await pb.collection('users').update(userId, data);
      
      return { success: true, data: user };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<ApiResponse<boolean>> {
    try {
      await pb.collection('users').requestPasswordReset(email);
      
      return { success: true, data: true };
    } catch (error) {
      console.error('Error requesting password reset:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  /**
   * Confirm email change
   */
  async confirmVerification(token: string): Promise<ApiResponse<boolean>> {
    try {
      await pb.collection('users').confirmVerification(token);
      
      return { success: true, data: true };
    } catch (error) {
      console.error('Error confirming verification:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  /**
   * Request email verification
   */
  async requestVerification(email: string): Promise<ApiResponse<boolean>> {
    try {
      await pb.collection('users').requestVerification(email);
      
      return { success: true, data: true };
    } catch (error) {
      console.error('Error requesting verification:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  /**
   * Subscribe to authentication changes
   */
  subscribe(callback: (data: any) => void): (() => void) {
    const unsubscribe = pb.authStore.onChange((token, model) => {
      callback({ token, model });
    });
    
    return () => {
      unsubscribe();
    };
  }
}

// Initialize API instances
export const historicalAgeApi = new HistoricalAgeAPI();
export const contentCategoryApi = new ContentCategoryAPI();
export const documentsApi = new DocumentsAPI();
export const documentMediaApi = new DocumentMediaAPI();
export const documentRequestApi = new DocumentRequestAPI();
export const contactMessageApi = new ContactMessageAPI();
export const usersApi = new UserAPI(); 
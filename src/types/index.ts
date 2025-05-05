/**
 * Base model interface with common fields
 */
export interface BaseModel {
  id: string;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
}

/**
 * User model interface
 */
export interface User extends BaseModel {
  name?: string;
  avatar?: string;
  email: string;
  emailVisibility?: boolean;
  verified?: boolean;
}

/**
 * Historical age model interface
 */
export interface HistoricalAge extends BaseModel {
  name: string;
  description?: string;
  start_year?: number;
  end_year?: number;
}

/**
 * Content category model interface
 */
export interface ContentCategory extends BaseModel {
  name: string;
  description?: string;
  parent?: string; // Reference to another content category
}

/**
 * Document status type
 */
export type DocumentStatus = 'draft' | 'published' | 'archived';

/**
 * Historical document model interface
 */
export interface HistoricalDocument extends BaseModel {
  title: string;
  content: string;
  summary?: string;
  author: string; // Reference to a user
  age?: string; // Reference to a historical age
  category?: string; // Reference to a content category
  status: DocumentStatus;
  view_count?: number;
  published_at?: string;
  
  // Expanded relations (populated by PocketBase when using expand)
  expand?: {
    author?: User;
    age?: HistoricalAge;
    category?: ContentCategory;
  };
}

/**
 * Media file type
 */
export type MediaFileType = 'image' | 'pdf' | 'video' | 'audio' | 'other';

/**
 * Document media model interface
 */
export interface DocumentMedia extends BaseModel {
  document: string; // Reference to a historical document
  file: string;
  file_type: MediaFileType;
  file_size?: number;
  title?: string;
  description?: string;
  
  // Expanded relations
  expand?: {
    document?: HistoricalDocument;
  };
}

/**
 * Document request status type
 */
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'fulfilled';

/**
 * Document request model interface
 */
export interface DocumentRequest extends BaseModel {
  user: string; // Reference to a user
  title: string;
  description: string;
  status: RequestStatus;
  admin_notes?: string;
  fulfilled_at?: string;
  
  // Expanded relations
  expand?: {
    user?: User;
  };
}

/**
 * Contact message status type
 */
export type ContactMessageStatus = 'unread' | 'read' | 'replied';

/**
 * Contact message model interface
 */
export interface ContactMessage extends BaseModel {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
} 
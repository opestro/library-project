// Common record interface extending PocketBase Record
export interface Record {
  id: string;
  created: string;
  updated: string;
}

// User interface
export interface User extends Record {
  email: string;
  name?: string;
  avatar?: string;
  verified: boolean;
  role: 'user' | 'admin' | 'moderator';
}

// Historical Age interface
export interface HistoricalAge extends Record {
  name: string;
  description?: string;
  start_year?: number;
  end_year?: number;
  icon?: string;
}

// Content Category interface
export interface ContentCategory extends Record {
  name: string;
  description?: string;
  icon?: string;
}

// Historical Document interface
export interface HistoricalDocument extends Record {
  title: string;
  summary?: string;
  description: string;
  historical_context?: string;
  source?: string;
  source_type?: string;
  language?: string;
  published_at?: string;
  view_count: number;
  download_count: number;
  age?: string;
  category?: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  cover_image?: string;
  tags?: string[];
  
  // Expanded relations
  expand?: {
    age?: HistoricalAge;
    category?: ContentCategory;
    author?: User;
  };
}

// Document Media interface
export interface DocumentMedia extends Record {
  document: string;
  title?: string;
  description?: string;
  file: string;
  file_type: 'image' | 'pdf' | 'document' | 'audio' | 'video' | 'other';
  display_order: number;
  
  // Expanded relations
  expand?: {
    document?: HistoricalDocument;
  };
}

// Document Request interface
export interface DocumentRequest extends Record {
  title: string;
  description: string;
  age?: string;
  category?: string;
  urgency: 'low' | 'normal' | 'high';
  additional_info?: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  user: string;
  admin_notes?: string;
  
  // Expanded relations
  expand?: {
    age?: HistoricalAge;
    category?: ContentCategory;
    user?: User;
  };
}

// Contact Message interface
export interface ContactMessage extends Record {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  reply?: string;
  replied_at?: string;
  replied_by?: string;
  
  // Expanded relations
  expand?: {
    replied_by?: User;
  };
}

// API Response interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Paginated Response interface
export interface PaginatedResponse<T> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
} 
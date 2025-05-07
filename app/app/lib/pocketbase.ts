import PocketBase from 'pocketbase';

/**
 * PocketBase client singleton for database operations
 * This ensures we only create one instance throughout the app
 */
const pb = new PocketBase('https://pocketbase-v0g004oc8w880o8ks0k40kwc.cscclub.space');

export default pb;

// Types based on our PocketBase schema
export interface BaseModel {
  id: string;
  created: string;
  updated: string;
}

export interface Age extends BaseModel {
  name: string;
  description: string;
  start_year: number | null;
  end_year: number | null;
  image?: string;
}

export interface Category extends BaseModel {
  name: string;
  description: string;
  parent?: string;
}

export interface Document extends BaseModel {
  title: string;
  description?: string;
  content: string;
  summary?: string;
  author: string;
  age?: string;
  category?: string;
  view_count?: number;
  published_at?: string;
  image?: string;
  voice?: string;
  video?: string;
  expand?: {
    age?: Age;
    category?: Category;
    author?: {
      id: string;
      name: string;
    };
  };
}

export interface User extends BaseModel {
  email: string;
  name?: string;
  avatar?: string;
  verified: boolean;
} 

import PocketBase from 'pocketbase';

// PocketBase server URL
export const POCKETBASE_URL = 'http://127.0.0.1:8090';

let pb: PocketBase;

// Initialize PocketBase with lazy initialization to ensure it's created on the client side only
export function getPocketBase() {
  if (!pb) {
    pb = new PocketBase(POCKETBASE_URL);
    
    // Only run in the browser (not during SSR)
    if (typeof window !== 'undefined') {
      // Auto-restore auth from local storage if available
      const storedToken = localStorage.getItem('pb_auth');
      if (storedToken) {
        try {
          pb.authStore.save(JSON.parse(storedToken));
        } catch (error) {
          console.error('Failed to restore auth', error);
          pb.authStore.clear();
        }
      }
    }
  }
  return pb;
}

// Admin token for secure operations
export const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE3NDc0MTAzMjAsImlkIjoiMTlhdzY0aXg5eHdjazN6IiwicmVmcmVzaGFibGUiOmZhbHNlLCJ0eXBlIjoiYXV0aCJ9.HrBGf93jJYf-sJFotQBre_mxf8bFQpHhfLPayso3gXM";

// Get admin PocketBase instance (with token)
export function getAdminPocketBase() {
  const adminPb = new PocketBase(POCKETBASE_URL);
  
  // Use the token directly without trying to manually create the model
  adminPb.authStore.save(ADMIN_TOKEN, null);
  return adminPb;
}

// Helper to check if the user is authenticated
export function isAuthenticated() {
  const pb = getPocketBase();
  return pb.authStore.isValid;
}

// Helper to get the current user
export function getCurrentUser() {
  const pb = getPocketBase();
  return pb.authStore.model;
}

// Clear authentication (logout)
export function clearAuth() {
  const pb = getPocketBase();
  pb.authStore.clear();
} 
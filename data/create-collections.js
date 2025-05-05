/**
 * Create Collections Script
 * 
 * This script creates the necessary collections in PocketBase for our test data.
 */
const axios = require('axios');

// PocketBase URL
const PB_URL = 'http://127.0.0.1:8090';
const API_URL = `${PB_URL}/api`;

// Get admin credentials from environment variables or use defaults
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || 'your-email@example.com';
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || 'your-password';

// Collection schemas
const collections = [
  {
    name: 'ages',
    type: 'base',
    schema: [
      {
        name: 'name',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        type: 'editor',
        required: false,
      },
      {
        name: 'sort_order',
        type: 'number',
        required: false,
      }
    ]
  },
  {
    name: 'categories',
    type: 'base',
    schema: [
      {
        name: 'name',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        type: 'text',
        required: false,
      },
      {
        name: 'icon',
        type: 'text',
        required: false,
      }
    ]
  },
  {
    name: 'users',
    type: 'auth',
    schema: [
      {
        name: 'name',
        type: 'text',
        required: true,
      },
      {
        name: 'avatar',
        type: 'file',
        required: false,
      },
      {
        name: 'role',
        type: 'text',
        required: false,
      },
      {
        name: 'bio',
        type: 'text',
        required: false,
      }
    ]
  },
  {
    name: 'documents',
    type: 'base',
    schema: [
      {
        name: 'title',
        type: 'text',
        required: true,
      },
      {
        name: 'summary',
        type: 'text',
        required: false,
      },
      {
        name: 'content',
        type: 'editor',
        required: true,
      },
      {
        name: 'age',
        type: 'relation',
        required: false,
        options: {
          collectionId: 'ages',
          cascadeDelete: false,
        }
      },
      {
        name: 'category',
        type: 'relation',
        required: false,
        options: {
          collectionId: 'categories',
          cascadeDelete: false,
        }
      },
      {
        name: 'published_at',
        type: 'date',
        required: false,
      },
      {
        name: 'page_count',
        type: 'number',
        required: false,
      },
      {
        name: 'view_count',
        type: 'number',
        required: false,
      },
      {
        name: 'download_count',
        type: 'number',
        required: false,
      },
      {
        name: 'is_premium',
        type: 'bool',
        required: false,
      }
    ]
  },
  {
    name: 'document_media',
    type: 'base',
    schema: [
      {
        name: 'document',
        type: 'relation',
        required: true,
        options: {
          collectionId: 'documents',
          cascadeDelete: true,
        }
      },
      {
        name: 'title',
        type: 'text',
        required: false,
      },
      {
        name: 'description',
        type: 'text',
        required: false,
      },
      {
        name: 'file',
        type: 'file',
        required: true,
      },
      {
        name: 'file_type',
        type: 'text',
        required: false,
      }
    ]
  }
];

// Login as admin
async function adminLogin() {
  try {
    const response = await axios.post(`${API_URL}/admins/auth-with-password`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    
    return response.data.token;
  } catch (error) {
    console.error('Admin login failed:', error.response?.data || error.message);
    return null;
  }
}

// Create a collection
async function createCollection(token, collection) {
  try {
    const response = await axios.post(`${API_URL}/collections`, collection, {
      headers: {
        'Authorization': `Admin ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error creating collection ${collection.name}:`, error.response?.data || error.message);
    return null;
  }
}

// Main function
async function createCollections() {
  console.log('Starting collection creation...');
  
  // Log in as admin
  const token = await adminLogin();
  if (!token) {
    console.error('Admin login failed. Please check your credentials.');
    return;
  }
  
  // Create each collection
  for (const collection of collections) {
    console.log(`Creating collection: ${collection.name}...`);
    const result = await createCollection(token, collection);
    if (result) {
      console.log(`Successfully created collection: ${collection.name}`);
    }
  }
  
  console.log('Collection creation completed!');
}

// Run the script
createCollections().catch(err => {
  console.error('Collection creation failed:', err);
}); 
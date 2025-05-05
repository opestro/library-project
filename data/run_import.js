/**
 * Run Import Script
 * 
 * This script imports test data into PocketBase assuming collections already exist.
 * It avoids admin authentication and uses the public API.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// PocketBase URL
const PB_URL = 'http://127.0.0.1:8090';
const API_URL = `${PB_URL}/api`;

// Read JSON data files
const ages = JSON.parse(fs.readFileSync(path.join(__dirname, 'ages.json')));
const categories = JSON.parse(fs.readFileSync(path.join(__dirname, 'categories.json')));
const documents = JSON.parse(fs.readFileSync(path.join(__dirname, 'documents.json')));
const documentMedia = JSON.parse(fs.readFileSync(path.join(__dirname, 'document_media.json')));

// Helper function to create records
async function createRecord(collection, data, file = null) {
  try {
    let response;
    
    if (file) {
      const formData = new FormData();
      
      // Add all data fields to form data
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      }
      
      // Add file
      const filePath = path.join(__dirname, file.folder, file.filename);
      if (fs.existsSync(filePath)) {
        formData.append(file.field, fs.createReadStream(filePath));
      } else {
        console.error(`File not found: ${filePath}`);
        return null;
      }
      
      response = await axios.post(`${API_URL}/collections/${collection}/records`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
    } else {
      response = await axios.post(`${API_URL}/collections/${collection}/records`, data);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error creating ${collection} record:`, error.response?.data || error.message);
    return null;
  }
}

// Main import function
async function importData() {
  console.log('Starting test data import...');
  
  // First, check if collections exist
  try {
    const collections = await axios.get(`${API_URL}/collections`);
    console.log('Found collections:', collections.data.items.map(c => c.name).join(', '));
  } catch (error) {
    console.log('Could not retrieve collections. Make sure PocketBase is running and collections are created.');
    console.log('Proceeding with import anyway...');
  }
  
  // 1. Import Ages
  console.log('\nImporting Historical Ages...');
  for (const age of ages) {
    try {
      const result = await createRecord('ages', age);
      if (result) {
        console.log(`Created age: ${age.name}`);
      }
    } catch (error) {
      console.error(`Error importing age ${age.name}:`, error.message);
    }
  }
  
  // 2. Import Categories
  console.log('\nImporting Content Categories...');
  for (const category of categories) {
    try {
      const result = await createRecord('categories', category);
      if (result) {
        console.log(`Created category: ${category.name}`);
      }
    } catch (error) {
      console.error(`Error importing category ${category.name}:`, error.message);
    }
  }
  
  // 3. Import Documents
  console.log('\nImporting Documents...');
  for (const document of documents) {
    try {
      const result = await createRecord('documents', document);
      if (result) {
        console.log(`Created document: ${document.title}`);
      }
    } catch (error) {
      console.error(`Error importing document ${document.title}:`, error.message);
    }
  }
  
  // 4. Import Document Media
  console.log('\nImporting Document Media...');
  for (const media of documentMedia) {
    try {
      const mediaData = { ...media };
      const result = await createRecord('document_media', mediaData, {
        field: 'file',
        folder: 'images',
        filename: media.file
      });
      if (result) {
        console.log(`Created media: ${media.title} for document ${media.document}`);
      }
    } catch (error) {
      console.error(`Error importing media ${media.title}:`, error.message);
    }
  }
  
  console.log('\nImport process completed!');
}

// Run the import
importData().catch(err => {
  console.error('Import failed:', err);
}); 
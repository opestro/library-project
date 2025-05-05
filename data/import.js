/**
 * Import Test Data Script
 * 
 * This script imports test data into PocketBase.
 * It inserts historical ages, categories, users, documents and media files.
 */
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
const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json')));
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
        formData.append(key, value);
      }
      
      // Add file
      const filePath = path.join(__dirname, file.folder, file.filename);
      formData.append(file.field, fs.createReadStream(filePath));
      
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
  
  // 1. Import Ages
  console.log('Importing Historical Ages...');
  for (const age of ages) {
    const result = await createRecord('ages', age);
    if (result) {
      console.log(`Created age: ${age.name} (${age.id})`);
    }
  }
  
  // 2. Import Categories
  console.log('Importing Content Categories...');
  for (const category of categories) {
    const result = await createRecord('categories', category);
    if (result) {
      console.log(`Created category: ${category.name} (${category.id})`);
    }
  }
  
  // 3. Import Users
  console.log('Importing Users...');
  for (const user of users) {
    const userData = { ...user };
    const result = await createRecord('users', userData, {
      field: 'avatar',
      folder: 'avatars',
      filename: user.avatar
    });
    if (result) {
      console.log(`Created user: ${user.name} (${user.id})`);
    }
  }
  
  // 4. Import Documents
  console.log('Importing Documents...');
  for (const document of documents) {
    const result = await createRecord('documents', document);
    if (result) {
      console.log(`Created document: ${document.title} (${document.id})`);
    }
  }
  
  // 5. Import Document Media
  console.log('Importing Document Media...');
  for (const media of documentMedia) {
    const mediaData = { ...media };
    const result = await createRecord('document_media', mediaData, {
      field: 'file',
      folder: 'images',
      filename: media.file
    });
    if (result) {
      console.log(`Created media: ${media.title} for document ${media.document}`);
    }
  }
  
  console.log('Import process completed!');
}

// Run the import
importData().catch(err => {
  console.error('Import failed:', err);
}); 
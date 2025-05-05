# Step-by-Step Guide for Importing Test Data into PocketBase

This guide will walk you through the process of importing the test data for the Historical Library project into PocketBase.

## Prerequisites

- PocketBase is running at http://127.0.0.1:8090
- You have admin access to PocketBase
- Node.js is installed on your system

## Step 1: Access the PocketBase Admin UI

1. Open your browser and navigate to http://127.0.0.1:8090/_/
2. Log in with your admin credentials

## Step 2: Import Collection Schemas

1. In the PocketBase Admin UI, click on "Settings" in the sidebar
2. Select "Import Collections"
3. Click "Choose File" and select the `schema.json` file from the data directory
4. Click "Import" to create the collections

## Step 3: Verify Collections

After importing, verify that the following collections have been created:

- `ages` - Historical periods
- `categories` - Document categories
- `documents` - Historical documents
- `document_media` - Document images/files

You can check this by looking at the sidebar in the PocketBase Admin UI.

## Step 4: Import Data with Node.js

1. Open a terminal/command prompt
2. Navigate to the data directory
3. Install dependencies (if you haven't already):
   ```
   npm install
   ```
4. Run the import script:
   ```
   node run_import.js
   ```
5. The script will output the progress of the data import

## Step 5: Verify Data Import

1. In the PocketBase Admin UI, click on each collection to verify that data has been imported
2. For example, click on "ages" and you should see 4 records

## Step 6: Test in the Application

1. Open your application in the browser
2. Navigate to the browse page to see the imported documents
3. Try selecting different categories and ages to filter the documents

## Troubleshooting

### "Collection not found" error

If you see "Collection not found" errors, make sure that the collection names in the `schema.json` file match exactly with the collection names in PocketBase. Collection names are case-sensitive.

### "File not found" error

If you see "File not found" errors, check that:
1. All image files are in the correct directories (`images/` and `avatars/`)
2. The filenames match those in the JSON data files

### Other errors

If you encounter other errors:
1. Check the console output for specific error messages
2. Verify that PocketBase is running
3. Check that you can access the PocketBase Admin UI
4. Try deleting the collections and starting over

## Manual Import (Alternative)

If the automated script doesn't work, you can manually import the data:

1. In the PocketBase Admin UI, click on a collection (e.g., "ages")
2. Click "New record"
3. Manually enter the data from the corresponding JSON file
4. Repeat for all collections and records 
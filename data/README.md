# Test Data Import

This directory contains test data for the Historical Library project and scripts to import it into PocketBase.

## Prerequisites

- Node.js installed
- PocketBase running at http://127.0.0.1:8090
- PocketBase admin account created

## Files

- `ages.json` - Historical ages test data
- `categories.json` - Content categories test data
- `users.json` - Users (authors) test data
- `documents.json` - Historical documents test data
- `document_media.json` - Document media test data
- `images/` - Placeholder images for document media
- `avatars/` - Placeholder avatar images for users
- `schema.json` - Collection schema for importing into PocketBase
- `run_import.js` - Script to import test data into PocketBase

## Setup

1. Install dependencies:
   ```
   npm install
   ```

## Usage

### Step 1: Create Collections in PocketBase Admin UI

1. Open the PocketBase Admin UI at http://127.0.0.1:8090/_/
2. Log in with your admin credentials
3. Go to Settings > Import Collections
4. Upload the `schema.json` file
5. Confirm the import

### Step 2: Import Test Data

Run the import script:

```
node run_import.js
```

This will import all the test data, including:
- 4 historical ages
- 5 document categories
- 5 historical documents
- 9 document media items

## Data Content

### Historical Ages
- Ancient Era (العصر القديم)
- Medieval Era (العصر الوسيط)
- Modern Era (العصر الحديث)
- Contemporary Era (العصر المعاصر)

### Document Categories
- Manuscripts (مخطوطات)
- Historical Maps (خرائط تاريخية)
- Official Correspondence (مراسلات رسمية)
- Treaties and Agreements (معاهدات واتفاقيات)
- Financial Records (سجلات مالية)

### Example Documents
- Peace of Westphalia Treaty (معاهدة وستفاليا للسلام)
- Constitution of Medina (صحيفة المدينة)
- Al-Idrisi World Map (خريطة الإدريسي للعالم)
- Einstein's Letters to Roosevelt (رسائل ألبرت أينشتاين إلى فرانكلين روزفلت)
- Silk Road Trade Ledger (دفتر تجارة الحرير في طريق الحرير)

## Customization

You can modify the JSON files to add more test data or modify the existing data. If you add new media files, make sure to place them in the appropriate directories:

- Document images: `images/`
- User avatars: `avatars/`

## Troubleshooting

- **Collection already exists**: If a collection already exists with the same name in PocketBase, the import might fail.
- **Import errors**: Check the console output for details about any import errors.
- **File not found**: Ensure all referenced image files exist in the correct directories.

## Reset

To reset the test data, you can delete the collections in the PocketBase Admin UI and start the process again. 
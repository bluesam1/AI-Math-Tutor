# Testing Vision API Integration

## Prerequisites

1. **OpenAI API Key**: Get your API key from https://platform.openai.com/api-keys
2. **Firebase CLI**: Ensure Firebase CLI is installed and you're logged in
3. **Test Image**: Prepare a math problem image (JPG, PNG, or GIF) for testing

## Setup Steps

### 1. Configure Environment Variable

Create a `.env` file in the `functions/` directory:

```bash
cd functions
```

Create `.env` file:

```env
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=your-openai-api-key-here
```

**Important**: Replace `your-openai-api-key-here` with your actual OpenAI API key.

### 2. Build the Functions

```bash
cd functions
npm run build
```

## Testing Methods

### Method 1: Using Firebase Emulators (Recommended)

#### Start the Emulators

From the project root:

```bash
npm run dev:emulators
```

Or from the functions directory:

```bash
cd functions
npm run serve
```

The emulator will start on:
- Functions: `http://localhost:5001`
- Emulator UI: `http://localhost:4000`

#### Get Your Project ID

Check your Firebase project ID from `firebase.json` or run:

```bash
firebase projects:list
```

#### Test Endpoint URL

The endpoint will be available at:
```
http://localhost:5001/{project-id}/us-central1/api/problem/parse-image
```

Replace `{project-id}` with your actual Firebase project ID.

### Method 2: Using curl

#### Test with Valid Image

```bash
curl -X POST \
  http://localhost:5001/{project-id}/us-central1/api/problem/parse-image \
  -F "image=@/path/to/your/math-problem.jpg"
```

**Example with a test image:**

```bash
curl -X POST \
  http://localhost:5001/learn-math-2/us-central1/api/problem/parse-image \
  -F "image=@./test-image.jpg" \
  -H "Content-Type: multipart/form-data"
```

#### Expected Success Response

```json
{
  "success": true,
  "problemText": "Solve for x: 2x + 5 = 15"
}
```

#### Test with Invalid File Format

```bash
curl -X POST \
  http://localhost:5001/{project-id}/us-central1/api/problem/parse-image \
  -F "image=@/path/to/your/file.pdf"
```

**Expected Error Response:**

```json
{
  "success": false,
  "error": "Invalid file format",
  "message": "Only JPG, PNG, and GIF image files are allowed"
}
```

#### Test with File Too Large

Create a file larger than 10MB, or use an existing large file:

```bash
curl -X POST \
  http://localhost:5001/{project-id}/us-central1/api/problem/parse-image \
  -F "image=@/path/to/large-file.jpg"
```

**Expected Error Response:**

```json
{
  "success": false,
  "error": "File too large",
  "message": "File size must be less than 10MB"
}
```

#### Test with No File

```bash
curl -X POST \
  http://localhost:5001/{project-id}/us-central1/api/problem/parse-image
```

**Expected Error Response:**

```json
{
  "success": false,
  "error": "No file uploaded",
  "message": "Please upload an image file"
}
```

### Method 3: Using Postman

1. **Open Postman** and create a new request
2. **Set Method**: POST
3. **Set URL**: 
   ```
   http://localhost:5001/{project-id}/us-central1/api/problem/parse-image
   ```
4. **Go to Body tab**:
   - Select `form-data`
   - Add key: `image` (type: File)
   - Click "Select Files" and choose your test image
5. **Send Request**

### Method 4: Using JavaScript/Frontend

```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await fetch(
  'http://localhost:5001/{project-id}/us-central1/api/problem/parse-image',
  {
    method: 'POST',
    body: formData,
  }
);

const data = await response.json();
console.log(data);
```

## Test Scenarios Checklist

### ✅ Valid Image Tests

- [ ] **Valid JPG image with math problem**
  - Expected: Success response with extracted problem text
  
- [ ] **Valid PNG image with math problem**
  - Expected: Success response with extracted problem text
  
- [ ] **Valid GIF image with math problem**
  - Expected: Success response with extracted problem text

### ✅ Validation Tests

- [ ] **Invalid file format (PDF, DOC, etc.)**
  - Expected: Error response with "Invalid file format" message
  
- [ ] **File too large (>10MB)**
  - Expected: Error response with "File too large" message
  
- [ ] **No file uploaded**
  - Expected: Error response with "No file uploaded" message
  
- [ ] **File with wrong field name**
  - Expected: Error response with "Unexpected file field" message

### ✅ Vision API Tests

- [ ] **Image with clear math problem**
  - Expected: Extracted text contains math content
  
- [ ] **Image with no math content**
  - Expected: Error response with "Invalid math content" message
  
- [ ] **Image with unreadable text**
  - Expected: Error response or empty text extraction

### ✅ Error Handling Tests

- [ ] **Invalid API key**
  - Expected: Error response with "Configuration error" message
  
- [ ] **Rate limit exceeded**
  - Expected: Error response with "Rate limit exceeded" message (429 status)
  
- [ ] **Network error simulation**
  - Expected: Error response with "Processing error" message

## Troubleshooting

### Issue: "OPENAI_API_KEY environment variable is not set"

**Solution**: 
1. Ensure `.env` file exists in `functions/` directory
2. Check that `OPENAI_API_KEY` is set correctly
3. Restart the emulator after adding/updating `.env`

### Issue: "Cannot find module 'openai'"

**Solution**:
```bash
cd functions
npm install
```

### Issue: "Function not found" or 404 error

**Solution**:
1. Check that the project ID in the URL matches your Firebase project ID
2. Ensure the function is built: `npm run build` in functions directory
3. Check emulator logs for errors

### Issue: "CORS error" when testing from browser

**Solution**: 
- CORS is configured for the frontend URL
- For direct API testing, use curl or Postman
- Or test through the frontend application

## Viewing Logs

### Firebase Emulator Logs

Logs appear in the terminal where you started the emulator.

### Function Logs

```bash
# View all function logs
firebase functions:log

# View specific function logs
firebase functions:log --only api
```

## Example Test Images

For testing, you can use:
1. A clear photo of a math problem written on paper
2. A screenshot of a math problem from a textbook
3. A typed math problem saved as an image

**Good test image characteristics:**
- Clear, readable text
- Good lighting (if photo)
- Contains actual math problem (not just text)
- Within 10MB size limit
- JPG, PNG, or GIF format

## Next Steps

After successful testing:
1. ✅ Mark Task 11 as complete in Story 1.6
2. Proceed to Task 12: Frontend integration
3. Test end-to-end flow from frontend


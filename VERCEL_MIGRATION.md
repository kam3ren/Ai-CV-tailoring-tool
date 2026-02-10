# Vercel Serverless Migration Guide

## Overview

The AI CV Tailoring Tool backend has been migrated from Flask to **Vercel Serverless Python Functions** to enable deployment on Vercel's free tier.

### What Changed?
- **Before**: Traditional Flask REST API running as a persistent process
- **After**: Serverless Python functions (one per endpoint) deployed via Vercel

### What Stayed the Same?
- ✅ All CV processing logic (PyPDF2, python-docx text extraction)
- ✅ All error handling and validation
- ✅ All React frontend components
- ✅ All API response formats

## Architecture

### File Structure
```
ai-cv-project/
├── ai-cv-frontend/          # React frontend (Vite)
│   ├── src/
│   ├── vite.config.js       # ← Updated with API proxy
│   ├── package.json
│   └── .env.local.example
│
├── backend/                 # Backend logic
│   ├── cv_processor.py      # ← Moved to backend/ (shared by all functions)
│   └── api/                 # Vercel serverless functions
│       ├── __init__.py
│       ├── health.py        # GET /api/health
│       └── analyze_cv.py    # POST /api/upload-cv, /api/analyze_cv
│
├── vercel.json              # ← Vercel configuration
├── requirements.txt         # ← Root-level Python dependencies
└── README.md
```

### API Endpoints

Both endpoints work the same way as before:

#### Health Check
```bash
GET /api/health
```
**Response:**
```json
{
  "success": true,
  "message": "Backend is running",
  "data": {
    "status": "healthy"
  }
}
```

#### CV Upload
```bash
POST /api/upload-cv
Content-Type: multipart/form-data

{
  "file": <CV file (PDF, DOCX)>
}
```
**Response (Success):**
```json
{
  "success": true,
  "message": "CV 'resume.pdf' uploaded successfully",
  "data": {
    "filename": "resume.pdf",
    "file_size_mb": 0.5,
    "file_type": "pdf",
    "content_preview": "...",
    "full_path": "temporary-resume.pdf"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error_code": "file_too_large",
  "message": "File size exceeds maximum limit of 10MB",
  "details": {
    "max_size_mb": 10,
    "file_size_mb": 15.2
  }
}
```

### Error Codes (Unchanged)
- `missing_file` - No file provided (400)
- `invalid_file_type` - Unsupported file format (400)
- `file_too_large` - Exceeds 10MB limit (413)
- `empty_file` - File is empty (400)
- `corrupted_file` - File is corrupted (422)
- `unreadable_pdf` - PDF cannot be read (422)
- `pdf_processing_error` - PDF processing failed (500)
- `docx_processing_error` - DOCX processing failed (500)
- `unsupported_format` - File format not supported (400)
- `server_error` - Unexpected error (500)

## Frontend Changes

### CVUpload.jsx
```javascript
// BEFORE:
const response = await fetch('http://localhost:5000/api/upload-cv', {

// AFTER:
const response = await fetch('/api/upload-cv', {
```

Now uses relative URLs that work in both development and production.

### vite.config.js
Added API proxy for local development:
```javascript
server: {
  proxy: {
    '/api': {
      target: process.env.API_URL || 'http://localhost:5000',
      changeOrigin: true
    }
  }
}
```

## Local Development

### Option 1: With Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Start the development environment:**
   ```bash
   # At project root
   vercel dev
   ```
   This starts both the frontend (localhost:3000) and serverless API functions.

3. **Test the endpoints:**
   ```bash
   # Frontend
   http://localhost:3000
   
   # Health check
   curl http://localhost:3000/api/health
   
   # Upload CV
   curl -X POST -F "file=@resume.pdf" http://localhost:3000/api/upload-cv
   ```

### Option 2: Traditional Setup (Frontend + Flask Backend)

If you want to use Flask for local development:

1. **Start Flask backend:**
   ```bash
   cd Backend
   python -m flask run --host=0.0.0.0 --port=5000
   ```

2. **Start frontend in another terminal:**
   ```bash
   cd ai-cv-frontend
   npm run dev
   ```

3. **Access the app:**
   ```
   http://localhost:5173
   ```

   The Vite proxy (vite.config.js) will forward API calls to `http://localhost:5000`

### Option 3: Manual Backend Testing

Test the serverless functions without running the full dev server:

```bash
# Install dependencies
pip install -r requirements.txt

# Test health endpoint
python -c "
from backend.api.health import handler
class MockRequest:
    method = 'GET'
result = handler(MockRequest())
print(result)
"

# Test CV upload
# (Would need mock file object, see integration tests)
```

## Deployment to Vercel

### Prerequisites
- Vercel account (free tier works)
- GitHub repository with the code
- Python 3.11+ runtime

### Steps

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Migrate backend to Vercel serverless"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Vercel detects:**
   - ✅ Frontend: Vite React app → builds to `ai-cv-frontend/dist`
   - ✅ Backend: Python serverless functions → from `backend/api/`
   - ✅ Dependencies: Installs from `requirements.txt`

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your app is now live!

5. **View deployment:**
   ```
   Frontend: https://your-project.vercel.app
   API:      https://your-project.vercel.app/api/health
   ```

### Environment Variables on Vercel

If you need environment variables:

1. Go to Project Settings → Environment Variables
2. Add any needed variables
3. They'll be available to Python functions as `os.environ['VAR_NAME']`

## Important Notes

### File Storage on Vercel

**The ephemeral `/tmp` directory:**
- Files uploaded via serverless functions are stored in `/tmp`
- These files are **deleted after the function completes**
- This is normal behavior for serverless platforms

**For production use:**
- Use a cloud storage service (AWS S3, Azure Blob, etc.)
- Or a database with file support
- Update `cv_processor.py` `save_file()` function accordingly

### Cold Starts
- First request to a serverless function may take 1-2 seconds
- Subsequent requests are faster
- This is normal and not a problem for typical usage

### Concurrent Requests
- Vercel free tier allows multiple concurrent function invocations
- Each request spins up independently
- No shared state between requests (as intended for serverless)

## Troubleshooting

### Issue: "Module not found: cv_processor"

**Cause:** Python import path issue
**Solution:** Ensure `cv_processor.py` is at `backend/cv_processor.py` (not in a subdirectory)

### Issue: "File too large" error in production

**Cause:** Vercel has payload limits
**Solution:** 
- Check max payload size in `vercel.json` (set in request handler)
- Keep files under 10MB
- Vercel free tier: max 3 seconds execution time

### Issue: "CORS errors" in frontend

**Cause:** Missing CORS headers
**Solution:** Headers are set in `api/analyze_cv.py` in the handler:
```python
'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Methods': 'POST, OPTIONS',
'Access-Control-Allow-Headers': 'Content-Type'
```

### Issue: Relative paths not working locally

**Cause:** API proxy not configured
**Solution:** 
1. Check `vite.config.js` has server proxy
2. Set `API_URL` in `.env.local` if using custom backend
3. Run `npm run dev` in `ai-cv-frontend` directory

## Reverting to Flask (if needed)

If you need to go back to Flask locally:

1. **Comment out the proxy in vite.config.js:**
   ```javascript
   // server: { proxy: { ... } },  // Disabled
   ```

2. **Update CVUpload.jsx:**
   ```javascript
   const response = await fetch('http://localhost:5000/api/upload-cv', {
   ```

3. **Run Flask backend:**
   ```bash
   cd Backend
   python -m flask run
   ```

## Migration Checklist

- ✅ Backend converted to serverless functions
- ✅ Frontend API endpoints updated to use relative URLs
- ✅ `vercel.json` created with routing rules
- ✅ `requirements.txt` at project root
- ✅ Vite proxy configured for local development
- ✅ CORS headers configured in handlers
- ✅ Error handling preserved
- ✅ All CSV processing logic unchanged

## Next Steps

1. **Test locally:** `vercel dev` or traditional setup
2. **Push to GitHub:** `git push origin main`
3. **Deploy to Vercel:** Connect repository in Vercel dashboard
4. **Verify endpoints:** Test health check and file upload
5. Update documentation as needed for your team

## Support Resources

- [Vercel Python Runtime Documentation](https://vercel.com/docs/functions/serverless-functions/python)
- [Vercel Configuration File](https://vercel.com/docs/projects/project-configuration)
- [Vite Configuration](https://vitejs.dev/config/)
- [Flask to Vercel Migration Guide](https://vercel.com/guides/deploying-flask-with-vercel)

---

**Migration completed on:** 2024
**Backend type:** Vercel Serverless Python
**Environment:** Production-ready

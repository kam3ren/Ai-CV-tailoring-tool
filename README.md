# AI CV Tailoring Tool

A modern web application that helps users tailor their CVs to job descriptions using AI-powered analysis. Built with React frontend and Vercel Serverless Python backend.

## 🎯 Features

- **CV Upload & Processing** - Upload PDF or DOCX files with real-time validation
- **Smart File Handling** - Automatic text extraction from CV files
- **Error Management** - 8+ error scenarios with user-friendly messages and retry logic
- **Job Description Input** - Paste job descriptions for analysis
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Dark Mode Support** - Professional dark theme included
- **Serverless Deployment** - Deploys on Vercel's free tier

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Project Architecture](#project-architecture)

---

## 🚀 Quick Start

### Minimal Setup (Vercel Deployment Only)
```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy to Vercel"
git push origin main

# 2. Go to vercel.com → New Project → Import Repository
# 3. Deploy (Vercel auto-detects configuration)

# 4. Access your app
https://your-project.vercel.app
```

### Local Development (Vercel CLI)
```bash
# Install Vercel CLI globally
npm install -g vercel

# Start local development environment
cd /path/to/ai-cv-tailoring-tool
vercel dev

# Opens http://localhost:3000
# Both frontend and API functions run locally with hot reload
```

---

## 📁 Project Structure

```
ai-cv-project/
│
├── ai-cv-frontend/                 # React Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── CVUpload.jsx         # CV file upload component
│   │   │   ├── JobDescription.jsx   # Job description input
│   │   │   ├── AIprompt.jsx         # AI prompt customization
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   ├── Footer.jsx           # Footer component
│   │   │   └── components.css       # Component styles
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # Home/landing page
│   │   │   ├── Upload.jsx           # Upload workflow page
│   │   │   └── Upload.css           # Upload page styles
│   │   ├── App.jsx                  # Main app component
│   │   ├── App.css                  # Global styles
│   │   ├── index.css                # Base styles
│   │   └── main.jsx                 # Entry point
│   ├── vite.config.js               # Vite configuration
│   ├── eslint.config.js             # Code quality rules
│   ├── package.json                 # Frontend dependencies
│   └── .env.local.example           # Environment config template
│
├── backend/                         # Python serverless backend
│   ├── api/                         # Vercel serverless functions
│   │   ├── __init__.py              # Package marker
│   │   ├── health.py                # GET /api/health endpoint
│   │   └── analyze_cv.py            # POST /api/upload-cv endpoint
│   └── cv_processor.py              # Shared CV processing logic
│
├── vercel.json                      # Vercel deployment configuration
├── requirements.txt                 # Python dependencies
├── package-lock.json                # Frontend lock file
└── README.md                        # This file
```

---

## ⚙️ Requirements

### System Requirements
- Node.js 20+ (for frontend & Vercel CLI - **required for vercel dev**)
- Python 3.11+ (for backend)
- npm 10+ or yarn (for package management)

### Runtime Dependencies

**Frontend:**
- React 19.2.0
- React Router 7.13.0
- Vite 6.4.1
- Modern browser (Chrome, Firefox, Safari, Edge)

**Backend:**
- PyPDF2 3.0.1 (PDF text extraction)
- python-docx 1.0.0 (DOCX text extraction)
- Werkzeug 3.0.1 (Utilities)

---

## 📦 Installation

### 1. Clone Repository
```bash
git clone https://github.com/your-username/ai-cv-tailoring-tool.git
cd ai-cv-tailoring-tool
```

### 2. Install Frontend Dependencies
```bash
cd ai-cv-frontend
npm install
cd ..
```

### 3. Install Backend Dependencies
```bash
# Create virtual environment (optional but recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### 4. Upgrade Node.js (if needed)

Your Node.js version must be **20+** for Vercel CLI to work:

```bash
# Check current version
node --version  # If < v20, upgrade below

# Method 1: Using Homebrew (macOS)
brew upgrade node

# Method 2: Download from nodejs.org
# Visit https://nodejs.org and download LTS v20+

# Method 3: Using nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# Verify upgrade
node --version  # Should show v20.x.x or higher
npm --version   # Should show 10+
```

### 5. Install Vercel CLI
```bash
npm install -g vercel

# Verify
vercel --version  # Should show version without warnings
```

### 6. Verify Installation
```bash
# Check Node.js (MUST be v20+)
node --version  # Should be v20.x.x or higher

# Check npm
npm --version   # Should be v10+

# Check Python
python3 --version  # Should be 3.11+

# Check Vercel CLI
vercel --version  # Should show version
```

---

## 💻 Local Development

### With Vercel CLI (Recommended)

The **Vercel CLI** runs your entire project locally, including serverless functions, with proper routing:

```bash
# Navigate to project root
cd /path/to/ai-cv-tailoring-tool

# Start development server
vercel dev

# Output:
# ✓ Vercel CLI 32.0.0
# > Ready! Available at http://localhost:3000
```

**Features:**
- ✅ Frontend: http://localhost:3000 (React with hot reload)
- ✅ API: http://localhost:3000/api/health (serverless functions)
- ✅ File uploads work correctly (POST requests supported)
- ✅ Environment variables loaded from .env
- ✅ Serverless functions run locally exactly like in production

**Test endpoints:**
```bash
# Health check
curl http://localhost:3000/api/health

# Expected response:
# {
#   "success": true,
#   "message": "Backend is running",
#   "data": {"status": "healthy"}
# }

# Upload CV (with file)
curl -X POST -F "file=@resume.pdf" http://localhost:3000/api/upload-cv

# Expected response:
# {
#   "success": true,
#   "message": "CV 'resume.pdf' uploaded successfully",
#   "data": {
#     "filename": "resume.pdf",
#     "file_size_mb": 0.45,
#     "file_type": "pdf",
#     "content_preview": "...",
#     "full_path": "..."
#   }
# }
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

#### Step 1: Prepare Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

#### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub (or create account)
3. Click "New Project"
4. Select your repository
5. Vercel auto-detects `vercel.json` configuration
6. Click "Deploy"

#### Step 3: Configure Environment (if needed)
```bash
# Go to Project Settings → Environment Variables
# Add any required variables (if using cloud storage, etc.)
# Variables available to Python functions via os.environ['VAR_NAME']
```

#### Step 4: Access Your App
```
Frontend:   https://your-project.vercel.app
API Health: https://your-project.vercel.app/api/health
Upload API: https://your-project.vercel.app/api/upload-cv
```

### Deployment Verification

```bash
# Test health endpoint
curl https://your-project.vercel.app/api/health

# Should return:
# {
#   "success": true,
#   "message": "Backend is running",
#   "data": {"status": "healthy"}
# }

# Test upload (with real file)
curl -X POST -F "file=@resume.pdf" \
  https://your-project.vercel.app/api/upload-cv
```

---

## 📡 API Documentation

### Health Check Endpoint

**Request:**
```http
GET /api/health
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Backend is running",
  "data": {
    "status": "healthy"
  }
}
```

---

### CV Upload Endpoint

**Request:**
```http
POST /api/upload-cv
Content-Type: multipart/form-data

file: <PDF or DOCX file>
```

**Response (200 Created):**
```json
{
  "success": true,
  "message": "CV 'resume.pdf' uploaded successfully",
  "data": {
    "filename": "resume.pdf",
    "file_size_mb": 0.45,
    "file_type": "pdf",
    "content_preview": "John Doe\nSoftware Engineer\n...",
    "full_path": "temporary-resume.pdf"
  }
}
```

**Error Response (413 Payload Too Large):**
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

### Supported File Types
- **PDF** - `.pdf` (via PyPDF2)
- **Word (Modern)** - `.docx` (via python-docx)
- **Word (Legacy)** - `.doc` (not supported, returns error)

### File Limits
- **Max File Size:** 10MB
- **Allowed Formats:** PDF, DOCX
- **Timeout:** 30 seconds per request

### Error Codes Reference

| Code | HTTP | Description | Solution |
|------|------|-------------|----------|
| `missing_file` | 400 | No file provided | Select a file and try again |
| `invalid_file_type` | 400 | Unsupported format | Use PDF or DOCX format |
| `file_too_large` | 413 | Exceeds 10MB limit | Reduce file size |
| `empty_file` | 400 | File is empty | File has 0 bytes |
| `corrupted_file` | 422 | File is corrupted | Try another file |
| `unreadable_pdf` | 422 | PDF cannot be read | May be image-based |
| `pdf_processing_error` | 500 | PDF processing failed | Retry or use different file |
| `docx_processing_error` | 500 | DOCX processing failed | Retry or use different file |
| `unsupported_format` | 400 | Format not supported | Use PDF or DOCX |
| `server_error` | 500 | Unexpected error | Retry later |

---

## 🧪 Testing

### Frontend Testing

```bash
cd ai-cv-frontend

# Run dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Testing

```bash
# Test Python syntax
python3 -m py_compile backend/api/*.py backend/cv_processor.py

# Test individual functions
python3 -c "
from backend.api.health import handler
class Request:
    method = 'GET'
status, headers, body = handler(Request())
print(f'Status: {status}')
print(f'Response: {body}')
"
```

### End-to-End Testing

```bash
# 1. Start local dev with Vercel CLI
vercel dev

# 2. Test in browser
open http://localhost:3000

# 3. Upload a test CV
# - Click "Upload CV"
# - Select a PDF or DOCX file
# - Watch for success/error messages

# 4. Test error scenarios
# - Upload > 10MB file (file_too_large)
# - Upload .txt file (invalid_file_type)
# - Upload empty file (empty_file)
```

---

## 🔧 Troubleshooting

### "Module not found: cv_processor"

**Cause:** Python import path issue

**Solution:**
```bash
# Ensure you're in the project root
cd /path/to/ai-cv-tailoring-tool

# Check cv_processor.py location
ls backend/cv_processor.py  # Should exist

# Run from correct directory
vercel dev
```

### "CORS error" in browser console

**Cause:** API CORS headers not set properly

**Solution:**
- With Vercel CLI: CORS should work automatically ✓
- Check `vercel.json` has headers configured ✓
- Ensure POST requests are being routed to correct function

### "Cannot find module 'react'"

**Cause:** npm dependencies not installed

**Solution:**
```bash
cd ai-cv-frontend
npm install
npm run dev
```

### "File too large" error on upload

**Cause:** File exceeds 10MB limit

**Solution:**
- Compress the PDF/DOCX
- Or reduce file size in original application
- Max size is 10MB

### "API endpoint returns 404"

**Cause:** Wrong URL or Vercel CLI not running

**Solution:**
```bash
# With Vercel CLI (CORRECT)
http://localhost:3000/api/health  ✓

# Without Vercel CLI (WON'T WORK)
# API functions require Vercel routing to work
# Use: vercel dev
```

### "Cold start" delay (first request slow)

**This is normal on Vercel!**
- First request to serverless: ~1-2 seconds (cold start)
- Subsequent requests: Fast (<200ms)
- Not a problem for typical usage
- Local testing with `vercel dev` doesn't have cold starts

### Vercel CLI not found

**Solution:**
```bash
npm install -g vercel
vercel login
vercel link  # Link to your Vercel project (optional)
vercel dev   # Start development
```

### "Unsupported engine" warnings when installing Vercel CLI

**Cause:** Node.js version is too old (need 20+, you have 18.x)

**Solution - Upgrade Node.js:**
```bash
# Check current version
node --version  # Shows v18.20.8

# Upgrade using Homebrew (macOS)
brew upgrade node

# Or download from https://nodejs.org (v20 LTS or higher)

# Verify upgrade
node --version  # Should show v20.x.x or higher

# Then reinstall Vercel CLI
npm install -g vercel
```

**Verify it worked:**
```bash
vercel --version  # Should show version without engine warnings
```

## 🏗️ Project Architecture

### Frontend Architecture

```
React App (Vite)
    ↓
    ├─ Landing.jsx (Home page)
    ├─ Upload.jsx (Workflow page)
    │   ├─ CVUpload.jsx (File upload & validation)
    │   ├─ JobDescription.jsx (Job input)
    │   └─ AIprompt.jsx (Prompt customization)
    └─ Navbar + Footer
        ↓
        fetch('/api/upload-cv')  ← Relative URL
        ↓
```

### Backend Architecture (Vercel Serverless)

```
Vercel Router
    ↓
    ├─ GET /api/health → backend/api/health.py
    └─ POST /api/upload-cv → backend/api/analyze_cv.py
        ↓
        imports backend/cv_processor.py
        ↓
        ├─ validate_file_extension()
        ├─ validate_file_size()
        ├─ extract_text_from_pdf()
        ├─ extract_text_from_docx()
        └─ save_file()
        ↓
        Returns JSON response
```

### Data Flow

```
User Browser (http://localhost:3000)
    ↓
    [Select CV File]
    ↓
    CVUpload.jsx validates locally
    ├─ Check file type (PDF/DOCX)
    ├─ Check file size (<10MB)
    └─ Check file not empty
    ↓
    fetch('/api/upload-cv', formData)
    ↓
    Vercel Router (vercel dev)
    ↓
    backend/api/analyze_cv.py handler
    ├─ Re-validate file
    ├─ Extract text via cv_processor
    └─ Return JSON response
    ↓
    Frontend updates UI
    ├─ Success: Show preview & details
    └─ Error: Show error message with retry option
```

---

## 🔐 Security Considerations

### File Upload Security
- ✅ File extension validation (PDF, DOCX only)
- ✅ File size limit (10MB max)
- ✅ Secure filename handling (Werkzeug)
- ✅ Files stored in ephemeral `/tmp` on Vercel
- ⚠️ For production: Integrate cloud storage (S3, Azure Blob)

### CORS Configuration
```json
// vercel.json sets global CORS headers
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

### Environment Variables
Currently none required, but for production:
```bash
# .env.local (local development)
DATABASE_URL=your_database_url
STORAGE_BUCKET=your_s3_bucket

# Vercel Dashboard → Project Settings → Environment Variables
# Add same variables for production
```

---

## 📚 Additional Resources

- **Vercel Python Documentation:** [vercel.com/docs/functions/serverless-functions/python](https://vercel.com/docs/functions/serverless-functions/python)
- **Vercel CLI Documentation:** [vercel.com/docs/cli](https://vercel.com/docs/cli)
- **React Documentation:** [react.dev](https://react.dev)
- **Vite Guide:** [vitejs.dev](https://vitejs.dev)
- **PyPDF2 Docs:** [github.com/py-pdf/PyPDF2](https://github.com/py-pdf/PyPDF2)
- **python-docx Docs:** [python-docx.readthedocs.io](https://python-docx.readthedocs.io)

---

## 📖 Documentation Files

Comprehensive documentation included:
- **VERCEL_MIGRATION.md** - Detailed migration from Flask to serverless
- **MIGRATION_COMPLETE.md** - Summary of all changes
- **README_CV_UPLOAD.md** - Feature-specific documentation
- **INTEGRATION_GUIDE.md** - Integration instructions
- **ARCHITECTURE_DIAGRAMS.md** - Visual architecture
- **QUICK_START.md** - Quick reference guide

---

## 🤝 Contributing

### Local Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/your-feature

# 2. Make changes
# Edit files, test locally with: vercel dev

# 3. Commit changes
git add .
git commit -m "Add your feature description"

# 4. Push to GitHub
git push origin feature/your-feature

# 5. Create Pull Request on GitHub
# Describe changes and request review
```

### Code Quality

Frontend linting:
```bash
cd ai-cv-frontend
npm run lint
```

Backend validation:
```bash
python3 -m py_compile backend/api/*.py backend/cv_processor.py
```

---

## 📝 Environment Configuration

### Frontend Environment Variables

Create `ai-cv-frontend/.env.local`:
```bash
# Optional - default uses relative paths
# VITE_API_URL=http://localhost:3000
```

### Backend Environment Variables

On Vercel (Project Settings):
```
# VERCEL environment variable is set automatically
# Used to detect serverless environment in cv_processor.py
```

---

## 🎯 Next Steps

1. ✅ **Install** - Follow [Installation](#installation) section
2. ✅ **Test Locally** - Use `vercel dev`
3. ✅ **Deploy** - Push to GitHub and deploy on Vercel
4. 📊 **Monitor** - Check Vercel dashboard for function invocations
5. 🔧 **Integrate** - Connect to AI analysis service (future enhancement)
6. 📈 **Scale** - Add cloud storage, database, etc. as needed

---

## 📄 License

This project is available as-is for educational and commercial use.

---

**Last Updated:** February 10, 2026  
**Backend Type:** Vercel Serverless Python  
**Frontend:** React 19 with Vite  
**Status:** Production Ready ✅

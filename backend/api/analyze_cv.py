"""
CV Upload and Analysis Endpoint for Vercel Serverless
POST /api/analyze_cv
Handles CV file upload, validation, and content extraction
"""

import json
import sys
from cv_processor import process_cv_upload, CVUploadError, ALLOWED_EXTENSIONS


class APIResponse:
    """Helper class for consistent API responses"""
    
    @staticmethod
    def success(data=None, message="Success", status_code=200):
        """Return successful response"""
        return (status_code, {'Content-Type': 'application/json'}, json.dumps({
            'success': True,
            'message': message,
            'data': data or {}
        }))
    
    @staticmethod
    def error(error_code, message, status_code=400, details=None):
        """Return error response"""
        return (status_code, {'Content-Type': 'application/json'}, json.dumps({
            'success': False,
            'error_code': error_code,
            'message': message,
            'details': details or {}
        }))


def handler(request):
    """
    Serverless handler for CV upload endpoint
    
    Events:
        - POST /api/analyze_cv: Upload and process CV file
        - POST /api/upload-cv: (Legacy compatibility)
    
    Request:
        - method: POST
        - files: {'file': file_object}
    
    Response:
        {
            'success': bool,
            'message': str,
            'data': {
                'filename': str,
                'file_size_mb': float,
                'file_type': str,
                'content_preview': str,
                'full_path': str
            }
        }
        
    Error Codes:
        - missing_file: No file provided
        - invalid_file_type: File format not supported
        - file_too_large: File exceeds size limit (10MB)
        - empty_file: File is empty
        - corrupted_file: File is corrupted
        - unreadable_pdf: PDF cannot be read
        - pdf_processing_error: PDF processing failed
        - docx_processing_error: DOCX processing failed
        - unsupported_format: File format not supported
        - server_error: Internal server error
    """
    
    # Set CORS headers
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }
    
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        return (200, headers, '')
    
    # Only allow POST
    if request.method != 'POST':
        return (405, headers, json.dumps({
            'success': False,
            'error_code': 'method_not_allowed',
            'message': 'Method not allowed. Use POST.'
        }))
    
    try:
        # Check if file is in request
        if 'file' not in request.files:
            return APIResponse.error(
                'missing_file',
                'No file provided. Please upload a CV file.',
                400,
                {}
            )
        
        file = request.files['file']
        
        if file.filename == '':
            return APIResponse.error(
                'missing_file',
                'No file selected. Please choose a CV file to upload.',
                400,
                {}
            )
        
        # Process the CV
        result = process_cv_upload(file, file.filename)
        
        response_headers = {**headers}
        return (200, response_headers, json.dumps({
            'success': True,
            'message': f"CV '{result['filename']}' uploaded successfully",
            'data': {
                'filename': result['filename'],
                'file_size_mb': result['file_size_mb'],
                'file_type': result['file_type'],
                'content_preview': result['content'],
                'full_path': result['full_path']
            }
        }))
    
    except CVUploadError as e:
        """Handle CV processing errors"""
        status_code = 400
        
        # Map error codes to appropriate HTTP status codes
        if e.error_code == 'file_too_large':
            status_code = 413  # Payload Too Large
        elif e.error_code in ['corrupted_file', 'unreadable_pdf']:
            status_code = 422  # Unprocessable Entity
        
        response_headers = {**headers}
        return (status_code, response_headers, json.dumps({
            'success': False,
            'error_code': e.error_code,
            'message': e.message,
            'details': e.details
        }))
    
    except Exception as e:
        """Handle unexpected errors"""
        print(f"Unexpected error during CV upload: {str(e)}", file=sys.stderr)
        response_headers = {**headers}
        return (500, response_headers, json.dumps({
            'success': False,
            'error_code': 'server_error',
            'message': 'An unexpected error occurred while processing your CV',
            'details': {'error_detail': str(e)}
        }))

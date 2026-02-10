"""
Health Check Endpoint for Vercel Serverless
GET /api/health
"""

import json


def handler(request):
    """
    Health check endpoint
    
    Returns:
        (int, dict, str): Tuple of (status_code, headers, body)
    """
    if request.method != 'GET':
        return (405, {'Content-Type': 'application/json'}, json.dumps({
            'success': False,
            'error_code': 'method_not_allowed',
            'message': 'Method not allowed. Use GET.'
        }))
    
    response = {
        'success': True,
        'message': 'Backend is running',
        'data': {
            'status': 'healthy'
        }
    }
    
    return (200, {'Content-Type': 'application/json'}, json.dumps(response))

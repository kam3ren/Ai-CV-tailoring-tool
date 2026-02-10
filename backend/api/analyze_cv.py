import json

def handler(request):
    if request.method == "OPTIONS":
        return {
            "statusCode": 204,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        }

    body = json.loads(request.body or "{}")
    text = body.get("cv_text")

    if not text:
        return {
            "statusCode": 400,
            "body": {"error": "cv_text is required"}
        }

    return {
        "statusCode": 200,
        "body": {
            "score": 85,
            "feedback": "Good CV, optimize keywords"
        }
    }
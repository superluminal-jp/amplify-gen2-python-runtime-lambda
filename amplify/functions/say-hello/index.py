import json

# This is a simple AWS Lambda function that takes a name as an argument and returns a greeting message.
def handler(event, context):
    name = event.get("arguments").get("name")
    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": f"Hello, {name}.",
        }),
    }
def handler(event, context):
    try:
        name = event.get('arguments', {}).get('name')
        message = f"Hello, {name}"

        return {
            "statusCode": 200,
            "body": message,
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": str(e),
        }
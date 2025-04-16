"""AWS Lambda function that returns a greeting message for a provided name."""

import json
import logging
from typing import Any, Dict

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    AWS Lambda handler that accepts 'name' argument and returns a greeting.
    Expects event format: {'arguments': {'name': <string>}}.
    """
    logger.info("Invoked say-hello with event: %s", event)
    args = event.get("arguments", {})
    name = args.get("name")

    if not name or not isinstance(name, str):
        logger.warning("Invalid or missing 'name' argument: %s", args)
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing or invalid 'name' argument."}),
        }

    greeting = f"Hello, {name}."
    logger.info("Generated greeting: %s", greeting)
    return {
        "statusCode": 200,
        "body": json.dumps({"message": greeting}),
    }

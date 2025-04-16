"""AWS Lambda function using LangChain Bedrock for translating between Japanese and English."""

import os
import json
import logging
from typing import Any, Dict

from langchain_aws import ChatBedrockConverse

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Configuration loaded from environment variables
MODEL_NAME = os.getenv("MODEL_NAME", "anthropic.claude-3-5-sonnet-20240620-v1:0")
REGION_NAME = os.getenv("REGION_NAME", "ap-northeast-1")
TEMPERATURE = float(os.getenv("TEMPERATURE", "0"))
MAX_TOKENS = int(os.getenv("MAX_TOKENS", "4096"))

# Initialize LLM client outside the handler for connection reuse
llm = ChatBedrockConverse(
    model=MODEL_NAME,
    temperature=TEMPERATURE,
    max_tokens=MAX_TOKENS,
    region_name=REGION_NAME,
)


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    AWS Lambda handler for translating sentences between Japanese and English.
    Expects event format: {'arguments': {'input': <string>}}.
    Returns a dict with 'statusCode' and 'body'.
    """
    logger.info("Handler invoked with event: %s", event)
    args = event.get("arguments", {})
    input_text = args.get("input")

    if not input_text or not isinstance(input_text, str):
        logger.warning("Invalid or missing 'input' argument: %s", args)
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing or invalid 'input' argument."}),
        }

    logger.info("Input text for translation: %s", input_text)
    try:
        messages = [
            (
                "system",
                "You are a helpful translator. Translate the user sentence between Japanese and English.",
            ),
            ("human", input_text),
        ]
        logger.debug("Prepared messages for LLM: %s", messages)

        response = llm.invoke(messages)
        translation = response.content
        logger.info("LLM translation result: %s", translation)

        return {"statusCode": 200, "body": translation}
    except Exception as exc:
        logger.error("Error during LLM invocation: %s", exc, exc_info=True)
        return {
            "statusCode": 500,
            "body": json.dumps(
                {
                    "error": str(exc),
                    "message": "Internal server error during translation.",
                }
            ),
        }

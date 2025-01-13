import logging
from langchain_aws import ChatBedrockConverse

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    """
    Lambda handler for translating sentences between Japanese and English using LangChain Bedrock.
    Logs are added to aid debugging and monitoring.
    """
    try:
        logger.info("Handler invoked with event: %s", event)

        # Retrieve input from the event
        input_text = event.get('arguments', {}).get('input', None)
        if not input_text:
            logger.warning("No input text provided in event: %s", event)
            return {
                'statusCode': 400,
                'body': "Error: 'input' argument is missing."
            }

        logger.info("Input text received: %s", input_text)

        # Initialize the LLM model
        llm = ChatBedrockConverse(
            model="anthropic.claude-3-5-sonnet-20240620-v1:0",
            temperature=0,
            max_tokens=4096,
            region_name="ap-northeast-1",
        )
        logger.info("LLM model initialized")
        
        # Define the conversation messages
        messages = [
            ("system", "You are a helpful translator. Translate the user sentence between Japanese and English."),
            ("human", input_text),
        ]
        logger.info("Messages prepared for LLM: %s", messages)

        # Invoke the LLM model
        response = llm.invoke(messages)
        logger.info("LLM response received: %s", response)

        # Extract assistant response
        assistant_response = response.content
        logger.info("Assistant response extracted: %s", assistant_response)

        return {
            'statusCode': 200,
            'body': assistant_response
        }

    except Exception as e:
        logger.error("An error occurred: %s", str(e), exc_info=True)
        return {
            'statusCode': 500,
            'body': {
                'error': str(e),
                'message': "An internal error occurred while processing the request."
            }
        }
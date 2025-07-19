import os

import openai

from agent.client.api import CodeGenerator

openai.api_key = os.getenv("OPENAI_API_KEY")


def generate_test_cases(requirements):
    prompt = f"""
    You are an expert software tester. Write Python `pytest` black box test cases for a Stripe payment system, based on the following requirements.

    Focus only on **user-facing behavior**, not internal implementation.
    Include tests for card scenarios, amount/currency, webhooks, refunds, edge cases, security, and user experience — only if relevant.

    REQUIREMENTS:
    {requirements}

    Return only valid and clean `pytest` test functions.
    """

    client = CodeGenerator(api_key=os.getenv("API_KEY"), setup_prompt=prompt)
    response = client.request("Make a test case for a payment app")
    print(response)


if __name__ == "__main__":
    with open("stripe_requirements.txt", "r") as file:
        requirements_text = file.read()

    generate_test_cases(requirements_text)

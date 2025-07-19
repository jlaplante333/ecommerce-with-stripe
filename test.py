import contextlib
import io
import logging
import os
from typing import Tuple

import pytest

from agent.client.api import CodeGenerator

logger = logging.getLogger(__name__)
logging.basicConfig(
    format="[%(asctime)s][%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    level=logging.DEBUG,
)

PROMPT = """
Take on the role of a senior QA engineer.

I need to implement testing in Python. I am using Pytest as my test harness.
Your primary task is to assess the test report, and provide debugging feedback.

Key requirements:
1. Provide a summary of the test report.
2. Provide actionable steps to tackle the issue.
3. Provide suggestions for improving the test coverage.

Please consider:
- Edge cases
- Performance optimization
- ISTQB Tester Guidelines

From this step forward, I will provide you with the test raw shell output.
Do **not** generate any code, focus on providing feedback and analysis based
on the test report.

Write the test report in a way that is easy to understand and follow.
Also provide an analysis of the test report, including any potential issues
that may arise and how to address them. Tackle the coverage issues, if any.
"""


REWRITE_PROMPT = """
Take on the role of a senior software engineer.

I need to implement testing in Python. I am using Pytest as my test harness.
Your primary task is to rewrite a test suite for the code I provide.

Key requirements:
1. Tests should be written in a way that is easy to understand and maintain.
2. Tests should consider both line and branch coverage.
3. Code must be properly formatted according to PEP8 standards.

Please consider:
- Positive and negative cases
- Error handling
- Edge cases
- Performance optimization
- Best practices for Pytest
- ISTQB Tester Guidelines

Please do not unnecessarily remove any comments or code.
Generate the code with clear comments explaining the logic.

From this step forward, I will provide you with the code and you will write the tests.
Minimize chat response, focus on the code. Provide ONLY the raw code output, do not use
Markdown syntax; instead write the code directly as if it were to be pasted into a file.
"""


def run_tests(path: str, verbose: bool = False, with_coverage: bool = False) -> Tuple[str, str, int]:
    """Run the Pytest tests located at the specified path.

    Args:
        path (str): _description_

    Returns:
        Tuple[str, str, int]: _description_
    """
    stdout = io.StringIO()
    stderr = io.StringIO()

    pytest_base_args = []
    if verbose:
        pytest_base_args.append("-v")
    if with_coverage:
        pytest_base_args += [
            "--cov=.",                    # coverage for current directory (adjust as needed)
            "--cov-report=term-missing",  # show missing lines
        ]

    # Redirect both stdout and stderr during the test run
    with contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
        exit_code = pytest.main([*pytest_base_args, path])

    # Retrieve output
    shell_output = stdout.getvalue()
    error_output = stderr.getvalue()

    return shell_output, error_output, exit_code


def analyze_tests(test_report: str) -> str:
    key = os.getenv("API_KEY")
    if not key:
        raise ValueError("API_KEY environment variable is not set")
    client = CodeGenerator(api_key=key, setup_prompt=PROMPT)
    message = f"Analyze the following test report:\n\n{test_report}"
    logger.info("Sending analysis request to LLM...")
    response = client.request(message)
    return response


def rewrite_tests(report_output: str, analysis: str, test_code: str) -> str:
    key = os.getenv("API_KEY")
    if not key:
        raise ValueError("API_KEY environment variable is not set")
    client = CodeGenerator(api_key=key, setup_prompt=REWRITE_PROMPT)
    message = f"""
    Here is the test report:\n\n{report_output}

    And here is the analysis of the test report:\n\n{analysis}

    Based on this analysis, rewrite the following test code. Ensure the tests are
    written in a way that is easy to understand and maintain.

    Code to rewrite:
    ```python
    {test_code}
    ```
    """
    logger.info("Sending rewrite request to LLM...")
    response = client.request(message)
    return response


if __name__ == "__main__":
    test_path = "tests/test_ui.py"

    report_output, error_messages, exit_code = run_tests(test_path, verbose=True, with_coverage=True)
    logger.info(f"Exit code: {exit_code}")
    logger.info(f"Shell output:\n{report_output}")
    logger.info(f"Error output:\n{error_messages}")
    analysis = analyze_tests(report_output)
    logger.info("\n\n=== REPORT ANALYSIS ===\n")
    logger.info(analysis)

    # with open(test_path, "r") as file:
    #     code_content = file.read()
    # rewrite = rewrite_tests(report_output, analysis, code_content)
    # logger.info("\n\n=== REWRITE TESTS ===\n")
    # logger.info(rewrite)

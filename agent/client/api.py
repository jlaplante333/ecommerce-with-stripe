from openai import OpenAI


class CodeGenerator:
    """Class for generating OpenAI API requests."""

    def __init__(self, api_key: str, setup_prompt: str):
        self.__api_key = api_key
        self.__base_url = "https://openrouter.ai/api/v1"
        self.__model = "deepseek/deepseek-r1:free"
        self.__client = OpenAI(api_key=self.__api_key, base_url=self.__base_url)
        self.__setup_prompt = setup_prompt

    def request(self, message: str) -> str:
        """Generate test code for the provided file contents.

        Args:
            message (str): Message to send to the LLM

        Raises:
            CLIGenerationError: If LLM API call fails

        Returns:
            str: Test file contents
        """
        response = self.__client.chat.completions.create(
            model=self.__model,
            messages=[
                {"role": "system", "content": self.__setup_prompt},
                {"role": "user", "content": message},
            ],
            stream=False,
        )
        content = response.choices[0].message.content
        if not content:
            raise ValueError(
                message="Failed to generate code",
                help_text=response.choices[0].message.refusal,
            )
        return content

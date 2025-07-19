from typing import Iterator

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

URL_UNDER_TEST = "https://checkout.stripe.com/c/pay/ppage_1RmRgtLE4wKZaCzD4UhZGTPC#fidkdWxOYHwnPyd1blpxYHZxWjA0V1VRQF9JQDFyTl9kRn9BTDJIRjZiUX01clFRUV1EXGZfQ2dQb3xkPF9DSF11X08yYWBLSH1ETnREVUhuc05Ma2RjMX9dVzRBX2Iyd3N9TU53SzVyQE9RNTVUS1FqNjxyXycpJ2hsYXYnP34nYnBsYSc%2FJ2A9YWYwMjMxKDJkNjMoMTZjPCg9YDY1KGNkMjM9MmFmND1nZDY8YDJhYycpJ2hwbGEnPyc0Z2E9PTc8YygzNDI8KDFmNjIoPDdgZChkZDJkYWQ1PDFgY2cwMDZnNTcnKSd2bGEnPyc2MTYyNDw2YyhmMjIzKDEyPWMoZzU0MihjMjwwYDxnYTFnNTw3M2M0N2AneCknZ2BxZHYnP15YKSdpZHxqcHFRfHVgJz8naHBpcWxabHFgaCcpJ3dgY2B3d2B3SndsYmxrJz8nbXFxdXY%2FKipgZmpoaGB3ZmAocmxxbSh2cXdsdWAodmx9K3Ngd2ZgaStkdXUnKSdpamZkaWAnP2twaWl4JSUl"


@pytest.fixture(scope="module")
def driver() -> Iterator[WebDriver]:
    """Sets up Chrome WebDriver with bot evasion flags."""
    options = Options()
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--headless=new")  # Optional: comment out for visible browser
    driver = webdriver.Chrome(options=options)
    driver.maximize_window()

    yield driver

    driver.quit()


def test_stripe_checkout_payment(driver):
    try:
        driver.get(URL_UNDER_TEST)
        WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.TAG_NAME, "iframe"))
        )
    except Exception as e:
        pytest.fail(f"Failed to load Stripe page or locate iframes: {e}")

    # Locate and fill card input inside iframe
    found_card_input = False
    iframes = driver.find_elements(By.TAG_NAME, "iframe")

    for frame in iframes:
        driver.switch_to.frame(frame)
        try:
            card_input = driver.find_element(By.NAME, "cardNumber")
            card_input.send_keys("4242424242424242")
            driver.find_element(By.NAME, "exp-date").send_keys("1230")
            driver.find_element(By.NAME, "cvc").send_keys("123")
            driver.find_element(By.NAME, "postal").send_keys("12345")
            found_card_input = True
            break
        except Exception:
            driver.switch_to.default_content()
            continue

    assert found_card_input, "Card input iframe not found or inputs not filled"

    driver.switch_to.default_content()

    try:
        # Find and click the Pay button
        buttons = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.TAG_NAME, "button"))
        )
        pay_button = next((btn for btn in buttons if "pay" in btn.text.lower()), None)
        assert pay_button is not None, "Pay button not found"
        pay_button.click()
    except Exception as e:
        pytest.fail(f"Error clicking the Pay button: {e}")

    # Wait for confirmation (you may need to customize the success selector)
    try:
        confirmation = WebDriverWait(driver, 60).until(
            EC.presence_of_element_located((By.TAG_NAME, "h1"))  # adjust as needed
        )
        assert (
            "thank you" in confirmation.text.lower()
            or "payment" in confirmation.text.lower()
        )
    except Exception:
        pytest.fail("Confirmation screen not detected after payment attempt")

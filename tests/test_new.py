import time
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
    options = Options()
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--headless=new")
    driver = webdriver.Chrome(options=options)
    driver.maximize_window()
    yield driver
    driver.quit()


def test_stripe_checkout_payment(driver):
    # Load page and wait for Stripe elements to initialize
    driver.get(URL_UNDER_TEST)
    WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.XPATH, "//body"))
    )

    def safe_send_keys(frame_locator, field_name, keys, timeout=10):
        driver.switch_to.default_content()
        WebDriverWait(driver, timeout).until(
            EC.frame_to_be_available_and_switch_to_it(frame_locator)
        )
        element = WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located(
                (
                    By.XPATH,
                    f"//*[translate(@name, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = '{field_name.lower()}']",
                )
            )
        )
        element.send_keys(keys)
        driver.switch_to.default_content()

    try:
        # Card Number
        safe_send_keys(
            (
                By.XPATH,
                "//iframe[contains(@name, 'cardNumber') or contains(@data-elements-stable-field-name, 'cardNumber')]",
            ),
            "cardNumber",
            "4242424242424242",
        )

        # Expiration Date
        safe_send_keys(
            (
                By.XPATH,
                "//iframe[contains(@name, 'exp-date') or contains(@data-elements-stable-field-name, 'exp-date')]",
            ),
            "exp-date",
            "1230",
        )

        # CVC
        safe_send_keys(
            (
                By.XPATH,
                "//iframe[contains(@name, 'cvc') or contains(@data-elements-stable-field-name, 'cvc')]",
            ),
            "cvc",
            "123",
        )

        # Postal Code (if required)
        safe_send_keys(
            (
                By.XPATH,
                "//iframe[contains(@name, 'postal') or contains(@data-elements-stable-field-name, 'postal')]",
            ),
            "postal",
            "12345",
        )

    except Exception as e:
        pytest.fail(f"Field interaction failed: {str(e)}")
        return

    # Handle payment submission
    try:
        main_frame = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located(
                (By.XPATH, "//iframe[contains(@title, 'Secure checkout')]")
            )
        )
        driver.switch_to.frame(main_frame)

        pay_button = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable(
                (By.XPATH, "//button[contains(translate(., 'PAY', 'pay'), 'pay')]")
            )
        )
        pay_button.click()
        driver.switch_to.default_content()
    except Exception as e:
        pytest.fail(f"Payment submission failed: {str(e)}")
        return

    # Verify success state
    try:
        confirmation = WebDriverWait(driver, 25).until(
            EC.visibility_of_element_located(
                (
                    By.XPATH,
                    "//*[contains(translate(., 'THANKYOU', 'thankyou') , 'thank') or contains(translate(., 'SUCCESS', 'success'), 'success')]",
                )
            )
        )
        assert any(
            keyword in confirmation.text.lower()
            for keyword in ["thank", "success", "payment"]
        ), "Confirmation message validation failed"
    except Exception as e:
        pytest.fail(f"Confirmation verification failed: {str(e)}")

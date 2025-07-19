import pytest
import stripe
from unittest.mock import Mock, patch

# Common fixtures
@pytest.fixture
def client():
    # Your framework's test client (e.g., Django/Flask)
    return Mock()

@pytest.fixture
def stripe_test_key(monkeypatch):
    monkeypatch.setenv("STRIPE_SECRET_KEY", "sk_test_123")

# Basic payment flow tests
def test_valid_card_payment_success(client, stripe_test_key):
    response = client.post("/charge", data={
        "card_number": "4242424242424242",
        "exp_date": "12/30",
        "cvc": "123",
        "amount": 1000,
        "currency": "usd"
    })
    
    assert response.status_code == 200
    assert "Payment succeeded" in response.json["message"]
    assert client.db.get_payment_status(response.json["tx_id"]) == "succeeded"

# Parameterized card scenario tests
@pytest.mark.parametrize("card_number,expected", [
    ("4000000000000002", "card_declined"),
    ("4000000000009995", "insufficient_funds"),
    ("4000000000000127", "processing_error"),
    ("4000000000000069", "expired_card"), 
    ("4000000000000101", "incorrect_cvc")
])
def test_declined_cards(client, card_number, expected):
    response = client.post("/charge", data={
        "card_number": card_number,
        # ... other fields
    })
    
    assert response.status_code == 400
    assert expected in response.json["error"]["code"]

# 3D Secure test with mock
@patch("stripe.PaymentIntent.confirm")
def test_3d_secure_flow(mock_confirm, client):
    mock_confirm.side_effect = stripe.error.CardError(
        "Authentication required", param="", code="authentication_required"
    )

    response = client.post("/charge", data={
        "card_number": "4000002760003184",
        # ... other fields
    })
    
    assert response.status_code == 303
    assert "/3d-secure-challenge" in response.headers["Location"]
    
    # Test successful authentication follow-up
    client.post("/confirm-3d-secure", data={"token": "valid_token"})
    assert client.db.get_payment_status() == "succeeded"

# Currency handling
@pytest.mark.parametrize("amount,currency,expected", [
    ("10.99", "usd", 1099),
    ("1000", "jpy", 1000),
    ("50.50", "eur", 5050)
])
def test_currency_conversion(client, amount, currency, expected):
    response = client.post("/charge", data={
        "amount": amount,
        "currency": currency,
        "card_number": "4242424242424242",
        # ... other fields
    })
    
    pi = stripe.PaymentIntent.retrieve(response.json["tx_id"])
    assert pi.amount == expected

# Webhook handling test
def test_payment_webhook(client):
    test_payload = {
        "type": "payment_intent.succeeded",
        "data": {
            "object": {
                "id": "pi_123",
                "amount": 1000,
                "status": "succeeded"
            }
        }
    }
    
    response = client.post("/webhook", json=test_payload, 
                          headers={"Stripe-Signature": "valid_sig"})
    
    assert response.status_code == 200
    assert client.db.get_payment_status("pi_123") == "webhook_processed"

# Refund test
def test_successful_refund(client):
    # Setup completed payment
    tx_id = client.post("/charge", data={...}).json["tx_id"]
    
    refund_response = client.post(f"/refund/{tx_id}")
    assert refund_response.status_code == 200
    assert stripe.Refund.list(payment_intent=tx_id).data[0].status == "succeeded"

# Error handling tests
def test_network_failure(client):
    with patch("stripe.PaymentIntent.create") as mock_create:
        mock_create.side_effect = stripe.error.APIConnectionError
        response = client.post("/charge", data={...})
        assert "connection error" in response.json["error"]
        assert client.db.get_payment_attempts() == 1

def test_invalid_api_key(client):
    client.app.config["STRIPE_SECRET_KEY"] = "invalid_key"
    response = client.post("/charge", data={...})
    assert response.status_code == 500
    assert "Invalid API Key" in response.json["error"]

# Security tests
def test_no_card_data_in_logs(client):
    with open("app.log", "r") as f:
        logs = f.read()
        
    assert "4242" not in logs
    assert "cvc" not in logs

# User experience tests
def test_loading_indicator(client):
    with patch("stripe.PaymentIntent.create", delay=Mock()):
        response = client.post("/charge", data={...})
        assert "loading" in response.html()
        assert "Processing payment..." in response.html()
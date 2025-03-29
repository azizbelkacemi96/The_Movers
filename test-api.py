import requests

BASE_URL = "http://localhost:8080"

def send_request(method, url, json=None):
    try:
        response = requests.request(method, url, json=json)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"❌ ERROR during {method} {url} - {e}")
        return None
    except requests.exceptions.JSONDecodeError:
        print(f"❌ ERROR: Server returned empty response for {method} {url}")
        return None

def test_appointments():
    print("\n🔹 Test CRUD Appointments")
    success = True

    appointment_data = {
        "client": "Company ABC",
        "phone": "0601020304",
        "address": "23 Rue Lafayette, Paris",
        "date": "2025-04-10T09:30",
        "type": "Moving"
    }
    response = send_request("POST", f"{BASE_URL}/appointments", appointment_data)
    appointment_id = response.get("id") if response else None
    success &= bool(response)

    send_request("GET", f"{BASE_URL}/appointments")

    if appointment_id:
        update_data = {
            "client": "Company XYZ",
            "phone": "0612345678",
            "address": "125 Avenue des Champs-Élysées, Paris",
            "date": "2025-04-12T14:00",
            "type": "Delivery"
        }
        success &= bool(send_request("PUT", f"{BASE_URL}/appointments/{appointment_id}", update_data))
        success &= bool(send_request("DELETE", f"{BASE_URL}/appointments/{appointment_id}"))

    return success

def test_missions():
    print("\n🔹 Test CRUD Missions")
    success = True

    mission_data = {
        "type": "Moving",
        "client": "Mr. Dupont",
        "address": "10 Boulevard Haussmann, Paris",
        "date": "2025-05-01",
        "priceHT": 2000.0,
        "priceTTC": 2400.0,
        "salary": 600.0,
        "charges": 400.0
    }
    response = send_request("POST", f"{BASE_URL}/missions", mission_data)
    mission_id = response.get("id") if response else None
    success &= bool(response)

    send_request("GET", f"{BASE_URL}/missions")

    if mission_id:
        update_data = {
            "type": "Delivery",
            "client": "Mme. Lefevre",
            "address": "78 Rue de Rivoli, Paris",
            "date": "2025-05-10",
            "priceHT": 800.0,
            "priceTTC": 960.0,
            "salary": 250.0,
            "charges": 150.0
        }
        success &= bool(send_request("PUT", f"{BASE_URL}/missions/{mission_id}", update_data))
        success &= bool(send_request("DELETE", f"{BASE_URL}/missions/{mission_id}"))

    return success

def test_investors():
    print("\n🔹 Test Investor Module")
    success = True

    # 1. Add an investor
    investor_data = { "name": "Aziz" }
    response = send_request("POST", f"{BASE_URL}/investors", investor_data)
    investor_id = response.get("id") if response else None
    success &= bool(investor_id)

    # 2. Add a deposit
    deposit_data = {
        "investor_id": investor_id,
        "type": "deposit",
        "amount": 1000,
        "date": "2025-03-29",
        "category": "Initial"
    }
    success &= bool(send_request("POST", f"{BASE_URL}/transactions", deposit_data))

    # 3. Add a withdrawal
    withdrawal_data = {
        "investor_id": investor_id,
        "type": "withdrawal",
        "amount": 400,
        "date": "2025-03-30",
        "category": "Partial payout"
    }
    success &= bool(send_request("POST", f"{BASE_URL}/transactions", withdrawal_data))

    # 4. Check transactions
    txs = send_request("GET", f"{BASE_URL}/investors/{investor_id}/transactions")
    if txs is not None:
        print(f"   🧾 Transactions: {len(txs)} found")
        success &= len(txs) == 2

    # 5. Check investor balance
    all_investors = send_request("GET", f"{BASE_URL}/investors")
    if all_investors:
        investor = next((i for i in all_investors if i["id"] == investor_id), None)
        if investor:
            expected_balance = 600.0
            actual_balance = investor["balance"]
            print(f"   💰 Balance: expected €{expected_balance}, got €{actual_balance}")
            success &= abs(actual_balance - expected_balance) < 0.01
        else:
            print("❌ Investor not found in list")
            success = False

    return success

def test_quotes():
    print("\n🔹 Test CRUD Quotes")
    success = True

    quote_data = {
        "client_name": "Société ABC",
        "client_address": "23 Rue Lafayette, Paris",
        "client_city": "Paris",
        "date": "2025-04-10",
        "prestations": [
            {"description": "Déménagement Paris → Lyon", "prix": 400, "quantite": 1},
            {"description": "Location camion", "prix": 100, "quantite": 1}
        ],
        "totalHT": 500,
        "totalTVA": 100,
        "totalTTC": 600
    }
    response = send_request("POST", f"{BASE_URL}/quote", quote_data)
    quote_id = response.get("id") if response else None
    success &= bool(response)

    send_request("GET", f"{BASE_URL}/quote")

    if quote_id:
        update_data = {
            "client_name": "Mme Lefevre",
            "client_address": "5 rue Oberkampf",
            "client_city": "Lyon",
            "date": "2025-04-12",
            "prestations": [
                {"description": "Transport meuble", "prix": 300, "quantite": 1}
            ],
            "totalHT": 300,
            "totalTVA": 60,
            "totalTTC": 360
        }
        success &= bool(send_request("PUT", f"{BASE_URL}/quote/{quote_id}", update_data))
        success &= bool(send_request("DELETE", f"{BASE_URL}/quote/{quote_id}"))

    return success

if __name__ == "__main__":
    print("🚀 Running All API Tests")

    rdv_ok = test_appointments()
    mission_ok = test_missions()
    investor_ok = test_investors()
    quote_ok = test_quotes()

    print("\n✅ Final Report")
    if rdv_ok:
        print("✅ Appointment tests passed")
    else:
        print("❌ Appointment tests failed")

    if mission_ok:
        print("✅ Missions tests passed")
    else:
        print("❌ Missions tests failed")

    if investor_ok:
        print("✅ Investor tests passed")
    else:
        print("❌ Investor tests failed")

    if quote_ok:
        print("✅ Quote tests passed")
    else:
        print("❌ Quote tests failed")

    if rdv_ok and mission_ok and investor_ok and quote_ok:
        print("\n🎉 ✅ ALL TESTS PASSED!")
    else:
        print("\n❌ Some tests failed. Please check logs.")

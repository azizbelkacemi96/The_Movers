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

def populate_appointments():
    print("\n🔹 Adding Appointments...")
    appointments = [
        {"client": "Company ABC", "phone": "0601020304", "address": "23 Rue Lafayette, Paris", "date": "2025-04-10T09:30", "type": "Moving"},
        {"client": "Mr. Dupont", "phone": "0612345678", "address": "45 Boulevard Haussmann, Paris", "date": "2025-04-12T15:00", "type": "Delivery"},
        {"client": "Company XYZ", "phone": "0623456789", "address": "78 Avenue des Champs-Élysées, Paris", "date": "2025-04-15T14:00", "type": "Moving"}
    ]
    for appt in appointments:
        response = send_request("POST", f"{BASE_URL}/appointments", appt)
        print(f"✅ Appointment added: {response}")

def populate_missions():
    print("\n🔹 Adding Missions...")
    missions = [
        {"type": "Moving", "client": "Mr. Martin", "address": "10 Rue de Rivoli, Paris", "date": "2025-05-01", "priceHT": 1800.0, "priceTTC": 2160.0, "salary": 600.0, "charges": 400.0, "employee": "John"},
        {"type": "Delivery", "client": "Mrs. Lefevre", "address": "125 Avenue Montaigne, Paris", "date": "2025-05-03", "priceHT": 600.0, "priceTTC": 720.0, "salary": 200.0, "charges": 100.0, "employee": "Alice"},
        {"type": "Moving", "client": "Company ABC", "address": "45 Boulevard Haussmann, Paris", "date": "2025-05-07", "priceHT": 2500.0, "priceTTC": 3000.0, "salary": 800.0, "charges": 500.0, "employee": "Youssef"}
    ]
    for mission in missions:
        response = send_request("POST", f"{BASE_URL}/missions", mission)
        print(f"✅ Mission added: {response}")

def populate_investments():
    print("\n🔹 Adding Investments...")
    investments = [
        {"name": "Moving truck purchase", "amount": 30000.0, "date": "2025-03-01", "category": "Vehicle"},
        {"name": "Handling equipment", "amount": 8080.0, "date": "2025-03-05", "category": "Equipment"},
        {"name": "Truck insurance", "amount": 2500.0, "date": "2025-03-10", "category": "Fixed costs"}
    ]
    for investment in investments:
        response = send_request("POST", f"{BASE_URL}/finance", investment)
        print(f"✅ Investment added: {response}")

if __name__ == "__main__":
    print("🚀 Starting database population...")

    populate_appointments()
    populate_missions()
    populate_investments()

    print("\n✅ Population completed!")

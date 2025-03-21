import requests

BASE_URL = "http://localhost:5000"

def send_request(method, url, json=None):
    """ Envoie une requête HTTP et gère les erreurs proprement """
    try:
        response = requests.request(method, url, json=json)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"❌ ERREUR lors de {method} {url} - {e}")
        return None
    except requests.exceptions.JSONDecodeError:
        print(f"❌ ERREUR: Le serveur a renvoyé une réponse vide pour {method} {url}")
        return None

def populate_rdvs():
    print("\n🔹 Ajout de RDVs...")
    rdvs = [
        {"client": "Société ABC", "telephone": "0601020304", "adresse": "23 Rue Lafayette, Paris", "date": "2025-04-10T09:30", "type": "Déménagement"},
        {"client": "Particulier Dupont", "telephone": "0612345678", "adresse": "45 Boulevard Haussmann, Paris", "date": "2025-04-12T15:00", "type": "Livraison"},
        {"client": "Entreprise XYZ", "telephone": "0623456789", "adresse": "78 Avenue des Champs-Élysées, Paris", "date": "2025-04-15T14:00", "type": "Déménagement"}
    ]
    for rdv in rdvs:
        response = send_request("POST", f"{BASE_URL}/rdvs", rdv)
        print(f"✅ RDV ajouté: {response}")

def populate_missions():
    print("\n🔹 Ajout de Missions...")
    missions = [
        {"type": "Déménagement", "client": "Mr. Martin", "adresse": "10 Rue de Rivoli, Paris", "date": "2025-05-01", "prixHT": 1800.0, "prixTTC": 2160.0, "salaire": 600.0, "charges": 400.0},
        {"type": "Livraison", "client": "Mme. Lefevre", "adresse": "125 Avenue Montaigne, Paris", "date": "2025-05-03", "prixHT": 600.0, "prixTTC": 720.0, "salaire": 200.0, "charges": 100.0},
        {"type": "Déménagement", "client": "Entreprise ABC", "adresse": "45 Boulevard Haussmann, Paris", "date": "2025-05-07", "prixHT": 2500.0, "prixTTC": 3000.0, "salaire": 800.0, "charges": 500.0}
    ]
    for mission in missions:
        response = send_request("POST", f"{BASE_URL}/missions", mission)
        print(f"✅ Mission ajoutée: {response}")

def populate_finance():
    print("\n🔹 Ajout d'Investissements...")
    investissements = [
        {"nom": "Achat d'un camion de déménagement", "montant": 30000.0, "date": "2025-03-01", "categorie": "Véhicule"},
        {"nom": "Achat de matériel de manutention", "montant": 5000.0, "date": "2025-03-05", "categorie": "Équipement"},
        {"nom": "Assurance des véhicules", "montant": 2500.0, "date": "2025-03-10", "categorie": "Frais fixes"}
    ]
    for investissement in investissements:
        response = send_request("POST", f"{BASE_URL}/finance", investissement)
        print(f"✅ Investissement ajouté: {response}")

if __name__ == "__main__":
    print("🚀 Début du remplissage de la base de données")

    populate_rdvs()
    populate_missions()
    populate_finance()

    print("\n✅ Remplissage terminé !")

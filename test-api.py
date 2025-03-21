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

def test_rdvs():
    print("\n🔹 Test CRUD RDVs")
    success = True

    # CREATE (Ajout d'un RDV de livraison/déménagement)
    rdv_data = {
        "client": "Société ABC",
        "telephone": "0601020304",
        "adresse": "23 Rue Lafayette, Paris",
        "date": "2025-04-10T09:30",
        "type": "Déménagement"
    }
    response = send_request("POST", f"{BASE_URL}/rdvs", rdv_data)
    rdv_id = response.get("id") if response else None
    success &= bool(response)

    send_request("GET", f"{BASE_URL}/rdvs")

    # UPDATE (Modifier un RDV)
    if rdv_id:
        update_data = {
            "client": "Entreprise XYZ",
            "telephone": "0612345678",
            "adresse": "125 Avenue des Champs-Élysées, Paris",
            "date": "2025-04-12T14:00",
            "type": "Livraison"
        }
        success &= bool(send_request("PUT", f"{BASE_URL}/rdvs/{rdv_id}", update_data))

    # DELETE (Supprimer un RDV)
    if rdv_id:
        success &= bool(send_request("DELETE", f"{BASE_URL}/rdvs/{rdv_id}"))

    return success

def test_missions():
    print("\n🔹 Test CRUD Missions")
    success = True

    # CREATE (Ajout d'une mission de déménagement/livraison)
    mission_data = {
        "type": "Déménagement",
        "client": "Mr. Dupont",
        "adresse": "10 Boulevard Haussmann, Paris",
        "date": "2025-05-01",
        "prixHT": 2000.0,
        "prixTTC": 2400.0,
        "salaire": 600.0,
        "charges": 400.0
    }
    response = send_request("POST", f"{BASE_URL}/missions", mission_data)
    mission_id = response.get("id") if response else None
    success &= bool(response)

    send_request("GET", f"{BASE_URL}/missions")

    # UPDATE (Modifier une mission)
    if mission_id:
        update_data = {
            "type": "Livraison",
            "client": "Mme. Lefevre",
            "adresse": "78 Rue de Rivoli, Paris",
            "date": "2025-05-10",
            "prixHT": 800.0,
            "prixTTC": 960.0,
            "salaire": 250.0,
            "charges": 150.0
        }
        success &= bool(send_request("PUT", f"{BASE_URL}/missions/{mission_id}", update_data))

    # DELETE (Supprimer une mission)
    if mission_id:
        success &= bool(send_request("DELETE", f"{BASE_URL}/missions/{mission_id}"))

    return success

def test_finance():
    print("\n🔹 Test CRUD Finances")
    success = True

    # CREATE (Ajout d'un investissement en lien avec le métier)
    investissement_data = {
        "nom": "Achat d'un camion de déménagement",
        "montant": 25000.0,
        "date": "2025-03-15",
        "categorie": "Véhicule"
    }
    response = send_request("POST", f"{BASE_URL}/finance", investissement_data)
    investissement_id = response.get("id") if response else None
    success &= bool(response)

    send_request("GET", f"{BASE_URL}/finance")

    # UPDATE (Modifier un investissement)
    if investissement_id:
        update_data = {
            "nom": "Achat de matériel de manutention",
            "montant": 5000.0,
            "date": "2025-04-01",
            "categorie": "Équipement"
        }
        success &= bool(send_request("PUT", f"{BASE_URL}/finance/{investissement_id}", update_data))

    # DELETE (Supprimer un investissement)
    if investissement_id:
        success &= bool(send_request("DELETE", f"{BASE_URL}/finance/{investissement_id}"))

    return success

if __name__ == "__main__":
    print("🚀 Début des tests API")
    
    rdv_ok = test_rdvs()
    mission_ok = test_missions()
    finance_ok = test_finance()

    print("\n✅ Tests terminés")

    if rdv_ok and mission_ok and finance_ok:
        print("🎉 ✅ TOUS LES TESTS ONT RÉUSSI !")
    else:
        print("❌ ATTENTION : Certains tests ont échoué.")

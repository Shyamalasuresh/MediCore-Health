def test_read_stats(client):
    response = client.get("/api/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_patients" in data
    assert "appointments_today" in data

def test_create_patient(client):
    payload = {
        "patient_id": "P-TEST-001",
        "first_name": "Test",
        "last_name": "User",
        "date_of_birth": "1990-01-01T00:00:00",
        "gender": "Other",
        "email": "test@example.com",
        "phone": "1234567890",
        "address": "123 Test St",
        "blood_type": "O+",
        "emergency_contact": "Emergency Name",
        "status": "Active"
    }
    response = client.post("/api/patients", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "Test"
    assert data["email"] == "test@example.com"

def test_read_patients(client):
    # First create a patient
    client.post("/api/patients", json={
        "patient_id": "P-TEST-002",
        "first_name": "Alice",
        "last_name": "Smith",
        "date_of_birth": "1985-05-05T00:00:00",
        "gender": "Female",
        "email": "alice@example.com",
        "phone": "0987654321",
        "address": "456 Oak Ave",
        "blood_type": "A-",
        "emergency_contact": "Bob Smith",
        "status": "Active"
    })
    
    response = client.get("/api/patients")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(p["first_name"] == "Alice" for p in data)

def test_login_success(client):
    # Seed a user first
    client.post("/api/seed-users")
    
    login_data = {
        "email": "doctor@medicore.com",
        "password": "password123",
        "role": "doctor"
    }
    response = client.post("/api/auth/login", json=login_data)
    assert response.status_code == 200
    assert response.json()["email"] == "doctor@medicore.com"

def test_login_fail_wrong_password(client):
    client.post("/api/seed-users")
    
    login_data = {
        "email": "doctor@medicore.com",
        "password": "wrongpassword",
        "role": "doctor"
    }
    response = client.post("/api/auth/login", json=login_data)
    assert response.status_code == 401

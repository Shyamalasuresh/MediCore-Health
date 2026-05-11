from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, declarative_base
from typing import List
from datetime import datetime, timezone, date

from database import engine, get_db
import models, schemas

# ... (rest of imports and setup)

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="MediCore Health API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    today = datetime.date.today()
    
    total_patients = db.query(models.Patient).count()
    appointments_today = db.query(models.Appointment).filter(
        models.Appointment.appointment_date >= today
    ).count()
    
    # Mocking active operations for now
    active_operations = 12 
    
    # Calculate revenue from paid invoices for current month
    first_day = today.replace(day=1)
    revenue_query = db.query(models.Invoice).filter(
        models.Invoice.date >= first_day,
        models.Invoice.status == "Paid"
    ).with_entities(models.Invoice.amount).all()
    
    total_revenue = sum(item[0] for item in revenue_query) if revenue_query else 0.0

    return {
        "total_patients": total_patients,
        "appointments_today": appointments_today,
        "active_operations": active_operations,
        "monthly_revenue": total_revenue
    }

import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ... (middle part)

@app.get("/api/patients", response_model=List[schemas.Patient])
def read_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    logger.info("Fetching patients")
    patients = db.query(models.Patient).offset(skip).limit(limit).all()
    return patients

@app.post("/api/patients", response_model=schemas.Patient)
def create_patient(patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    logger.info(f"Creating patient: {patient.first_name} {patient.last_name}")
    try:
        db_patient = models.Patient(**patient.model_dump())
        db.add(db_patient)
        db.commit()
        db.refresh(db_patient)
        return db_patient
    except Exception as e:
        logger.error(f"Error creating patient: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/patients/{patient_id}", response_model=schemas.Patient)
def update_patient(patient_id: int, patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    db_patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    update_data = patient.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_patient, key, value)
    
    db.commit()
    db.refresh(db_patient)
    return db_patient

@app.delete("/api/patients/{patient_id}")
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    db.delete(db_patient)
    db.commit()
    return {"message": "Patient deleted successfully"}

@app.get("/api/appointments", response_model=List[schemas.Appointment])
def read_appointments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    appointments = db.query(models.Appointment).offset(skip).limit(limit).all()
    return appointments

@app.post("/api/appointments", response_model=schemas.Appointment)
def create_appointment(appointment: schemas.AppointmentCreate, db: Session = Depends(get_db)):
    logger.info(f"Creating appointment for patient_id: {appointment.patient_id}")
    try:
        db_appointment = models.Appointment(**appointment.dict())
        db.add(db_appointment)
        db.commit()
        db_appointment = db.query(models.Appointment).filter(models.Appointment.id == db_appointment.id).first()
        return db_appointment
    except Exception as e:
        logger.error(f"Error creating appointment: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/records", response_model=List[schemas.MedicalRecord])
def read_records(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    records = db.query(models.MedicalRecord).offset(skip).limit(limit).all()
    return records

@app.post("/api/records", response_model=schemas.MedicalRecord)
def create_record(record: schemas.MedicalRecordCreate, db: Session = Depends(get_db)):
    try:
        db_record = models.MedicalRecord(**record.dict())
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
        return db_record
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/invoices", response_model=List[schemas.Invoice])
def read_invoices(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    invoices = db.query(models.Invoice).offset(skip).limit(limit).all()
    return invoices

@app.post("/api/invoices", response_model=schemas.Invoice)
def create_invoice(invoice: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    try:
        db_invoice = models.Invoice(**invoice.dict())
        db.add(db_invoice)
        db.commit()
        db.refresh(db_invoice)
        return db_invoice
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/settings", response_model=List[schemas.ClinicSetting])
def read_settings(db: Session = Depends(get_db)):
    settings = db.query(models.ClinicSetting).all()
    return settings

@app.post("/api/settings", response_model=schemas.ClinicSetting)
def update_setting(setting: schemas.ClinicSettingCreate, db: Session = Depends(get_db)):
    db_setting = db.query(models.ClinicSetting).filter(models.ClinicSetting.key == setting.key).first()
    if db_setting:
        db_setting.value = setting.value
        db_setting.category = setting.category
    else:
        db_setting = models.ClinicSetting(**setting.dict())
        db.add(db_setting)
    db.commit()
    db.refresh(db_setting)
    return db_setting

@app.post("/api/auth/login")
def login(login_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # In a real app, check hashed password. Here we check plain text for simplicity.
    if user.password != login_data.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # ROLE VALIDATION / RED FLAGS
    # Admin has full access to both
    if user.role == "admin":
        return {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": login_data.role, # Allow admin to assume the role they picked
            "actual_role": "admin",
            "patient_id": user.patient_id
        }

    # Strict check for Patients entering Clinic Staff portal
    if login_data.role == "doctor" and user.role == "patient":
        raise HTTPException(
            status_code=403, 
            detail="RED FLAG: Patient account cannot access Clinic Staff portal!"
        )

    # Strict check for Clinic Staff entering Patient portal
    if login_data.role == "patient" and user.role == "doctor":
        raise HTTPException(
            status_code=403, 
            detail="RED FLAG: Clinic Staff account cannot access Patient portal!"
        )

    # If they are a patient, they MUST log in as patient (unless admin)
    # If they are a doctor, they MUST log in as doctor (unless admin)
    if user.role != login_data.role:
         raise HTTPException(
            status_code=403, 
            detail=f"Access Denied: Your account role is {user.role}, but you are trying to log in as {login_data.role}."
        )

    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "patient_id": user.patient_id
    }

@app.post("/api/seed-users")
def seed_users(db: Session = Depends(get_db)):
    # Add dummy users for testing
    users = [
        {"email": "doctor@medicore.com", "password": "password123", "full_name": "Dr. Sarah Wilson", "role": "doctor"},
        {"email": "patient@example.com", "password": "password123", "full_name": "John Doe", "role": "patient", "patient_id": 1},
        {"email": "admin@medicore.com", "password": "adminpassword", "full_name": "System Admin", "role": "admin"}
    ]
    
    for u_data in users:
        existing = db.query(models.User).filter(models.User.email == u_data["email"]).first()
        if not existing:
            user = models.User(**u_data)
            db.add(user)
    
    db.commit()
    return {"message": "Users seeded successfully"}

if __name__ == "__main__":
    import uvicorn
    # Added reload=True for development
    uvicorn.run("main_api:app", host="0.0.0.0", port=8000, reload=True)

        from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, unique=True, index=True) # e.g., P-1234
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    gender = Column(String)
    date_of_birth = Column(DateTime)
    address = Column(String)
    blood_type = Column(String)
    emergency_contact = Column(String)
    status = Column(String, default="Active")
    last_visit = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    appointments = relationship("Appointment", back_populates="patient")

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    patient_name = Column(String)
    doctor_name = Column(String)
    appointment_date = Column(DateTime)
    time = Column(String)
    type = Column(String) # Checkup, Consultation, Emergency, Follow-up
    status = Column(String) # Scheduled, Completed, Cancelled
    amount = Column(Float, default=0.0)
    notes = Column(Text)

    patient = relationship("Patient", back_populates="appointments")

class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    date = Column(DateTime, default=datetime.datetime.utcnow)
    diagnosis = Column(String)
    treatment = Column(Text)
    doctor_name = Column(String)
    blood_pressure = Column(String)
    heart_rate = Column(Integer)
    temperature = Column(Float)
    weight = Column(Float)
    notes = Column(Text)

    patient = relationship("Patient", back_populates="records")

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    patient_name = Column(String)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    amount = Column(Float)
    status = Column(String) # Paid, Pending, Overdue
    description = Column(Text)

    patient = relationship("Patient", back_populates="invoices")

# Update Patient model to include relationships
Patient.records = relationship("MedicalRecord", back_populates="patient")
Patient.invoices = relationship("Invoice", back_populates="patient")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String) # In a real app, use hashed passwords
    full_name = Column(String)
    role = Column(String) # 'doctor', 'patient', 'admin'
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=True)

    patient_link = relationship("Patient")

class ClinicSetting(Base):
    __tablename__ = "clinic_settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True) # e.g., 'clinic_name'
    value = Column(Text)
    category = Column(String) # e.g., 'general', 'billing', 'notifications'

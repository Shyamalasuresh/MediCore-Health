from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional

class AppointmentBase(BaseModel):
    patient_id: int
    patient_name: str
    doctor_name: str
    appointment_date: datetime
    time: str
    type: str
    status: str
    amount: float = 0.0
    notes: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int

class PatientBase(BaseModel):
    patient_id: str
    first_name: str
    last_name: str
    email: str
    phone: str
    gender: str
    date_of_birth: datetime
    address: str
    blood_type: str
    emergency_contact: str
    status: Optional[str] = "Active"
    last_visit: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    appointments: List[Appointment] = []

class MedicalRecordBase(BaseModel):
    patient_id: int
    diagnosis: str
    treatment: str
    doctor_name: str
    blood_pressure: str
    heart_rate: int
    temperature: float
    weight: float
    notes: Optional[str] = None

class MedicalRecordCreate(MedicalRecordBase):
    pass

class MedicalRecord(MedicalRecordBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    date: datetime

class InvoiceBase(BaseModel):
    patient_id: int
    patient_name: str
    amount: float
    status: str
    description: str

class InvoiceCreate(InvoiceBase):
    pass

class Invoice(InvoiceBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    date: datetime

class ClinicSettingBase(BaseModel):
    key: str
    value: str
    category: str

class ClinicSettingCreate(ClinicSettingBase):
    pass

class ClinicSetting(ClinicSettingBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int

class UserBase(BaseModel):
    email: str
    full_name: str
    role: str
    patient_id: Optional[int] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int

class UserLogin(BaseModel):
    email: str
    password: str
    role: str # The role they are TRYING to log in as

class DashboardStats(BaseModel):
    total_patients: int
    appointments_today: int
    active_operations: int
    monthly_revenue: float

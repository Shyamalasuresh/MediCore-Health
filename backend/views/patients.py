from PySide6.QtWidgets import QWidget, QHBoxLayout, QVBoxLayout, QLabel, QMessageBox
from PySide6.QtCore import Slot
import datetime

from views.base import BaseView
from widgets.tables import DataTable
from widgets.forms import FormCard, build_text_field, build_combo
from database import SessionLocal
import models


class PatientView(BaseView):
    def __init__(self):
        super().__init__()

        split = QWidget()
        split_layout = QHBoxLayout(split)
        split_layout.setSpacing(16)

        self.patient_table = DataTable(
            headers=["ID", "Name", "Status", "Primary Doctor", "Next Visit"],
            rows=[],
            title="Patient Roster",
        )
        split_layout.addWidget(self.patient_table, 2)

        forms = QWidget()
        forms_layout = QVBoxLayout(forms)
        forms_layout.setSpacing(16)

        self.add_form = FormCard("Add Patient", "Capture demographics and contact details.")
        self.name_field = build_text_field("Maria Anders")
        self.dob_field = build_text_field("YYYY-MM-DD")
        self.gender_field = build_combo(("Female", "Male", "Non-binary", "Decline"))
        self.contact_field = build_text_field("+1 (555) 010-4488")
        self.insurance_field = build_text_field("BlueCross Secure")
        
        self.add_form.form.addRow("Full Name", self.name_field)
        self.add_form.form.addRow("DOB", self.dob_field)
        self.add_form.form.addRow("Gender", self.gender_field)
        self.add_form.form.addRow("Contact", self.contact_field)
        self.add_form.form.addRow("Insurance", self.insurance_field)
        
        self.add_form.primary_action.setText("Save Patient")
        self.add_form.primary_action.clicked.connect(self.save_patient)
        forms_layout.addWidget(self.add_form)

        profile = FormCard("Patient Profile", "Snapshot of selected patient's medical summary.")
        profile.form.addRow("Condition", build_text_field("Congestive Heart Failure"))
        profile.form.addRow("Allergies", build_text_field("Penicillin"))
        profile.form.addRow("Care Team", build_text_field("Dr. Cruz, RN Patel"))
        profile.primary_action.setText("Update Profile")
        forms_layout.addWidget(profile)

        split_layout.addWidget(forms, 1)
        self.content_layout.addWidget(split)
        
        self.load_patients()

    def load_patients(self):
        db = SessionLocal()
        try:
            patients = db.query(models.Patient).all()
            rows = []
            for p in patients:
                rows.append([
                    p.patient_id,
                    f"{p.first_name} {p.last_name}",
                    p.status,
                    "N/A",  # Primary Doctor not in model yet
                    p.last_visit or "N/A"
                ])
            
            # If no patients, show some placeholder or empty
            if not rows:
                rows = [["N/A", "No Patients Found", "N/A", "N/A", "N/A"]]
            
            self.patient_table.set_rows(rows)
        finally:
            db.close()

    @Slot()
    def save_patient(self):
        name = self.name_field.text()
        dob_str = self.dob_field.text()
        gender = self.gender_field.currentText()
        contact = self.contact_field.text()
        
        if not name:
            QMessageBox.warning(self, "Validation Error", "Name is required.")
            return

        db = SessionLocal()
        try:
            # Simple name split for demonstration
            name_parts = name.split(" ", 1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ""
            
            # Simple date parsing
            try:
                dob = datetime.datetime.strptime(dob_str, "%Y-%m-%d")
            except ValueError:
                dob = datetime.datetime.now() # Fallback

            new_patient = models.Patient(
                patient_id=f"P-{datetime.datetime.now().strftime('%M%S')}",
                first_name=first_name,
                last_name=last_name,
                date_of_birth=dob,
                gender=gender,
                phone=contact,
                email=f"{first_name.lower()}@example.com", # Placeholder
                address="Placeholder Address",
                blood_type="O+", # Placeholder
                emergency_contact="None",
                status="Active"
            )
            db.add(new_patient)
            db.commit()
            QMessageBox.information(self, "Success", "Patient saved successfully!")
            self.load_patients()
            
            # Clear fields
            self.name_field.clear()
            self.dob_field.clear()
            self.contact_field.clear()
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Failed to save patient: {str(e)}")
        finally:
            db.close()



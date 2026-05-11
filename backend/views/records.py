from PySide6.QtWidgets import QWidget, QHBoxLayout, QVBoxLayout, QLabel, QPushButton

from views.base import BaseView
from widgets.tables import DataTable
from widgets.forms import FormCard, build_text_field, build_combo
from widgets.cards import SectionCard


class MedicalRecordsView(BaseView):
    def __init__(self):
        super().__init__()

        records_table = DataTable(
            title="Medical Record Log",
            headers=["Record #", "Patient", "Diagnosis", "Updated", "Owner"],
            rows=[
                ["MR-8831", "Helen Finch", "CHF exacerbation", "09:12", "Dr. Cruz"],
                ["MR-8832", "Marcus Lee", "Asthma flare", "09:45", "Dr. Nguyen"],
                ["MR-8833", "Priya Desai", "Neuro evaluation", "10:10", "Dr. Chen"],
            ],
        )
        self.content_layout.addWidget(records_table)

        split = QWidget()
        split_layout = QHBoxLayout(split)
        split_layout.setSpacing(16)

        add_record = FormCard("Add Record", "Document vitals, assessments, and plan of care.")
        add_record.form.addRow("Patient", build_combo(("Helen Finch", "Marcus Lee", "Priya Desai")))
        add_record.form.addRow("Visit Type", build_combo(("Inpatient", "Outpatient", "Emergency")))
        add_record.form.addRow("Diagnosis", build_text_field("Enter diagnosis summary"))
        add_record.form.addRow("Vitals", build_text_field("BP 118/76, HR 78, Temp 98.6°F", multiline=True))
        add_record.form.addRow("Plan", build_text_field("Continue IV diuretics; labs at 14:00", multiline=True))
        add_record.primary_action.setText("Save Record")
        split_layout.addWidget(add_record, 1)

        uploads = SectionCard("Document Uploads", "Attach imaging, labs, bedside photos.")
        upload_desc = QLabel("Drop files here or select from device (PDF, JPG, DICOM).")
        upload_desc.setWordWrap(True)
        upload_btn = QPushButton("Browse Files")
        uploads.layout().addWidget(upload_desc)
        uploads.layout().addWidget(upload_btn)

        prescription = SectionCard("Prescription Preview", "Generate shareable digital Rx.")
        preview = QLabel(
            "Medication: Furosemide 40mg IV q8h\nDuration: 5 days\nDirections: Monitor electrolytes."
        )
        preview.setStyleSheet("font-family: 'JetBrains Mono', monospace;")
        prescription.layout().addWidget(preview)

        right_col = QWidget()
        right_layout = QVBoxLayout(right_col)
        right_layout.setSpacing(16)
        right_layout.addWidget(uploads)
        right_layout.addWidget(prescription)

        split_layout.addWidget(right_col, 1)
        self.content_layout.addWidget(split)


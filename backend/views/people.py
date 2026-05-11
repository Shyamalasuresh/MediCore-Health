from PySide6.QtWidgets import QWidget, QHBoxLayout, QVBoxLayout

from views.base import BaseView
from widgets.tables import DataTable
from widgets.forms import FormCard, build_text_field, build_combo
from widgets.cards import SectionCard


class PeopleView(BaseView):
    def __init__(self):
        super().__init__()

        doctor_table = DataTable(
            title="Doctor Directory",
            headers=["Doctor", "Specialty", "Department", "Status", "Ext."],
            rows=[
                ["Dr. Cruz", "Cardiology", "Heart Institute", "On Call", "8812"],
                ["Dr. Chen", "Neurology", "Neuro Sciences", "In Surgery", "8821"],
                ["Dr. Young", "Pulmonology", "Critical Care", "Clinic", "8834"],
            ],
        )
        self.content_layout.addWidget(doctor_table)

        split = QWidget()
        split_layout = QHBoxLayout(split)
        split_layout.setSpacing(16)

        add_doctor = FormCard("Add Doctor", "Verify credentials before provisioning access.")
        add_doctor.form.addRow("Full Name", build_text_field("Dr. Angela Moss"))
        add_doctor.form.addRow("Specialty", build_combo(("Cardiology", "Neurology", "Oncology", "Pediatrics")))
        add_doctor.form.addRow("License #", build_text_field("MED-99823"))
        add_doctor.form.addRow("Contact", build_text_field("+1 (555) 010-2244"))
        add_doctor.primary_action.setText("Add Doctor")
        split_layout.addWidget(add_doctor, 1)

        staff_panel = SectionCard("Staff Panel", "Assign shift leads and command center roles.")
        staff_table = DataTable(
            title="",
            headers=["Name", "Role", "Shift", "Reach"],
            rows=[
                ["Emma Patel", "Nurse Supervisor", "Day", "Pager 44"],
                ["Carlos Diaz", "Admin Coordinator", "Swing", "Pager 98"],
                ["Jamie Roy", "Respiratory Therapist", "Night", "Pager 11"],
            ],
        )
        staff_panel.layout().addWidget(staff_table)
        split_layout.addWidget(staff_panel, 1)

        self.content_layout.addWidget(split)


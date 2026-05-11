from PySide6.QtWidgets import QWidget, QHBoxLayout, QVBoxLayout, QLabel, QGridLayout, QPushButton

from views.base import BaseView
from widgets.forms import FormCard, build_combo, build_text_field
from widgets.cards import SectionCard
from widgets.tables import DataTable


class AppointmentView(BaseView):
    def __init__(self):
        super().__init__()

        top_section = QWidget()
        top_layout = QHBoxLayout(top_section)
        top_layout.setSpacing(16)

        calendar = SectionCard("Calendar", "Tap a day to review time slots.")
        grid = QGridLayout()
        days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        for c, day in enumerate(days):
            label = QLabel(day)
            label.setStyleSheet("font-weight: 600;")
            grid.addWidget(label, 0, c)
        for r in range(1, 5):
            for c in range(7):
                btn = QPushButton(f"{r*2 + c}")
                btn.setObjectName("Ghost")
                grid.addWidget(btn, r, c)
        calendar.layout().addLayout(grid)
        top_layout.addWidget(calendar, 2)

        create_form = FormCard("Create Appointment", "Coordinate consults, imaging, and follow-ups.")
        create_form.form.addRow("Patient", build_combo(("Helen Finch", "Marcus Lee", "Priya Desai")))
        create_form.form.addRow("Doctor", build_combo(("Dr. Cruz", "Dr. Chen", "Dr. Young")))
        create_form.form.addRow("Type", build_combo(("Consult", "Procedure", "Telehealth")))
        create_form.form.addRow("Date", build_text_field("2025-11-25"))
        create_form.form.addRow("Time", build_text_field("14:30"))
        create_form.form.addRow("Notes", build_text_field("Bring imaging reports", multiline=True))
        create_form.primary_action.setText("Schedule")
        top_layout.addWidget(create_form, 1)

        self.content_layout.addWidget(top_section)

        history = DataTable(
            title="Appointment History",
            headers=["Date", "Patient", "Provider", "Status", "Mode"],
            rows=[
                ["Nov 20", "Helen Finch", "Dr. Cruz", "Completed", "Inpatient"],
                ["Nov 21", "Marcus Lee", "Dr. Young", "Cancelled", "Clinic"],
                ["Nov 22", "Priya Desai", "Dr. Chen", "Completed", "Telehealth"],
            ],
        )
        self.content_layout.addWidget(history)


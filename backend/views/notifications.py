from PySide6.QtWidgets import QWidget, QVBoxLayout, QLabel, QPushButton

from views.base import BaseView
from widgets.cards import SectionCard


class NotificationsView(BaseView):
    def __init__(self):
        super().__init__()

        alerts = SectionCard("Critical Alerts", "Escalations requiring immediate attention.")
        alert_list = QWidget()
        alert_layout = QVBoxLayout(alert_list)
        alert_layout.setSpacing(8)

        events = [
            ("Sepsis watch", "Patient PT-1089 has rising lactate levels."),
            ("Allergy flag", "Verify contrast order for PT-1022."),
            ("Radiology ready", "CT Angio results available in PACS."),
        ]
        for title, body in events:
            card = SectionCard(title, body)
            card.layout().addWidget(QPushButton("Acknowledge"))
            alert_layout.addWidget(card)
        alerts.layout().addWidget(alert_list)
        self.content_layout.addWidget(alerts)

        reminders = SectionCard("Reminders", "Track staff tasks and protocol updates.")
        for text in (
            "Submit antibiotic stewardship report",
            "Refresh crash cart inventory checklist",
            "Send discharge summary templates",
        ):
            label = QLabel(f"• {text}")
            reminders.layout().addWidget(label)
        self.content_layout.addWidget(reminders)


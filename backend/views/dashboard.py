from PySide6.QtWidgets import QWidget, QGridLayout, QHBoxLayout

from views.base import BaseView
from widgets.cards import StatCard, InfoCard, SectionCard
from widgets.tables import DataTable


class DashboardView(BaseView):
    def __init__(self):
        super().__init__()

        stats = QWidget()
        stats_layout = QGridLayout(stats)
        stats_layout.setSpacing(16)
        stat_data = [
            ("Total Patients", "1,240", "+4.8% vs last week", "#2ecc71"),
            ("Active Appointments", "86", "+12 scheduled today", "#1d8cf8"),
            ("Pending Records", "34", "5 require review", "#f5a623"),
            ("Billing Alerts", "7", "3 overdue invoices", "#ff4757"),
        ]
        for i, (label, value, trend, color) in enumerate(stat_data):
            card = StatCard(label, value, trend, color)
            stats_layout.addWidget(card, i // 2, i % 2)
        self.content_layout.addWidget(stats)

        recent = SectionCard("Recent Activity", "Latest medical updates and actions")
        recent_table = DataTable(
            headers=["Time", "Event", "Owner"],
            rows=[
                ["09:18", "Vitals updated for Helen Finch", "Nurse Patel"],
                ["10:02", "Prescription approved", "Dr. Chen"],
                ["10:30", "MRI report uploaded", "Radiology"],
            ],
            title="",
        )
        recent.layout().addWidget(recent_table)
        self.content_layout.addWidget(recent)

        grid_container = QWidget()
        grid_layout = QHBoxLayout(grid_container)
        grid_layout.setSpacing(16)

        grid_layout.addWidget(
            InfoCard("Critical Alerts", "2 abnormal lab results need review. Neurology flagged one stroke risk pattern.")
        )
        grid_layout.addWidget(
            InfoCard("Quick Actions", "Admit patient, update isolation protocols, contact care teams.")
        )
        grid_layout.addWidget(
            InfoCard("Command Center", "Escalate stroke code, launch telepresence, dispatch transport.")
        )
        self.content_layout.addWidget(grid_container)


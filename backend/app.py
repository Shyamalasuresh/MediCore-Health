from typing import Dict

from PySide6.QtCore import Qt, Slot
from PySide6.QtWidgets import (
    QWidget,
    QMainWindow,
    QHBoxLayout,
    QVBoxLayout,
    QStackedWidget,
    QSpacerItem,
    QSizePolicy,
)

from core.theme import ThemeManager
from widgets.navigation import SidebarNavigation, TopBar
from views.dashboard import DashboardView
from views.auth import AuthView
from views.patients import PatientView
from views.records import MedicalRecordsView
from views.appointments import AppointmentView
from views.people import PeopleView
from views.billing import BillingView
from views.notifications import NotificationsView
from views.settings import SettingsView


class MainWindow(QMainWindow):
    """Primary application window that wires navigation and stacked pages."""

    def __init__(self, theme_manager: ThemeManager):
        super().__init__()
        self.setWindowTitle("MediCore Health - Healthcare Record Suite")
        self.resize(1440, 900)
        self.theme_manager = theme_manager
        self.stack = QStackedWidget()
        self.views: Dict[str, QWidget] = {}

        container = QWidget()
        layout = QHBoxLayout(container)
        layout.setContentsMargins(0, 0, 0, 0)

        self.sidebar = SidebarNavigation(
            items=[
                ("Dashboard", "dashboard"),
                ("Authentication", "auth"),
                ("Patients", "patients"),
                ("Medical Records", "records"),
                ("Appointments", "appointments"),
                ("Doctors & Staff", "people"),
                ("Billing", "billing"),
                ("Notifications", "notifications"),
                ("Settings", "settings"),
            ]
        )
        self.sidebar.section_changed.connect(self.show_view)

        right_panel = QWidget()
        right_layout = QVBoxLayout(right_panel)
        right_layout.setContentsMargins(0, 0, 0, 0)
        right_layout.setSpacing(0)

        self.top_bar = TopBar(theme_manager=self.theme_manager)
        self.top_bar.theme_toggled.connect(self.toggle_theme)

        right_layout.addWidget(self.top_bar)
        right_layout.addWidget(self.stack)
        right_layout.addItem(QSpacerItem(0, 0, QSizePolicy.Expanding, QSizePolicy.Minimum))

        layout.addWidget(self.sidebar, 0)
        layout.addWidget(right_panel, 1)

        self.setCentralWidget(container)

        self._register_views()
        self.show_view("dashboard")

    def _register_views(self) -> None:
        self._add_view("dashboard", DashboardView())
        self._add_view("auth", AuthView())
        self._add_view("patients", PatientView())
        self._add_view("records", MedicalRecordsView())
        self._add_view("appointments", AppointmentView())
        self._add_view("people", PeopleView())
        self._add_view("billing", BillingView())
        self._add_view("notifications", NotificationsView())
        self._add_view("settings", SettingsView(theme_manager=self.theme_manager))

    def _add_view(self, key: str, widget: QWidget) -> None:
        self.views[key] = widget
        self.stack.addWidget(widget)

    @Slot(str)
    def show_view(self, key: str) -> None:
        widget = self.views.get(key)
        if widget:
            self.stack.setCurrentWidget(widget)
            self.sidebar.set_active(key)

    @Slot()
    def toggle_theme(self) -> None:
        self.theme_manager.toggle_mode()
        self.theme_manager.apply(self)
        for view in self.views.values():
            view.setStyleSheet(self.theme_manager.component_stylesheet())
        self.top_bar.setStyleSheet(self.theme_manager.topbar_stylesheet())
        self.sidebar.setStyleSheet(self.theme_manager.sidebar_stylesheet())


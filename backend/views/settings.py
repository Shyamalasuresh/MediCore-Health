from PySide6.QtWidgets import QWidget, QHBoxLayout, QVBoxLayout, QLabel, QPushButton

from core.theme import ThemeManager
from views.base import BaseView
from widgets.forms import FormCard, build_text_field
from widgets.cards import SectionCard


class SettingsView(BaseView):
    def __init__(self, theme_manager: ThemeManager):
        super().__init__()
        self.theme_manager = theme_manager

        split = QWidget()
        split_layout = QHBoxLayout(split)
        split_layout.setSpacing(16)

        profile = FormCard("Profile Settings", "Update contact info and credentials.")
        profile.form.addRow("Full Name", build_text_field("Dr. Aiden Brooks"))
        profile.form.addRow("Email", build_text_field("aiden.brooks@medicore.com"))
        profile.form.addRow("Phone", build_text_field("+1 (555) 010-7788"))
        profile.primary_action.setText("Save Profile")
        split_layout.addWidget(profile, 1)

        security = FormCard("Security", "Maintain strong passwords and MFA.")
        security.form.addRow("Current Password", build_text_field("••••••"))
        security.form.addRow("New Password", build_text_field("Min 12 characters"))
        security.form.addRow("Confirm Password", build_text_field("Repeat new password"))
        security.primary_action.setText("Change Password")
        split_layout.addWidget(security, 1)

        self.content_layout.addWidget(split)

        themes = SectionCard("Appearance", "Switch between light and dark themes.")
        toggle = QPushButton("Toggle Theme")
        toggle.clicked.connect(self._toggle_theme)
        themes.layout().addWidget(toggle)
        self.content_layout.addWidget(themes)

    def _toggle_theme(self) -> None:
        self.theme_manager.toggle_mode()
        self.theme_manager.apply(self.window())


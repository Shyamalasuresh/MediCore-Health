from PySide6.QtWidgets import QWidget, QTabWidget, QHBoxLayout

from views.base import BaseView
from widgets.forms import FormCard, build_text_field


class AuthView(BaseView):
    def __init__(self):
        super().__init__()
        tabs = QTabWidget()

        tabs.addTab(self._login_tab(), "Login")
        tabs.addTab(self._signup_tab(), "Sign Up")
        tabs.addTab(self._forgot_tab(), "Forgot Password")

        self.content_layout.addWidget(tabs)

    def _login_tab(self) -> QWidget:
        card = FormCard("Secure Login", "Authenticate to access protected patient data.")
        card.form.addRow("Email", build_text_field("medical@clinic.com"))
        card.form.addRow("Password", build_text_field("••••••"))
        card.primary_action.setText("Login")
        return card

    def _signup_tab(self) -> QWidget:
        card = FormCard("Create Provider Account", "Provision access for new doctors and care teams.")
        card.form.addRow("Full Name", build_text_field("Dr. Eleanor Cruz"))
        card.form.addRow("Email", build_text_field("eleanor@medicore.com"))
        card.form.addRow("Role", build_text_field("Cardiology Lead"))
        card.form.addRow("Password", build_text_field("min 12 characters"))
        card.primary_action.setText("Create Account")
        return card

    def _forgot_tab(self) -> QWidget:
        card = FormCard("Password Recovery", "Send a time-bound OTP to the registered email.")
        card.form.addRow("Email Address", build_text_field("alerts@hospital.org"))
        card.primary_action.setText("Send Reset Link")
        return card


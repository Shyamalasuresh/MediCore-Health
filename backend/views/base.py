from PySide6.QtCore import Qt
from PySide6.QtWidgets import QScrollArea, QWidget, QVBoxLayout


class BaseView(QScrollArea):
    """Scrollable base class to keep consistent padding and spacing."""

    def __init__(self):
        super().__init__()
        self.setWidgetResizable(True)
        container = QWidget()
        layout = QVBoxLayout(container)
        layout.setContentsMargins(24, 24, 24, 24)
        layout.setSpacing(20)
        self.content_layout = layout
        self.setWidget(container)


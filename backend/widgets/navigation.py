from typing import List, Tuple

from PySide6.QtCore import Qt, Signal
from PySide6.QtWidgets import (
    QWidget,
    QVBoxLayout,
    QLabel,
    QPushButton,
    QHBoxLayout,
    QLineEdit,
    QSizePolicy,
)

from core.theme import ThemeManager


class SidebarNavigation(QWidget):
    section_changed = Signal(str)

    def __init__(self, items: List[Tuple[str, str]]):
        super().__init__()
        self.setObjectName("Sidebar")
        self.setFixedWidth(260)
        self.buttons: List[QPushButton] = []
        layout = QVBoxLayout(self)
        layout.setContentsMargins(24, 24, 24, 24)
        layout.setSpacing(12)

        title = QLabel("MediCore Health")
        title.setStyleSheet("font-size: 22px; font-weight: 700;")
        layout.addWidget(title)

        for label, key in items:
            btn = QPushButton(label)
            btn.setObjectName("SidebarItem")
            btn.setProperty("route", key)
            btn.clicked.connect(lambda _, route=key: self.section_changed.emit(route))
            btn.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed)
            self.buttons.append(btn)
            layout.addWidget(btn)

        layout.addStretch()

    def set_active(self, key: str) -> None:
        for btn in self.buttons:
            btn.setProperty("active", "true" if btn.property("route") == key else "false")
            btn.setStyle(btn.style())


class TopBar(QWidget):
    theme_toggled = Signal()

    def __init__(self, theme_manager: ThemeManager):
        super().__init__()
        self.setObjectName("TopBar")
        self.theme_manager = theme_manager

        layout = QHBoxLayout(self)
        layout.setContentsMargins(24, 12, 24, 12)
        layout.setSpacing(16)

        title = QLabel("Healthcare Command Center")
        title.setStyleSheet("font-size: 20px; font-weight: 600;")

        self.search = QLineEdit()
        self.search.setObjectName("GlobalSearch")
        self.search.setPlaceholderText("Search patients, appointments, staff…")

        quick_actions = QHBoxLayout()
        quick_actions.setSpacing(8)
        action_labels = ["New Patient", "New Record", "Schedule Visit"]
        for text in action_labels:
            pill = QPushButton(text)
            pill.setObjectName("Ghost")
            quick_actions.addWidget(pill)

        # Notification and Theme Toggle Group
        right_actions = QHBoxLayout()
        right_actions.setSpacing(12)

        self.notif_btn = QPushButton("🔔")
        self.notif_btn.setObjectName("Ghost")
        self.notif_btn.setFixedSize(44, 40)
        
        theme_btn = QPushButton("🌓")
        theme_btn.setObjectName("Ghost")
        theme_btn.setFixedSize(44, 40)
        theme_btn.clicked.connect(self.theme_toggled.emit)

        right_actions.addWidget(self.notif_btn)
        right_actions.addWidget(theme_btn)

        layout.addWidget(title)
        layout.addWidget(self.search, 1)
        layout.addLayout(quick_actions)
        layout.addLayout(right_actions)


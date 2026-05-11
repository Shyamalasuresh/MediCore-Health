from typing import Iterable, Tuple

from PySide6.QtWidgets import (
    QWidget,
    QFrame,
    QVBoxLayout,
    QLabel,
    QHBoxLayout,
    QPushButton,
)


class SectionCard(QFrame):
    """Reusable elevated container with title and optional action."""

    def __init__(self, title: str, subtitle: str | None = None, actions: Iterable[Tuple[str, callable]] | None = None):
        super().__init__()
        self.setObjectName("Card")
        layout = QVBoxLayout(self)
        layout.setContentsMargins(24, 24, 24, 24)
        layout.setSpacing(16)

        header = QHBoxLayout()
        title_label = QLabel(title)
        title_label.setObjectName("SectionTitle")
        header.addWidget(title_label)

        if subtitle:
            subtitle_label = QLabel(subtitle)
            subtitle_label.setStyleSheet("color: #718096;")
            header.addWidget(subtitle_label)

        header.addStretch()

        if actions:
            for text, callback in actions:
                btn = QPushButton(text)
                btn.setObjectName("Ghost")
                btn.clicked.connect(callback)
                header.addWidget(btn)

        layout.addLayout(header)


class StatCard(QFrame):
    def __init__(self, label: str, value: str, trend: str, color: str):
        super().__init__()
        self.setObjectName("Card")
        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(8)

        label_widget = QLabel(label.upper())
        label_widget.setStyleSheet("font-size: 12px; color: #8892a6;")
        value_widget = QLabel(value)
        value_widget.setStyleSheet("font-size: 32px; font-weight: 700;")
        trend_widget = QLabel(trend)
        trend_widget.setStyleSheet(f"color: {color}; font-size: 14px;")

        layout.addWidget(label_widget)
        layout.addWidget(value_widget)
        layout.addWidget(trend_widget)


class InfoCard(QFrame):
    def __init__(self, title: str, body: str):
        super().__init__()
        self.setObjectName("Card")
        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(8)
        title_label = QLabel(title)
        title_label.setStyleSheet("font-weight: 600; font-size: 16px;")
        body_label = QLabel(body)
        body_label.setWordWrap(True)

        layout.addWidget(title_label)
        layout.addWidget(body_label)


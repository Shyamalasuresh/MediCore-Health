from typing import Dict, Tuple

from PySide6.QtWidgets import (
    QFrame,
    QVBoxLayout,
    QLabel,
    QLineEdit,
    QTextEdit,
    QComboBox,
    QFormLayout,
    QPushButton,
    QWidget,
)


class FormCard(QFrame):
    """Styled form container with built-in layout."""

    def __init__(self, title: str, description: str | None = None):
        super().__init__()
        self.setObjectName("Card")
        layout = QVBoxLayout(self)
        layout.setContentsMargins(24, 24, 24, 24)
        layout.setSpacing(12)

        heading = QLabel(title)
        heading.setObjectName("SectionTitle")
        layout.addWidget(heading)

        if description:
            desc = QLabel(description)
            desc.setWordWrap(True)
            desc.setStyleSheet("color: #6b7280;")
            layout.addWidget(desc)

        self.form = QFormLayout()
        self.form.setSpacing(12)
        layout.addLayout(self.form)

        self.primary_action = QPushButton("Save")
        layout.addWidget(self.primary_action)


def build_text_field(placeholder: str = "", multiline: bool = False) -> QWidget:
    if multiline:
        field = QTextEdit()
        field.setPlaceholderText(placeholder)
        field.setFixedHeight(96)
    else:
        field = QLineEdit()
        field.setPlaceholderText(placeholder)
    return field


def build_combo(options: Tuple[str, ...]) -> QComboBox:
    combo = QComboBox()
    combo.addItems(options)
    return combo


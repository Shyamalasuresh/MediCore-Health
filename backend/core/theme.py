from __future__ import annotations

from dataclasses import dataclass
from PySide6.QtGui import QPalette, QColor
from PySide6.QtWidgets import QApplication, QWidget


@dataclass
class PaletteDefinition:
    background: str
    surface: str
    surface_alt: str
    accent: str
    accent_soft: str
    text_primary: str
    text_secondary: str
    border: str
    success: str
    warning: str
    danger: str


LIGHT = PaletteDefinition(
    background="#f5f7fb",
    surface="#ffffff",
    surface_alt="#f0f2f8",
    accent="#1d8cf8",
    accent_soft="#dbeeff",
    text_primary="#1c1f2e",
    text_secondary="#5a6275",
    border="#e3e7ef",
    success="#2ecc71",
    warning="#f5a623",
    danger="#ff4757",
)

DARK = PaletteDefinition(
    background="#111827",
    surface="#1f2937",
    surface_alt="#2d3748",
    accent="#4c9bff",
    accent_soft="#1f3b63",
    text_primary="#f7fafc",
    text_secondary="#cbd5f5",
    border="#374151",
    success="#27ae60",
    warning="#f5a623",
    danger="#ff6b6b",
)


class ThemeManager:
    """Centralized theme toggler and stylesheet generator."""

    def __init__(self) -> None:
        self.mode = "light"
        self.palette = LIGHT

    def toggle_mode(self) -> None:
        self.mode = "dark" if self.mode == "light" else "light"
        self.palette = DARK if self.mode == "dark" else LIGHT

    def apply(self, target: QApplication | QWidget) -> None:
        palette = QPalette()
        palette.setColor(QPalette.Window, QColor(self.palette.background))
        palette.setColor(QPalette.Base, QColor(self.palette.surface))
        palette.setColor(QPalette.WindowText, QColor(self.palette.text_primary))
        palette.setColor(QPalette.Text, QColor(self.palette.text_primary))
        palette.setColor(QPalette.Button, QColor(self.palette.surface))
        palette.setColor(QPalette.ButtonText, QColor(self.palette.text_primary))
        target.setPalette(palette)
        target.setStyleSheet(self.component_stylesheet())

    def component_stylesheet(self) -> str:
        p = self.palette
        return f"""
            QWidget {{
                background-color: {p.background};
                color: {p.text_primary};
                font-family: 'Inter', 'Segoe UI', sans-serif;
            }}
            QFrame#Card {{
                background-color: {p.surface};
                border-radius: 16px;
                border: 1px solid {p.border};
            }}
            QLabel#SectionTitle {{
                font-size: 20px;
                font-weight: 600;
            }}
            QPushButton {{
                border-radius: 10px;
                padding: 10px 18px;
                background-color: {p.accent};
                color: #ffffff;
                border: none;
                font-weight: 600;
            }}
            QPushButton#Ghost {{
                background-color: transparent;
                border: 1px solid {p.border};
                color: {p.text_secondary};
            }}
            QLineEdit, QComboBox, QTextEdit {{
                border-radius: 10px;
                border: 1px solid {p.border};
                padding: 10px 12px;
                background-color: {p.surface};
                color: {p.text_primary};
            }}
            QTableWidget {{
                background-color: {p.surface};
                border-radius: 14px;
            }}
            QHeaderView::section {{
                background-color: {p.surface_alt};
                border: none;
                padding: 12px 8px;
                font-weight: 600;
            }}
        """

    def sidebar_stylesheet(self) -> str:
        p = self.palette
        return f"""
            QWidget#Sidebar {{
                background-color: {p.surface};
                border-right: 1px solid {p.border};
            }}
            QPushButton#SidebarItem {{
                text-align: left;
                padding: 12px 18px;
                border-radius: 12px;
                border: none;
                color: {p.text_secondary};
                font-weight: 500;
            }}
            QPushButton#SidebarItem[active="true"] {{
                background-color: {p.accent_soft};
                color: {p.accent};
            }}
        """

    def topbar_stylesheet(self) -> str:
        p = self.palette
        return f"""
            QWidget#TopBar {{
                background-color: {p.surface};
                border-bottom: 1px solid {p.border};
            }}
            QLineEdit#GlobalSearch {{
                background-color: {p.surface_alt};
                border: none;
                padding: 8px 12px;
                border-radius: 12px;
            }}
        """


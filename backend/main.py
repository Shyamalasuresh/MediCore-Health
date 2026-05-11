"""Entry point for the MediCore Healthcare UI application."""

from PySide6.QtWidgets import QApplication
from PySide6.QtGui import QFontDatabase
import sys

from app import MainWindow
from core.theme import ThemeManager
from database import engine
import models

def load_fonts() -> None:
    """Loads bundled fonts if available for consistent typography."""
    for family in ("Inter-Regular.ttf", "Inter-SemiBold.ttf"):
        try:
            QFontDatabase.addApplicationFont(f"assets/fonts/{family}")
        except Exception:
            # Font loading is optional; the UI will fall back to system fonts.
            pass

def init_db() -> None:
    """Creates database tables if they don't exist."""
    models.Base.metadata.create_all(bind=engine)

def main() -> None:
    app = QApplication(sys.argv)
    load_fonts()
    init_db()

    theme = ThemeManager()
    theme.apply(app)

    window = MainWindow(theme_manager=theme)
    window.show()

    sys.exit(app.exec())


if __name__ == "__main__":
    main()


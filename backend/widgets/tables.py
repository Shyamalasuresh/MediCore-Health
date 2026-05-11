from typing import List

from PySide6.QtWidgets import (
    QFrame,
    QVBoxLayout,
    QLineEdit,
    QTableWidget,
    QTableWidgetItem,
    QLabel,
)


class DataTable(QFrame):
    """Table widget with built-in search and sorting."""

    def __init__(self, headers: List[str], rows: List[List[str]], title: str):
        super().__init__()
        self.setObjectName("Card")
        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(12)

        heading = QLabel(title)
        heading.setObjectName("SectionTitle")
        layout.addWidget(heading)

        self.search = QLineEdit()
        self.search.setPlaceholderText("Search…")
        self.search.textChanged.connect(self.filter_rows)
        layout.addWidget(self.search)

        self.table = QTableWidget(len(rows), len(headers))
        self.table.setHorizontalHeaderLabels(headers)
        self.table.setSortingEnabled(True)
        self.table.verticalHeader().setVisible(False)
        self.table.setShowGrid(False)
        self._raw_rows = rows

        for i, row in enumerate(rows):
            for j, value in enumerate(row):
                item = QTableWidgetItem(value)
                self.table.setItem(i, j, item)

        self.table.resizeColumnsToContents()
        layout.addWidget(self.table)

    def set_rows(self, rows: List[List[str]]) -> None:
        self.table.setRowCount(len(rows))
        self._raw_rows = rows
        for i, row in enumerate(rows):
            for j, value in enumerate(row):
                item = QTableWidgetItem(value)
                self.table.setItem(i, j, item)
        self.table.resizeColumnsToContents()

    def filter_rows(self, text: str) -> None:
        query = text.lower()
        for row_idx, row in enumerate(self._raw_rows):
            is_visible = any(query in cell.lower() for cell in row)
            self.table.setRowHidden(row_idx, not is_visible)


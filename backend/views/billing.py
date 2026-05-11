from PySide6.QtWidgets import QWidget, QHBoxLayout, QVBoxLayout, QLabel

from views.base import BaseView
from widgets.tables import DataTable
from widgets.forms import FormCard, build_text_field, build_combo
from widgets.cards import SectionCard


class BillingView(BaseView):
    def __init__(self):
        super().__init__()

        invoice_table = DataTable(
            title="Invoices",
            headers=["Invoice #", "Patient", "Amount", "Status", "Due"],
            rows=[
                ["INV-2201", "Helen Finch", "$8,240", "Pending", "Nov 30"],
                ["INV-2198", "Marcus Lee", "$640", "Paid", "Nov 18"],
                ["INV-2180", "Priya Desai", "$1,930", "Overdue", "Nov 10"],
            ],
        )
        self.content_layout.addWidget(invoice_table)

        split = QWidget()
        split_layout = QHBoxLayout(split)
        split_layout.setSpacing(16)

        add_invoice = FormCard("Add Invoice", "Create standardized statements with ICD tagging.")
        add_invoice.form.addRow("Patient", build_combo(("Helen Finch", "Marcus Lee", "Priya Desai")))
        add_invoice.form.addRow("Procedure Code", build_text_field("99233"))
        add_invoice.form.addRow("Amount", build_text_field("$0.00"))
        add_invoice.form.addRow("Coverage", build_text_field("80% Insurance"))
        add_invoice.form.addRow("Notes", build_text_field("Include telemetry fees", multiline=True))
        add_invoice.primary_action.setText("Generate Invoice")
        split_layout.addWidget(add_invoice, 1)

        receipt = SectionCard("Receipt Preview", "Share secure payment confirmation.")
        receipt_text = QLabel(
            "Receipt #REC-993\nDate: 24 Nov 2025\nPayment Method: ACH\nAuthorized By: Billing Ops"
        )
        receipt_text.setWordWrap(True)
        receipt.layout().addWidget(receipt_text)
        split_layout.addWidget(receipt, 1)

        self.content_layout.addWidget(split)


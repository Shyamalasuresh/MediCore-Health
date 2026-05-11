# MediCore Health Python UI

Modern, fully client-side healthcare record interface built with PySide6. There is **no backend logic**—all data in the views is illustrative and can be wired to real services later.

## Structure

- `main.py` – boots the Qt application, loads fonts, wires theme manager.
- `app.py` – defines `MainWindow`, sidebar navigation, top bar, and stacked pages.
- `core/theme.py` – central theme palette, light/dark toggling, global stylesheets.
- `widgets/` – reusable UI atoms (navigation, cards, forms, tables).
- `views/` – screen modules for every feature area (auth, patients, records, appointments, people, billing, notifications, settings, dashboard).

## Running locally

```bash
cd python_ui
python -m venv .venv
.venv\Scripts\activate  # or source .venv/bin/activate on macOS/Linux
pip install -r requirements.txt
python main.py
```

## Extending

- Plug real data into each view by replacing the mock tables/forms.
- Use `ThemeManager` to set brand colors or inject hospital palettes.
- Custom widgets live in `widgets/`; inherit from them to keep consistency.


from sqlalchemy import text
from database import engine

def migrate():
    with engine.connect() as conn:
        print("Starting appointments migration...")
        
        # List of columns to add if they don't exist
        columns_to_add = [
            ("type", "VARCHAR"),
            ("time", "VARCHAR"),
            ("patient_name", "VARCHAR")
        ]
        
        for col_name, col_type in columns_to_add:
            try:
                conn.execute(text(f"ALTER TABLE appointments ADD COLUMN {col_name} {col_type}"))
                conn.commit()
                print(f"Added column: {col_name}")
            except Exception as e:
                if "already exists" in str(e).lower():
                    print(f"Column {col_name} already exists, skipping.")
                else:
                    print(f"Error adding {col_name}: {e}")

if __name__ == "__main__":
    migrate()

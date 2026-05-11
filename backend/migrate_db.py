from sqlalchemy import text
from database import engine

def migrate():
    with engine.connect() as conn:
        print("Starting migration...")
        
        # List of columns to add if they don't exist
        columns_to_add = [
            ("first_name", "VARCHAR"),
            ("last_name", "VARCHAR"),
            ("address", "VARCHAR"),
            ("blood_type", "VARCHAR"),
            ("emergency_contact", "VARCHAR"),
            ("status", "VARCHAR DEFAULT 'Active'"),
            ("last_visit", "VARCHAR")
        ]
        
        for col_name, col_type in columns_to_add:
            try:
                conn.execute(text(f"ALTER TABLE patients ADD COLUMN {col_name} {col_type}"))
                conn.commit()
                print(f"Added column: {col_name}")
            except Exception as e:
                if "already exists" in str(e).lower():
                    print(f"Column {col_name} already exists, skipping.")
                else:
                    print(f"Error adding {col_name}: {e}")

if __name__ == "__main__":
    migrate()

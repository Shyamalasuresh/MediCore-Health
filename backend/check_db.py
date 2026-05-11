from database import engine
from sqlalchemy import inspect
import models

def check_schema():
    inspector = inspect(engine)
    columns = inspector.get_columns('patients')
    print("Columns in 'patients' table:")
    for column in columns:
        print(f"- {column['name']}: {column['type']}")

if __name__ == "__main__":
    try:
        check_schema()
    except Exception as e:
        print(f"Error: {e}")

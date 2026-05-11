import os
import sys
from mangum import Mangum

# Add the project root to sys.path so we can import from backend
sys.path.append(os.path.join(os.path.dirname(__file__), "../../"))

from backend.main_api import app

handler = Mangum(app)

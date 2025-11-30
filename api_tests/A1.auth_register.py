import time
import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from utils import BASE_URL, send_and_print

# Generate a unique email to avoid collision
unique_id = int(time.time())
email = f"user_{unique_id}@example.com"
password = "password123"
name = f"Test User {unique_id}"

print(f"--- Attempting to Register: {email} ---")

url = f"{BASE_URL}/auth/register"
body = {
    "name": name,
    "email": email,
    "password": password
}

response = send_and_print(
    url=url,
    method="POST",
    body=body,
    output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json",
)
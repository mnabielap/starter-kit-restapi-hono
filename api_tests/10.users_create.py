import time
import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from utils import BASE_URL, send_and_print, load_config

access_token = load_config("access_token")

# Generate unique user data
unique_id = int(time.time())
new_email = f"admin_created_{unique_id}@example.com"

if not access_token:
    print("Error: No access_token found. Please run auth_login.py (as Admin).")
else:
    url = f"{BASE_URL}/users"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    body = {
        "name": f"Admin Created User {unique_id}",
        "email": new_email,
        "password": "password123",
        "role": "user"
    }

    send_and_print(
        url=url,
        method="POST",
        headers=headers,
        body=body,
        output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json",
    )
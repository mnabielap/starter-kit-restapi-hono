import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from utils import BASE_URL, send_and_print, load_config

access_token = load_config("access_token")

if not access_token:
    print("Error: No access_token found. Please run auth_login.py (as Admin).")
else:
    # Query params for pagination and sorting
    url = f"{BASE_URL}/users?limit=10&page=1&sortBy=created_at:desc"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    send_and_print(
        url=url,
        method="GET",
        headers=headers,
        output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json",
    )
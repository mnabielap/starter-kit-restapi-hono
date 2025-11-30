import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from utils import BASE_URL, send_and_print, load_config

access_token = load_config("access_token")
user_id = load_config("user_id")

if not access_token or not user_id:
    print("Error: No access_token or user_id found. Please run auth_login.py.")
else:
    print(f"--- WARNING: Deleting user with ID {user_id} ---")
    
    url = f"{BASE_URL}/users/{user_id}"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    send_and_print(
        url=url,
        method="DELETE",
        headers=headers,
        output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json",
    )
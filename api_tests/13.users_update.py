import time
import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from utils import BASE_URL, send_and_print, load_config

access_token = load_config("access_token")
user_id = load_config("user_id")

if not access_token or not user_id:
    print("Error: No access_token or user_id found. Please run auth_login.py.")
else:
    url = f"{BASE_URL}/users/{user_id}"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    # Update the name with a timestamp to see the change
    body = {
        "name": f"Updated Name {int(time.time())}"
    }

    send_and_print(
        url=url,
        method="PATCH",
        headers=headers,
        body=body,
        output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json",
    )
import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from utils import BASE_URL, send_and_print, load_config

access_token = load_config("access_token")

if not access_token:
    print("Error: No access_token found. Please run auth_login.py.")
else:
    url = f"{BASE_URL}/auth/send-verification-email"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    send_and_print(
        url=url,
        method="POST",
        headers=headers,
        output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json",
    )
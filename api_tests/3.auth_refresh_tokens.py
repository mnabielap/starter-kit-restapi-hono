import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from utils import BASE_URL, send_and_print, load_config, save_config

refresh_token = load_config("refresh_token")

if not refresh_token:
    print("Error: No refresh_token found in secrets.json. Please run auth_login.py first.")
else:
    url = f"{BASE_URL}/auth/refresh-tokens"
    body = {
        "refreshToken": refresh_token
    }

    response = send_and_print(
        url=url,
        method="POST",
        body=body,
        output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json",
    )

    if response.status_code == 200:
        data = response.json()
        # Update config with new tokens
        save_config("access_token", data.get("access", {}).get("token"))
        save_config("refresh_token", data.get("refresh", {}).get("token"))
        print("\n[SUCCESS] Tokens refreshed and updated in secrets.json")
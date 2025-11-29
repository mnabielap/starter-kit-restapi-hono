import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from utils import BASE_URL, send_and_print, save_config

# You can change these credentials to match a registered user
email = "admin@example.com" # Or use the email generated in register step
password = "password123"

# Note: If you just ran auth_register.py, you might want to manually 
# update this email to the one that was just created, or stick to a 
# static seed user like 'admin@example.com' if you seeded the DB.

print(f"--- Attempting to Login: {email} ---")

url = f"{BASE_URL}/auth/login"
body = {
    "email": email,
    "password": password
}

response = send_and_print(
    url=url,
    method="POST",
    body=body,
    output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json",
)

if response.status_code == 200:
    data = response.json()
    user = data.get("user", {})
    tokens = data.get("tokens", {})
    
    # Save secrets for other scripts to use
    save_config("user_id", user.get("id"))
    save_config("access_token", tokens.get("access", {}).get("token"))
    save_config("refresh_token", tokens.get("refresh", {}).get("token"))
    
    print("\n[SUCCESS] Tokens and User ID saved to secrets.json")
else:
    print("\n[FAIL] Could not login. Please check credentials.")
import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from utils import BASE_URL, send_and_print

# Placeholder token. In a real scenario, this comes from the email link.
token = "valid_reset_token_here" 
new_password = "newPassword123"

url = f"{BASE_URL}/auth/reset-password?token={token}"
body = {
    "password": new_password
}

send_and_print(
    url=url,
    method="POST",
    body=body,
    output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json",
)
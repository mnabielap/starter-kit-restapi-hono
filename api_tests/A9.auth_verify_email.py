import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from utils import BASE_URL, send_and_print

# Placeholder token.
token = "valid_verify_email_token_here"

url = f"{BASE_URL}/auth/verify-email?token={token}"

send_and_print(
    url=url,
    method="POST",
    output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json",
)
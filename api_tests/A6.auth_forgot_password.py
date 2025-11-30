import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from utils import BASE_URL, send_and_print

# Use an email that exists in the database
email = "john.doe@example.com" 

url = f"{BASE_URL}/auth/forgot-password"
body = {
    "email": email
}

send_and_print(
    url=url,
    method="POST",
    body=body,
    output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json",
)
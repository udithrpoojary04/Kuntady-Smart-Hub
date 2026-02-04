import urllib.request
import urllib.error
import json

URL = 'http://localhost:8000/api/buses/'

try:
    with urllib.request.urlopen(URL) as response:
        print(f"Status: {response.status}")
        data = json.loads(response.read().decode())
        print(f"Data count: {len(data)}")
        if len(data) > 0:
            print("First item:", data[0])
except urllib.error.URLError as e:
    print(f"Error: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")

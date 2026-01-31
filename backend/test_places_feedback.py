import urllib.request
import urllib.error
import json
import sys

BASE_URL = 'http://localhost:8000/api'
USERNAME = 'admin'
PASSWORD = 'Urpoojary@04'

def make_request(url, method='GET', data=None, headers=None):
    if headers is None:
        headers = {}
    
    if data is not None:
        data = json.dumps(data).encode('utf-8')
        headers['Content-Type'] = 'application/json'
    
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()
    except Exception as e:
        return 500, str(e)

def test_features():
    # 1. Login
    print("Attempting login...")
    status, result = make_request(f'{BASE_URL}/token/', 'POST', {'username': USERNAME, 'password': PASSWORD})
    
    if status != 200:
        print(f"Login failed: {status} {result}")
        return
    
    access_token = result['access']
    print("Login successful.")
    headers = {'Authorization': f'Bearer {access_token}'}
    
    # 2. Test Create Place
    print("\nTesting Create Famous Place...")
    place_data = {
        "name": "Test Place",
        "description": "A beautiful test place",
        "location_url": "https://maps.google.com"
    }
    status, result = make_request(f'{BASE_URL}/places/', 'POST', place_data, headers)
    if status == 201:
        print("Create Place SUCCESS")
        print(result)
        # Cleanup
        place_id = result['id']
        make_request(f'{BASE_URL}/places/{place_id}/', 'DELETE', headers=headers)
    else:
        print(f"Create Place FAILED: {status} {result}")

    # 3. Test Create Feedback (Anonymous)
    print("\nTesting Create Feedback...")
    feedback_data = {
        "name": "Test User",
        "email": "test@example.com",
        "message": "Great app!"
    }
    status, result = make_request(f'{BASE_URL}/feedback/', 'POST', feedback_data)
    if status == 201:
        print("Create Feedback SUCCESS")
    else:
        print(f"Create Feedback FAILED: {status} {result}")

    # 4. Test List Feedback (Admin)
    print("\nTesting List Feedback...")
    status, result = make_request(f'{BASE_URL}/feedback/', 'GET', headers=headers)
    if status == 200:
        print(f"List Feedback SUCCESS. Count: {len(result)}")
        print(result)
    else:
        print(f"List Feedback FAILED: {status} {result}")

if __name__ == '__main__':
    test_features()

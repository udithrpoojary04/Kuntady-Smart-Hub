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

def test_api():
    # 1. Login
    print("Attempting login...")
    status, result = make_request(f'{BASE_URL}/token/', 'POST', {'username': USERNAME, 'password': PASSWORD})
    
    if status != 200:
        print(f"Login failed: {status} {result}")
        if isinstance(result, str):
            print("Raw response:", result)
        return
    
    access_token = result['access']
    print("Login successful, token obtained.")
    
    headers = {'Authorization': f'Bearer {access_token}'}
    
    # 2. Test Create Bus
    print("\nTesting Create Bus...")
    bus_data = {
        "bus_name": "Test Bus",
        "bus_number": "KA-19-TEST",
        "start_point": "Mangalore",
        "end_point": "Udupi",
        "departure_time": "10:00",
        "arrival_time": "11:00",
        "via": "Surathkal"
    }
    status, result = make_request(f'{BASE_URL}/buses/', 'POST', bus_data, headers)
    
    if status == 201:
        print("Create Bus SUCCESS")
        print(result)
        # Cleanup
        bus_id = result['id']
        make_request(f'{BASE_URL}/buses/{bus_id}/', 'DELETE', headers=headers)
    else:
        print(f"Create Bus FAILED: {status} {result}")

    # 3. Test Create Transport Service
    print("\nTesting Create Transport Service...")
    transport_data = {
        "service_type": "AUTO",
        "provider_name": "Test Driver",
        "contact_number": "9999999999",
        "stand_location": "Main Stand",
        "service_area": "City Limits"
    }
    status, result = make_request(f'{BASE_URL}/transport-services/', 'POST', transport_data, headers)
    
    if status == 201:
        print("Create Transport Service SUCCESS")
        print(result)
        # Cleanup
        transport_id = result['id']
        make_request(f'{BASE_URL}/transport-services/{transport_id}/', 'DELETE', headers=headers)
    else:
        print(f"Create Transport Service FAILED: {status} {result}")

if __name__ == '__main__':
    try:
        test_api()
    except Exception as e:
        print(f"Test failed with exception: {e}")

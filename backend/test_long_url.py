import urllib.request
import urllib.error
import json

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

def test_long_url():
    # Login
    status, result = make_request(f'{BASE_URL}/token/', 'POST', {'username': USERNAME, 'password': PASSWORD})
    if status != 200:
        print(f"Login failed: {status}")
        return
    access_token = result['access']
    headers = {'Authorization': f'Bearer {access_token}'}

    # Test Long URL
    long_url = "https://www.bing.com/maps/search?q=very+long+search+query+that+might+exceed+the+default+limit+of+django+url+field+which+is+typically+200+characters+so+we+need+to+test+if+this+causes+a+validation+error+or+not+because+bing+urls+are+long"
    # Make it > 200 chars
    long_url += "&param=" + "a"*100
    
    print(f"Testing URL length: {len(long_url)}")
    
    place_data = {
        "name": "Test Place Long URL",
        "description": "Testing long URL",
        "location_url": long_url
    }
    
    status, result = make_request(f'{BASE_URL}/places/', 'POST', place_data, headers)
    print(f"Status: {status}")
    print(f"Result: {result}")

if __name__ == '__main__':
    test_long_url()

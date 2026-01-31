import os
import sys
import django

# Add the project directory to sys.path
sys.path.append(os.getcwd())

from dotenv import load_dotenv
load_dotenv()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transport_project.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

try:
    user = User.objects.get(username='admin')
    user.set_password('Urpoojary@04')
    user.save()
    print("Password for 'admin' set to 'Urpoojary@04'")
except User.DoesNotExist:
    print("User 'admin' does not exist")
except Exception as e:
    print(f"Error: {e}")

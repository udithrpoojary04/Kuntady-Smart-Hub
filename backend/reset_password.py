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
    new_password = 'admin'  # TODO: Replace 'admin' with your desired password
    user.set_password(new_password)
    user.save()
    print(f"Password for 'admin' set to '{new_password}'")
except User.DoesNotExist:
    print("User 'admin' does not exist")
except Exception as e:
    print(f"Error: {e}")

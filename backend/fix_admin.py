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

# Delete users with empty username
empty_users = User.objects.filter(username='')
print(f"Deleting {empty_users.count()} users with empty username")
empty_users.delete()

# Create admin user if not exists
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin')
    print("Superuser 'admin' created with password 'admin'")
else:
    u = User.objects.get(username='admin')
    u.set_password('admin')
    u.save()
    print("Superuser 'admin' password reset to 'admin'")

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

print(f"User model: {User}")
users = User.objects.all()
print(f"Total users: {users.count()}")
for user in users:
    print(f"Username: {user.username}, Is Superuser: {user.is_superuser}, Is Staff: {user.is_staff}")


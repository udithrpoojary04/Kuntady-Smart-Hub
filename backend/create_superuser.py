import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transport_project.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin')

if not User.objects.filter(username=username).exists():
    print(f"Creating superuser '{username}'...")
    User.objects.create_superuser(username, email, password)
    print(f"Superuser '{username}' created.")
else:
    print(f"Superuser '{username}' exists. Updating password...")
    u = User.objects.get(username=username)
    u.email = email
    u.set_password(password)
    u.save()
    print(f"Superuser '{username}' password updated.")

import os
import sys
import django

# Add the project directory to sys.path
sys.path.append(os.getcwd())

from dotenv import load_dotenv
load_dotenv()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transport_project.settings')
django.setup()

from django.db import connection

print("Database Engine:", connection.settings_dict['ENGINE'])
print("Database Name:", connection.settings_dict['NAME'])

tables_to_drop = ['transport_bus', 'transport_transportservice']

with connection.cursor() as cursor:
    for table in tables_to_drop:
        print(f"Attempting to drop {table}...")
        try:
            # Use CASCADE to remove dependencies
            cursor.execute(f"DROP TABLE IF EXISTS \"{table}\" CASCADE;")
            print(f"Dropped {table}.")
        except Exception as e:
            print(f"Error dropping {table}: {e}")

print("Cleanup complete.")

import os
import sys
import django

# Add the project directory to sys.path
sys.path.append(os.getcwd())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transport_project.settings')
django.setup()

from django.db import connection

print("Database Engine:", connection.settings_dict['ENGINE'])
print("Database Name:", connection.settings_dict['NAME'])

try:
    with connection.cursor() as cursor:
        table_names = connection.introspection.table_names(cursor)
        print("Tables found:", table_names)
        
        if 'transport_bus' in table_names:
            print("transport_bus EXISTS")
            columns = connection.introspection.get_table_description(cursor, 'transport_bus')
            print("Columns:", [col.name for col in columns])
        else:
            print("transport_bus MISSING")
except Exception as e:
    print(f"Error inspecting DB: {e}")

# Transportation Information Website

A full-stack web application for Smart Kuntady (Buses, Autos, Tempos, Places) with multilingual support (English/Kannada).

## Tech Stack
-   **Backend**: Python, Django, Django REST Framework, PostgreSQL
-   **Frontend**: React, Vite, Tailwind CSS
-   **Authentication**: JWT (JSON Web Tokens)

## Setup Instructions

### Prerequisites
-   Python 3.8+
-   Node.js 16+
-   PostgreSQL (Optional: SQLite is configured by default if Postgres config is removed, but project is set for Postgres)

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Create and activate virtual environment:
    ```bash
    python -m venv venv
    # Windows
    .\venv\Scripts\activate
    # Linux/Mac
    # source venv/bin/activate
    ```

3.  Install dependencies:
    ```bash
    pip install django djangorestframework psycopg2-binary django-cors-headers djangorestframework-simplejwt Pillow
    ```

4.  Configure Database:
    -   Update `transport_project/settings.py` `DATABASES` section with your PostgreSQL credentials (User: `postgres`, Password: `password`, DB: `transport_db`).
    -   Ensure the database `transport_db` exists in your PostgreSQL.

5.  Run Migrations:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

6.  Create Admin User:
    ```bash
    python create_superuser.py
    # Or manually:
    python manage.py createsuperuser
    ```

7.  Run Server:
    ```bash
    python manage.py runserver
    ```

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run Development Server:
    ```bash
    npm run dev
    ```

4.  Open http://localhost:5173 to view the app.

### Admin Access
-   Go to `/admin` in the frontend for the Custom Dashboard.
-   Go to `http://localhost:8000/admin/` for Django Admin Panel.

## Features
-   **Bus Timings**: Searchable list of buses.
-   **Transport Services**: Details of Autos/Tempos.
-   **Famous Places**: Local attraction details.
-   **Feedback**: Public feedback form.
-   **Multilingual**: Toggle between English and Kannada.

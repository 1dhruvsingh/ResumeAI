    # Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Django and other backend dependencies
pip install django djangorestframework django-cors-headers python-docx PyPDF2 celery redis weasyprint

# Create Django project
django-admin startproject resume_converter
cd resume_converter
python manage.py startapp api

# Create React frontend
npx create-react-app frontend
cd frontend
npm install @material-ui/core @material-ui/icons axios 
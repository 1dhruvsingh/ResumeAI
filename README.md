# Resume Converter

## Overview
The Resume Converter is a web application that allows users to upload resumes in various formats and convert them to a predefined template.
It has 3 versions currently 

## Setup Instructions
1. Clone the repository.
2. Navigate to the project directory.
3. Set up the backend:
   - Create a virtual environment: `python -m venv venv`
   - Activate the virtual environment: `source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
   - Install dependencies: `pip install -r requirements.txt`
   - Run the Django server: `python manage.py runserver`
4. Set up the frontend:
   - Navigate to the `frontend` directory.
   - Install dependencies: `npm install`
   - Start the React development server: `npm start`

## Code Structure
- `api/`: Contains the Django app for handling resume uploads and processing.
- `frontend/`: Contains the React app for the user interface.
- `templates/`: Stores HTML templates for resume conversion.

## API Documentation
- `/api/resumes/`: Endpoint for uploading and processing resumes.

## Contribution Guidelines
- Follow the coding standards outlined in the `CONTRIBUTING.md` file.
- Write tests for new features and bug fixes.
- Submit pull requests for review. 

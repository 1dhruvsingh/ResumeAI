from celery import shared_task
from .models import Resume
import PyPDF2
from docx import Document
from .parsers import ResumeParser
import json
from .conversion import render_resume, generate_pdf

@shared_task
def process_resume(resume_id):
    resume = Resume.objects.get(id=resume_id)
    try:
        # Extract text based on file type
        file_path = resume.original_file.path
        extracted_text = ""
        
        if file_path.endswith('.pdf'):
            with open(file_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                for page in reader.pages:
                    extracted_text += page.extract_text()
        elif file_path.endswith('.docx'):
            doc = Document(file_path)
            extracted_text = '\n'.join([paragraph.text for paragraph in doc.paragraphs])
        elif file_path.endswith('.txt'):
            with open(file_path, 'r', encoding='utf-8') as file:
                extracted_text = file.read()
        
        # Parse the extracted text
        parser = ResumeParser(extracted_text)
        parsed_data = parser.parse()
        
        # Render the resume template
        html_content = render_resume(parsed_data)
        
        # Generate PDF
        output_path = f'media/processed/resume_{resume_id}.pdf'
        generate_pdf(html_content, output_path)
        
        # Update the resume record
        resume.processed_file.name = output_path
        resume.status = 'processed'
        resume.save()
        
    except Exception as e:
        resume.status = 'failed'
        resume.error_message = str(e)
        resume.save()
        raise e 
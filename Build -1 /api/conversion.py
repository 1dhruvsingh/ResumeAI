from jinja2 import Environment, FileSystemLoader
import os
from weasyprint import HTML

def render_resume(parsed_data, template_name='basic_template.html'):
    env = Environment(loader=FileSystemLoader('templates/resumes'))
    template = env.get_template(template_name)
    return template.render(parsed_data)

def generate_pdf(html_content, output_path):
    HTML(string=html_content).write_pdf(output_path) 
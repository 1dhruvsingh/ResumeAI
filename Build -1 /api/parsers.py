import re
from typing import Dict, List, Optional
import spacy

class ResumeSection:
    def __init__(self, title: str, content: str):
        self.title = title
        self.content = content

class ResumeParser:
    SECTION_HEADERS = {
        'contact': r'(?i)(contact|personal) information',
        'summary': r'(?i)(summary|objective|profile)',
        'experience': r'(?i)(experience|work|employment|history)',
        'education': r'(?i)education',
        'skills': r'(?i)(skills|technical skills|expertise)',
        'projects': r'(?i)(projects|personal projects)',
    }

    # Load a pre-trained NLP model
    nlp = spacy.load('en_core_web_sm')

    def __init__(self, text: str):
        self.text = text
        self.sections: Dict[str, ResumeSection] = {}
        self.parsed_data: Dict[str, any] = {}

    def parse(self) -> Dict[str, any]:
        self._split_into_sections()
        self._parse_contact_info()
        self._parse_experience()
        self._parse_education()
        self._parse_skills()
        return self.parsed_data

    def _split_into_sections(self):
        # Combine all section headers into one regex pattern
        section_pattern = '|'.join(self.SECTION_HEADERS.values())
        
        # Find all section starts
        matches = list(re.finditer(section_pattern, self.text, re.MULTILINE))
        
        for i in range(len(matches)):
            start = matches[i].start()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(self.text)
            
            section_text = self.text[start:end].strip()
            section_title = matches[i].group(0)
            
            # Determine section type
            for section_type, pattern in self.SECTION_HEADERS.items():
                if re.match(pattern, section_title, re.IGNORECASE):
                    self.sections[section_type] = ResumeSection(section_title, section_text)
                    break

    def _parse_contact_info(self):
        if 'contact' not in self.sections:
            return

        content = self.sections['contact'].content
        
        # Extract email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email = re.search(email_pattern, content)
        
        # Extract phone
        phone_pattern = r'\b(?:\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b'
        phone = re.search(phone_pattern, content)
        
        # Extract LinkedIn URL
        linkedin_pattern = r'linkedin\.com/\S+'
        linkedin = re.search(linkedin_pattern, content)

        self.parsed_data['contact'] = {
            'email': email.group(0) if email else None,
            'phone': phone.group(0) if phone else None,
            'linkedin': linkedin.group(0) if linkedin else None,
        }

    def _parse_experience(self):
        if 'experience' not in self.sections:
            return

        content = self.sections['experience'].content
        experiences = []
        
        # Use NLP to extract entities
        doc = self.nlp(content)
        for ent in doc.ents:
            if ent.label_ == 'ORG':
                # Extract company names
                company = ent.text
            elif ent.label_ == 'DATE':
                # Extract and standardize dates
                date = ent.text
            # Add more entity extraction as needed

        # Split into individual positions
        positions = re.split(r'\n\s*\n', content)
        
        for position in positions:
            if not position.strip():
                continue
                
            # Extract company and title
            company_pattern = r'^(.+?)\s*(?:[-|])\s*(.+?)(?:\n|$)'
            match = re.match(company_pattern, position)
            
            if match:
                experiences.append({
                    'company': match.group(1).strip(),
                    'title': match.group(2).strip(),
                    'description': position[match.end():].strip()
                })

        self.parsed_data['experience'] = experiences

    def _parse_education(self):
        if 'education' not in self.sections:
            return

        content = self.sections['education'].content
        education = []
        
        # Split into individual entries
        entries = re.split(r'\n\s*\n', content)
        
        for entry in entries:
            if not entry.strip():
                continue
                
            # Extract degree and institution
            degree_pattern = r'^(.+?)\s*(?:[-|])\s*(.+?)(?:\n|$)'
            match = re.match(degree_pattern, entry)
            
            if match:
                education.append({
                    'institution': match.group(1).strip(),
                    'degree': match.group(2).strip(),
                    'details': entry[match.end():].strip()
                })

        self.parsed_data['education'] = education

    def _parse_skills(self):
        if 'skills' not in self.sections:
            return

        content = self.sections['skills'].content
        
        # Remove section header
        skills_content = re.sub(self.SECTION_HEADERS['skills'], '', content, flags=re.IGNORECASE)
        
        # Split skills by common delimiters
        skills = re.split(r'[,|•|\n]', skills_content)
        
        # Clean and filter skills
        skills = [skill.strip() for skill in skills if skill.strip()]
        
        self.parsed_data['skills'] = skills 
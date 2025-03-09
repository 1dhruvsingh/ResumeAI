from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from dotenv import load_dotenv
import os
import google.generativeai as genai
from database import db, User, Resume, JobDescription
import json
from datetime import timedelta
import uuid
import re

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True)

# Configure Flask app
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///resumeai.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

# Initialize extensions
jwt = JWTManager(app)
db.init_app(app)

# Configure Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

# Create database tables
with app.app_context():
    db.create_all()

# Helper functions
def extract_keywords(text):
    """Extract keywords from text using Gemini AI"""
    prompt = f"""
    Extract the top 10 most important keywords from this job description. 
    Focus on skills, qualifications, and technologies.
    Return only a JSON array of strings.
    
    Job Description:
    {text}
    """
    
    response = model.generate_content(prompt)
    try:
        # Try to parse as JSON
        keywords = json.loads(response.text)
        if isinstance(keywords, list):
            return keywords
        return []
    except:
        # Fallback: try to extract keywords from text response
        try:
            # Look for anything that might be a JSON array in the response
            match = re.search(r'\[.*\]', response.text, re.DOTALL)
            if match:
                keywords = json.loads(match.group(0))
                if isinstance(keywords, list):
                    return keywords
        except:
            pass
        
        # Last resort: split by commas or newlines
        words = re.split(r'[,\n]', response.text)
        return [word.strip().strip('"\'[]') for word in words if word.strip()]

def analyze_resume(resume_data, job_description=None):
    """Analyze resume using Gemini AI"""
    # Convert resume data to string representation
    resume_text = f"""
    # {resume_data['personalInfo']['fullName']}
    Email: {resume_data['personalInfo']['email']}
    Phone: {resume_data['personalInfo']['phone']}
    Location: {resume_data['personalInfo']['location']}
    
    ## Summary
    {resume_data['summary']}
    
    ## Experience
    {' '.join([f"{job['title']} at {job['company']}, {job['startDate']} - {job['endDate']}: {' '.join(job['description'])}" for job in resume_data['workExperience']])}
    
    ## Education
    {' '.join([f"{edu['degree']} from {edu['institution']}, {edu['graduationDate']}" for edu in resume_data['education']])}
    
    ## Skills
    {', '.join(resume_data['skills'])}
    """
    
    if job_description:
        prompt = f"""
        Analyze this resume against the job description. Provide detailed feedback in the following JSON format:
        {{
            "score": {{
                "overall": <0-100 score>,
                "content": <0-100 score>,
                "keywords": <0-100 score>,
                "format": <0-100 score>
            }},
            "analysis": {{
                "atsCompatibility": [<list of ATS compatibility issues>],
                "grammarIssues": [<list of grammar issues>],
                "sentimentFeedback": [<list of tone/sentiment feedback>]
            }},
            "keywords": {{
                "found": [<keywords from job description found in resume>],
                "missing": [<important keywords from job description missing in resume>]
            }},
            "suggestions": [<list of specific improvement suggestions>]
        }}
        
        Resume:
        {resume_text}
        
        Job Description:
        {job_description}
        """
    else:
        prompt = f"""
        Analyze this resume and provide detailed feedback in the following JSON format:
        {{
            "score": {{
                "overall": <0-100 score>,
                "content": <0-100 score>,
                "keywords": <0-100 score>,
                "format": <0-100 score>
            }},
            "analysis": {{
                "atsCompatibility": [<list of ATS compatibility issues>],
                "grammarIssues": [<list of grammar issues>],
                "sentimentFeedback": [<list of tone/sentiment feedback>]
            }},
            "suggestions": [<list of specific improvement suggestions>]
        }}
        
        Resume:
        {resume_text}
        """
    
    response = model.generate_content(prompt)
    
    try:
        # Try to parse as JSON
        analysis = json.loads(response.text)
        return analysis
    except:
        # Fallback: return a basic analysis
        return {
            "score": {
                "overall": 70,
                "content": 70,
                "keywords": 70,
                "format": 70
            },
            "analysis": {
                "atsCompatibility": ["Could not analyze ATS compatibility"],
                "grammarIssues": ["Could not analyze grammar"],
                "sentimentFeedback": ["Could not analyze sentiment"]
            },
            "suggestions": ["Could not generate suggestions"]
        }

def get_ai_response(message, resume_data, conversation_history):
    """Get AI response for chat messages"""
    # Prepare conversation history
    history_text = "\n".join([f"{'AI' if msg['role'] == 'assistant' else 'User'}: {msg['content']}" for msg in conversation_history])
    
    # Convert resume data to string representation
    resume_text = f"""
    # {resume_data['personalInfo']['fullName']}
    Email: {resume_data['personalInfo']['email']}
    Phone: {resume_data['personalInfo']['phone']}
    Location: {resume_data['personalInfo']['location']}
    
    ## Summary
    {resume_data['summary']}
    
    ## Experience
    {' '.join([f"{job['title']} at {job['company']}, {job['startDate']} - {job['endDate']}: {' '.join(job['description'])}" for job in resume_data['workExperience']])}
    
    ## Education
    {' '.join([f"{edu['degree']} from {edu['institution']}, {edu['graduationDate']}" for edu in resume_data['education']])}
    
    ## Skills
    {', '.join(resume_data['skills'])}
    """
    
    prompt = f"""
    You are an AI resume assistant helping a user improve their resume. You provide professional, 
    helpful, and specific advice about resume writing, ATS optimization, and job applications.
    
    User's Resume:
    {resume_text}
    
    Previous conversation:
    {history_text}
    
    User's latest message: {message}
    
    Respond with helpful, specific advice related to their resume and question. 
    If they ask about optimizing for ATS, provide specific suggestions.
    If they ask about improving specific sections, give actionable advice.
    If they ask about job descriptions, explain how to tailor their resume.
    Always be professional, supportive, and provide evidence-based recommendations.
    """
    
    response = model.generate_content(prompt)
    return response.text

# Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    
    if not email or not password or not name:
        return jsonify({"error": "Missing required fields"}), 400
    
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email already registered"}), 409
    
    new_user = User(email=email, name=name)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    
    access_token = create_access_token(identity=new_user.id)
    
    return jsonify({
        "token": access_token,
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.name
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400
    
    user = User.query.filter_by(email=email).first()
    
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401
    
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        "token": access_token,
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name
        }
    }), 200

@app.route('/api/auth/google', methods=['POST'])
def google_auth():
    data = request.json
    google_id = data.get('googleId')
    email = data.get('email')
    name = data.get('name')
    
    if not google_id or not email:
        return jsonify({"error": "Missing required fields"}), 400
    
    user = User.query.filter_by(email=email).first()
    
    if not user:
        # Create new user
        user = User(email=email, name=name, google_id=google_id)
        db.session.add(user)
        db.session.commit()
    else:
        # Update existing user
        user.google_id = google_id
        user.name = name or user.name
        db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        "token": access_token,
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name
        }
    }), 200

@app.route('/api/user', methods=['GET'])
@jwt_required()
def get_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({
        "id": user.id,
        "email": user.email,
        "name": user.name
    }), 200

@app.route('/api/resumes', methods=['GET'])
@jwt_required()
def get_resumes():
    user_id = get_jwt_identity()
    resumes = Resume.query.filter_by(user_id=user_id).all()
    
    return jsonify([{
        "id": resume.id,
        "title": resume.title,
        "data": json.loads(resume.data),
        "created_at": resume.created_at.isoformat(),
        "updated_at": resume.updated_at.isoformat()
    } for resume in resumes]), 200

@app.route('/api/resumes', methods=['POST'])
@jwt_required()
def create_resume():
    user_id = get_jwt_identity()
    data = request.json
    
    title = data.get('title', 'Untitled Resume')
    resume_data = data.get('data')
    
    if not resume_data:
        return jsonify({"error": "Resume data is required"}), 400
    
    new_resume = Resume(
        id=str(uuid.uuid4()),
        user_id=user_id,
        title=title,
        data=json.dumps(resume_data)
    )
    
    db.session.add(new_resume)
    db.session.commit()
    
    return jsonify({
        "id": new_resume.id,
        "title": new_resume.title,
        "data": resume_data,
        "created_at": new_resume.created_at.isoformat(),
        "updated_at": new_resume.updated_at.isoformat()
    }), 201

@app.route('/api/resumes/<resume_id>', methods=['GET'])
@jwt_required()
def get_resume(resume_id):
    user_id = get_jwt_identity()
    resume = Resume.query.filter_by(id=resume_id, user_id=user_id).first()
    
    if not resume:
        return jsonify({"error": "Resume not found"}), 404
    
    return jsonify({
        "id": resume.id,
        "title": resume.title,
        "data": json.loads(resume.data),
        "created_at": resume.created_at.isoformat(),
        "updated_at": resume.updated_at.isoformat()
    }), 200

@app.route('/api/resumes/<resume_id>', methods=['PUT'])
@jwt_required()
def update_resume(resume_id):
    user_id = get_jwt_identity()
    resume = Resume.query.filter_by(id=resume_id, user_id=user_id).first()
    
    if not resume:
        return jsonify({"error": "Resume not found"}), 404
    
    data = request.json
    title = data.get('title')
    resume_data = data.get('data')
    
    if title:
        resume.title = title
    
    if resume_data:
        resume.data = json.dumps(resume_data)
    
    db.session.commit()
    
    return jsonify({
        "id": resume.id,
        "title": resume.title,
        "data": json.loads(resume.data),
        "created_at": resume.created_at.isoformat(),
        "updated_at": resume.updated_at.isoformat()
    }), 200

@app.route('/api/resumes/<resume_id>', methods=['DELETE'])
@jwt_required()
def delete_resume(resume_id):
    user_id = get_jwt_identity()
    resume = Resume.query.filter_by(id=resume_id, user_id=user_id).first()
    
    if not resume:
        return jsonify({"error": "Resume not found"}), 404
    
    db.session.delete(resume)
    db.session.commit()
    
    return jsonify({"message": "Resume deleted successfully"}), 200

@app.route('/api/resumes/<resume_id>/analyze', methods=['POST'])
@jwt_required()
def analyze_resume_endpoint(resume_id):
    user_id = get_jwt_identity()
    resume = Resume.query.filter_by(id=resume_id, user_id=user_id).first()
    
    if not resume:
        return jsonify({"error": "Resume not found"}), 404
    
    data = request.json
    job_description_id = data.get('job_description_id')
    
    resume_data = json.loads(resume.data)
    
    if job_description_id:
        job_description = JobDescription.query.filter_by(id=job_description_id, user_id=user_id).first()
        if not job_description:
            return jsonify({"error": "Job description not found"}), 404
        
        analysis = analyze_resume(resume_data, job_description.text)
    else:
        analysis = analyze_resume(resume_data)
    
    return jsonify(analysis), 200

@app.route('/api/job-descriptions', methods=['GET'])
@jwt_required()
def get_job_descriptions():
    user_id = get_jwt_identity()
    job_descriptions = JobDescription.query.filter_by(user_id=user_id).all()
    
    return jsonify([{
        "id": jd.id,
        "title": jd.title,
        "text": jd.text,
        "keywords": json.loads(jd.keywords) if jd.keywords else [],
        "created_at": jd.created_at.isoformat()
    } for jd in job_descriptions]), 200

@app.route('/api/job-descriptions', methods=['POST'])
@jwt_required()
def create_job_description():
    user_id = get_jwt_identity()
    data = request.json
    
    title = data.get('title', 'Untitled Job Description')
    text = data.get('text')
    
    if not text:
        return jsonify({"error": "Job description text is required"}), 400
    
    # Extract keywords
    keywords = extract_keywords(text)
    
    new_jd = JobDescription(
        id=str(uuid.uuid4()),
        user_id=user_id,
        title=title,
        text=text,
        keywords=json.dumps(keywords)
    )
    
    db.session.add(new_jd)
    db.session.commit()
    
    return jsonify({
        "id": new_jd.id,
        "title": new_jd.title,
        "text": new_jd.text,
        "keywords": keywords,
        "created_at": new_jd.created_at.isoformat()
    }), 201

@app.route('/api/job-descriptions/<jd_id>', methods=['GET'])
@jwt_required()
def get_job_description(jd_id):
    user_id = get_jwt_identity()
    jd = JobDescription.query.filter_by(id=jd_id, user_id=user_id).first()
    
    if not jd:
        return jsonify({"error": "Job description not found"}), 404
    
    return jsonify({
        "id": jd.id,
        "title": jd.title,
        "text": jd.text,
        "keywords": json.loads(jd.keywords) if jd.keywords else [],
        "created_at": jd.created_at.isoformat()
    }), 200

@app.route('/api/job-descriptions/<jd_id>', methods=['DELETE'])
@jwt_required()
def delete_job_description(jd_id):
    user_id = get_jwt_identity()
    jd = JobDescription.query.filter_by(id=jd_id, user_id=user_id).first()
    
    if not jd:
        return jsonify({"error": "Job description not found"}), 404
    
    db.session.delete(jd)
    db.session.commit()
    
    return jsonify({"message": "Job description deleted successfully"}), 200

@app.route('/api/chat', methods=['POST'])
@jwt_required()
def chat():
    user_id = get_jwt_identity()
    data = request.json
    
    message = data.get('message')
    resume_id = data.get('resume_id')
    conversation_history = data.get('conversation_history', [])
    
    if not message or not resume_id:
        return jsonify({"error": "Message and resume ID are required"}), 400
    
    resume = Resume.query.filter_by(id=resume_id, user_id=user_id).first()
    if not resume:
        return jsonify({"error": "Resume not found"}), 404
    
    resume_data = json.loads(resume.data)
    
    ai_response = get_ai_response(message, resume_data, conversation_history)
    
    return jsonify({
        "response": ai_response
    }), 200

if __name__ == '__main__':
    app.run(debug=True)


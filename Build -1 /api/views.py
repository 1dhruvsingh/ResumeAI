from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from .models import Resume
from .serializers import ResumeSerializer
from .tasks import process_resume

class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    parser_classes = (MultiPartParser,)

    def create(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided'}, status=400)
            
        # Validate file type and size
        allowed_types = ['.pdf', '.docx', '.txt', '.rtf']
        if not any(file_obj.name.lower().endswith(ext) for ext in allowed_types):
            return Response({'error': 'Unsupported file type'}, status=400)
            
        if file_obj.size > 5 * 1024 * 1024:  # 5MB limit
            return Response({'error': 'File too large'}, status=400)

        resume = Resume.objects.create(original_file=file_obj)
        process_resume.delay(resume.id)  # Queue processing task
        
        serializer = self.get_serializer(resume)
        return Response(serializer.data, status=201) 
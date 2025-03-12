from rest_framework import serializers
from .models import Resume

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = [
            'id', 
            'original_file', 
            'processed_file', 
            'parsed_content',
            'status', 
            'error_message',
            'created_at'
        ] 
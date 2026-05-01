from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import (CustomUser,Internship_Placement,Weekly_Log,Supervisor_Feedback,Academic_Supervisor_Feedback,Weighted_Score,Issue,Student_log)

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'first_name', 'last_name', 'email', 'role' ,'department', 'is_active', 'is_staff', 'student_number', 'staff_number'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }


class Internship_PlacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Internship_Placement
        fields = "__all__"

    def validate(self, data):
        instance = self.instance
        student = data.get('student', getattr(instance, 'student', None))
        start_date = data.get('start_date', getattr(instance, 'start_date', None))
        end_date = data.get('end_date', getattr(instance, 'end_date', None))
        if student and start_date and end_date:
            if end_date <= start_date:
                raise serializers.ValidationError("End date must be after start date.")
            overlapping = Internship_Placement.objects.filter(
                student=student,
                start_date__lt=end_date,
                end_date__gt=start_date,
            )
            if instance:
                overlapping = overlapping.exclude(pk=instance.pk)
            if overlapping.exists():
                raise serializers.ValidationError(
                    "This student already has an overlapping internship placement during that period."
                )
        return data

class Weekly_LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Weekly_Log
        exclude = ['created_at']

class Supervisor_FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supervisor_Feedback
        fields = "__all__"

class Academic_Supervisor_FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Academic_Supervisor_Feedback
        fields = "__all__"

class Weighted_ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Weighted_Score
        fields = "__all__"

class IssueSerializer(serializers.ModelSerializer):
    reported_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Issue
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'role', 'department', 'staff_number', 'student_number']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.password = make_password(password)
        user.save()
        return user
    
class Student_logSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student_log
        fields = '__all__'
        read_only_fields = ['student', 'created_at']

    def validate_hours(self, value):
        if value <= 0:
            raise serializers.ValidationError("Must be greater that 0")
        return value    

from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    actor_name = serializers.CharField(source='actor.username', read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'actor_name', 'verb', 'created_at', 'is_read', 'target_id', 'target_type']
        

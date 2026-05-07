from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import (CustomUser,Internship_Placement,Weekly_Log,Supervisor_Feedback,Academic_Supervisor_Feedback,Weighted_Score,Issue,Student_log)
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError


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
    student_name = serializers.CharField(source='student.username', read_only=True)

    class Meta:
        model = Internship_Placement
        fields = "__all__"

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
        extra_kwargs = {
            'password': {'write_only': True},
        }
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        try:
            validate_password(password, user)
        except DjangoValidationError as e:
            raise serializers.ValidationError({'password': list(e.messages)})
        user.set_password(password)
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
        

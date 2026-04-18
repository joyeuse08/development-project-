from rest_framework import serializers
from django.contrib.auth.hashers import make_password
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

class Weekly_LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Weekly_Log
        exclude = ['submitted_at', 'created_at']  

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
    class Meta:
        model = Issue
        exclude = ['created_at']

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
        fields = '_all_'  

    def validate_hours_spent(self,value):
        if value <= 0:
            raise serializers.ValidationError("Must be greater that 0")
        return value    
        

from rest_framework import serializers
from .models import (
    CustomUser, Internship_Placement, Weekly_Log,
    Supervisor_Feedback, Academic_Supervisor_Feedback,
    Weighted_Score, Issue,
)


class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'first_name', 'last_name', 'email',
            'role', 'department', 'is_active', 'is_staff',
            'student_number', 'staff_number', 'password',
        ]

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = CustomUser(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class Internship_PlacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Internship_Placement
        fields = '__all__'


class Weekly_LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Weekly_Log
        fields = '__all__'
        read_only_fields = ['created_at']


class Supervisor_FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supervisor_Feedback
        fields = '__all__'
        read_only_fields = ['evaluated_at']


class Academic_Supervisor_FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Academic_Supervisor_Feedback
        fields = '__all__'
        read_only_fields = ['evaluated_at']


class Weighted_ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Weighted_Score
        fields = '__all__'
        read_only_fields = ['calculated_at']


class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = '__all__'
        read_only_fields = ['created_at']

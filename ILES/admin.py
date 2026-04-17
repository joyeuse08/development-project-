from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (CustomUser,Internship_Placement,Weekly_Log,Supervisor_Feedback,Academic_Supervisor_Feedback,Weighted_Score,Issue)

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'is_active']
    search_fields = ['username', 'email']
    list_filter = ['role', 'is_active']

@admin.register(Internship_Placement)
class Internship_PlacementAdmin(admin.ModelAdmin):
    list_display = ['student', 'company_name', 'start_date', 'end_date']
    search_fields = ['student__username', 'company_name']
    list_filter = ['start_date']

@admin.register(Weekly_Log)
class Weekly_LogAdmin(admin.ModelAdmin):
    list_display = ['student','date_submitted']
    search_fields = ['student__username']
    list_filter = ['week_number']

@admin.register(Supervisor_Feedback)
class Supervisor_FeedbackAdmin(admin.ModelAdmin):
    list_display = ['supervisor', 'student', 'date_given']
    search_fields = ['supervisor__username', 'student__username']

@admin.register(Academic_Supervisor_Feedback)
class Academic_Supervisor_FeedbackAdmin(admin.ModelAdmin):
    list_display = ['academic_supervisor', 'student', 'date_given']
    search_fields = ['academic_supervisor__username', 'student__username']

@admin.register(Weighted_Score)
class Weighted_ScoreAdmin(admin.ModelAdmin):
    list_display = ['student', 'total_score']
    search_fields = ['user__username', 'action']
    list_filter = ['timestamp']
     
@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['title']

# Register your models here.

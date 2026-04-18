from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (CustomUser,Internship_Placement,Weekly_Log,Supervisor_Feedback,Academic_Supervisor_Feedback,Weighted_Score,Issue)

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'department',]
    search_fields = ['username', 'email']
    list_filter = ['role']

@admin.register(Internship_Placement)
class Internship_PlacementAdmin(admin.ModelAdmin):
    list_display = ['student','company_name','start_date','end_date',]
    search_fields = ['student__username']
    list_filter = ['start_date', 'end_date']

@admin.register(Weekly_Log)
class Weekly_LogAdmin(admin.ModelAdmin):
    list_display = ['placement', 'week_number', 'status', 'submitted_at']
    search_fields = ['placement__student__username']
    list_filter = ['week_number', 'status']

@admin.register(Supervisor_Feedback)
class Supervisor_FeedbackAdmin(admin.ModelAdmin):
    list_display = ['supervisor', 'weekly_log', 'evaluated_at']
    search_fields = ['supervisor__username', 'weekly_log__placement__student__username']
    list_filter = ['evaluated_at']

@admin.register(Academic_Supervisor_Feedback)
class Academic_Supervisor_FeedbackAdmin(admin.ModelAdmin):
    list_display = ['academic_supervisor', 'placement', 'evaluated_at']
    search_fields = ['academic_supervisor__username', 'placement__student__username']
    list_filter = ['evaluated_at']

@admin.register(Weighted_Score)
class Weighted_ScoreAdmin(admin.ModelAdmin):
    list_display = ['placement', 'final_score', 'calculated_at']
    search_fields = ['placement__student__username']
    list_filter = ['calculated_at']
     
@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['title']

# Register your models here.

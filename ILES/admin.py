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
    list_display = ['placement', 'week_number', 'submitted_at']
    search_fields = ['student__username']
    list_filter = ['week_number']

@admin.register(Supervisor_Feedback)
class Supervisor_FeedbackAdmin(admin.ModelAdmin):
    list_display = ['supervisor','evaluated_at']
    search_fields = ['supervisor__username', 'student__username']

@admin.register(Academic_Supervisor_Feedback)
class Academic_Supervisor_FeedbackAdmin(admin.ModelAdmin):
    list_display = ['academic_supervisor', 'placement', 'evaluated_at']
    search_fields = ['academic_supervisor__username', 'student__username']

@admin.register(Weighted_Score)
class Weighted_ScoreAdmin(admin.ModelAdmin):
    list_display = ['placement', 'final_score']
    search_fields = ['placement__student__username']
    list_filter = ['calculated_at']



# Register your models here.

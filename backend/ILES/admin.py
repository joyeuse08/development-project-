from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    CustomUser, Internship_Placement, Weekly_Log,
    Supervisor_Feedback, Academic_Supervisor_Feedback,
    Weighted_Score, Issue,
)


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('ILES Info', {'fields': ('role', 'department', 'student_number', 'staff_number')}),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_active')


@admin.register(Internship_Placement)
class InternshipPlacementAdmin(admin.ModelAdmin):
    list_display = ('student', 'company_name', 'start_date', 'end_date', 'status')
    list_filter = ('status',)


@admin.register(Weekly_Log)
class WeeklyLogAdmin(admin.ModelAdmin):
    list_display = ('placement', 'week_number', 'status', 'submitted_at')
    list_filter = ('status',)


@admin.register(Supervisor_Feedback)
class SupervisorFeedbackAdmin(admin.ModelAdmin):
    list_display = ('weekly_log', 'supervisor', 'supervisor_score', 'evaluated_at')


@admin.register(Academic_Supervisor_Feedback)
class AcademicSupervisorFeedbackAdmin(admin.ModelAdmin):
    list_display = ('placement', 'academic_supervisor', 'academic_score', 'evaluated_at')


@admin.register(Weighted_Score)
class WeightedScoreAdmin(admin.ModelAdmin):
    list_display = ('placement', 'supervisor_score', 'academic_score', 'final_score', 'calculated_at')


@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    list_display = ('title', 'placement', 'created_by', 'status', 'created_at')
    list_filter = ('status',)

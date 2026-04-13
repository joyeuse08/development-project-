from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser,Internship_Placement,Weekly_Log,Supervisor_Feedback,Academic_Supervisor_Feedback,Weighted_Score,Issues

class CustomUserAdmin(UserAdmin):
  model = CustomUser
  list_display = ('username','role','department','staff_number','student_number')
  fieldsets = UserAdmin.fieldets + (
    ('Extra Info', {'fields':('role',)}),
  )



# Register your models here.

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.contenttypes.models import contentType
from django.contrib.contenttypes.fields import GenericForeignKey 
from django. conf import settings
    
#CustomUser
class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ("student","Student"),
        ("workplace","Workplace Supervisor"),
        ("academic","Academic Supervisor"),
        ("admin","Internship Administrator"),
    ]
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default = "student")
    department = models.CharField(max_length=100,)
    staff_number = models.CharField(max_length=20, blank=True, null=True)
    student_number = models.CharField(max_length=20, blank=True, null=True)

    def _str_(self):
        return f"{self.username} ({self.get_role_display()})"
    
# Internship Placement
class Internship_Placement(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("active", "Active"),
        ("completed", "Completed"),
    ]
    student = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='student_placements',limit_choices_to={'role': 'student'}
    )
    company_name = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    workplace_supervisor = models.ForeignKey(CustomUser,max_length=255,on_delete=models.SET_NULL,
        null=True, blank=True, related_name="workplace_supervised",limit_choices_to={'role': 'workplace_supervisor'},
    )    
    academic_supervisor = models.ForeignKey(CustomUser, max_length=255, on_delete=models.SET_NULL,
        null= True, blank=True, related_name="academic_supervised",limit_choices_to={'role': 'academic_supervisor'},
    )                                     
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    def _str_(self):
        return f"Placement for {self.student.username} at {self.company_name}"

# Weekly Log
class Weekly_Log(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("submitted", "Submitted"),
        ("reviewed", "Reviewed"),
    ]
    placement = models.ForeignKey(Internship_Placement, on_delete=models.CASCADE, related_name='weekly_logs')
    week_number = models.PositiveIntegerField()
    activities = models.TextField()
    challenges = models.TextField(blank = True)
    learnings = models.TextField(blank = True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    submitted_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"Week{self.week_number} for {self.placement.student.username}"      

# Supervisor Feedback
class Supervisor_Feedback(models.Model):
    weekly_log = models.OneToOneField(Weekly_Log, on_delete=models.CASCADE, related_name='feedbacks')
    supervisor = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
         related_name='feedback_given',limit_choices_to={'role': ['workplace_supervisor']})
    comments = models.TextField()
    supervisor_score = models.PositiveIntegerField()
    evaluated_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"Feedback by {self.supervisor.username} for {self.weekly_log}"    
    
#Academic Supervisor Feedback
class Academic_Supervisor_Feedback(models.Model):
    placement = models.ForeignKey(Internship_Placement, on_delete=models.CASCADE, related_name='academic_feedbacks')
    academic_supervisor = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
        related_name='academic_feedback_given',limit_choices_to={'role': ['academic_supervisor']})
    comments = models.TextField()
    academic_score = models.PositiveIntegerField()
    evaluated_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"Feedback by {self.academic_supervisor.username} for {self.placement.student.username}"    
    
# Weighted score
class Weighted_Score(models.Model):
    placement = models.OneToOneField(Internship_Placement, on_delete=models.CASCADE, related_name='weighted_scores')
    supervisor_score = models.FloatField()
    academic_score = models.FloatField()
    final_score = models.FloatField()
    calculated_at = models.DateTimeField(auto_now_add=True)

    def compute(self):
        self.final_score = (self.supervisor_score * 0.6) + (self.academic_score * 0.4)
        self.save()

    def _str_(self):
        return f"Weighted Score for {self.placement.student.username}: {self.final_score}"    
    
# Issues
class Issue(models.Model):
    STATUS_CHOICES = [
        ("open", "Open"),
        ("in_progress", "In Progress"),
        ("resolved", "Resolved"),
    ]
    title = models.CharField(max_length=255)
    placement = models.ForeignKey(Internship_Placement, on_delete=models.CASCADE, related_name='issues')
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reported_issues')
    issue_type = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="open")
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"Issue for {self.placement.student.username} reported by {self.created_by.username}"


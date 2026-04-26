from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from .models import Weekly_Log, Student_log, Internship_Placement

def send_notification_email(subject, message, recipient_list):
    send_mail(
        subject,
        message,
        'your-email@gmail.com',
        recipient_list)
    
@receiver(post_save, sender=Weekly_Log)
def notify_on_weekly_log(sender, instance, created, **kwargs):
    if not created:
        placement = instance.placement
        subject = f"Weekly Log Updated for {placement.student.username}"
        message = (
            f"{placement.student.username} your weekly log for week {instance.week_number} has been updated. "
            f"Current status: {instance.get_status_display()}."
        )
        recipient = [placement.student.email]
        send_notification_email(subject, message, recipient)

@receiver(post_save, sender=Student_log)
def notify_on_student_log(sender, instance, created, **kwargs):
    if not created:
        # instance.student is a FK to Internship_Placement (despite the name)
        internship = instance.student
        subject = f"Student Log Updated for {internship.student.username}"
        message = (
            f"{internship.student.username} your student log has been updated. "
            f"Current status: {instance.get_status_display()}."
        )
        recipient = [internship.student.email]
        send_notification_email(subject, message, recipient)   

@receiver(post_save, sender=Internship_Placement)        
def notify_on_placement_update (sender, instance, created, **kwargs):
    if not created:
        subject = f"Internship Placement Update for {instance.student.username}"
        message = (
            f"{instance.student.username} your internship placement at {instance.company_name} has been updated. Current status: {instance.get_status_display()}."
        )
        recipient = [instance.student.email]
        send_notification_email(subject, message, recipient)

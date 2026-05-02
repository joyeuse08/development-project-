from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from .models import Weekly_Log, Student_log, Internship_Placement, Notification

def send_notification_email(subject, message, recipient_list):
    try:
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            recipient_list)
    except Exception:
        pass # or log the error: import logging; logging.exception("Email failed")

@receiver(post_save, sender=Weekly_Log)
def notify_on_weekly_log(sender, instance, created, **kwargs):
    if not created:
        # instance.student is a FK to Internship_Placement (despite the name)
        internship = instance.placement
        subject = f"Weekly Log updated for {internship.student.username}"
        message = (
            f"{internship.student.username} your weekly log for week {instance.week_number} has been updated. "
            f"Current status: {instance.get_status_display()}."
        )
        recipient = [internship.student.email]
        send_notification_email(subject, message, recipient)
        
        actor = instance.supervisor or internship.workplace_supervisor
        if actor:
            Notification.objects.create(
                recipient=internship.student,
                actor=actor,
                verb=f"updated your weekly log for week {instance.week_number} — Status: {instance.get_status_display()}",
                target_id=instance.id,
                target_type='weekly_log',
            )

@receiver(post_save, sender=Student_log)
def notify_on_student_log(sender, instance, created, **kwargs):
    if not created:
        # NOTE: Student_log.student is a FK to Internship_Placement, not CustomUser
        # This is confusing but correct — placement.student gives the actual user
        placement = instance.student
        subject = f"Student Log Updated for {placement.student.username}"
        message = (
            f"{placement.student.username} your student log has been updated. "
        )
        recipient = [placement.student.email]
        send_notification_email(subject, message, recipient) 
        
        actor = instance.supervisor or placement.workplace_supervisor
    if actor:
        Notification.objects.create(
            recipient=placement.student,
            actor=actor,
            verb=f"updated your student log for {instance.date} — Status: {instance.get_status_display()}",
            target_id=instance.id,
            target_type='student_log',
        )
        

@receiver(post_save, sender=Internship_Placement)        
def notify_on_placement_update (sender, instance, created, **kwargs):
    if not created:
        subject = f"Internship Placement Update for {instance.student.username}"
        message = (
            f"{instance.student.username} your internship placement at {instance.company_name} has been updated. Current status: {instance.get_status_display()}."
        )
        recipient = [instance.student.email]
        send_notification_email(subject, message, recipient)
        actor = instance.workplace_supervisor or instance.academic_supervisor
    if actor:
        Notification.objects.create(
            recipient=instance.student,
            actor=actor,
            verb=f"updated your internship placement at {instance.company_name} — Status: {instance.get_status_display()}",
            target_id=instance.id,
            target_type='placement',
        )

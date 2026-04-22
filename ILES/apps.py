from django.apps import AppConfig


class ILESConfig(AppConfig):

    default_auto_field = 'django.db.models.BigAutoField' 
    name = 'ILES'
    
    def ready(self):
        import ILES.signals  # Import signals to ensure they are registered
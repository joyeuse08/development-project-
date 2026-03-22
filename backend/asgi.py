"""
<<<<<<< HEAD
ASGI config for ILES project.
=======
ASGI config for backend project.
>>>>>>> b56bb247aa50598bcfeceeb1d964a13359ed384d

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

<<<<<<< HEAD
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ILES.settings')
=======
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
>>>>>>> b56bb247aa50598bcfeceeb1d964a13359ed384d

application = get_asgi_application()

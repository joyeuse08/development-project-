"""
WSGI config for ILES project.
=======
WSGI config for backend project.
>>>>>>> b56bb247aa50598bcfeceeb1d964a13359ed384d

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = get_wsgi_application()

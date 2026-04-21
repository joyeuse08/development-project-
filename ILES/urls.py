from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.CustomUserViewSet, basename='users')
router.register(r'Internship_Placement', views.Internship_PlacementViewSet, basename= 'internship placement')
router.register(r'Weekly_Log', views.Weekly_LogViewSet, basename= 'weeklylog')
router.register(r'Student_log', views.Student_logViewSet, basename= 'studentlog')
router.register(r'Supervisor_Feedback', views.Supervisor_FeedbackViewSet, basename= 'supervisorfeedback')
router.register(r'Academic_Supervisor_Feedback', views.Academic_Supervisor_FeedbackViewSet, basename= 'academicsupervisor')
router.register(r'Weighted_Score', views.Weighted_ScoreViewSet, basename= 'weightedscore')
router.register(r'issues', views.IssueViewSet, basename= 'issue')  


urlpatterns = [
    path('register/', views.register, name="register"),
    path('login/', views.login, name="login"),
    path('logout/', views.logout, name="logout"),
    path('me/',views.me, name="me"),
    path('', include(router.urls)), 
]
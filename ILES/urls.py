from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.CustomUserViewSet, basename='users')
router.register(r'Internship_Placement', views.Internship_PlacementViewSet, basename='internship_placement')
router.register(r'Weekly_Log', views.Weekly_LogViewSet, basename='weekly_log')
router.register(r'Supervisor_Feedback', views.Supervisor_FeedbackViewSet, basename='supervisor_feedback')
router.register(r'Academic_Supervisor_Feedback', views.Academic_Supervisor_FeedbackViewSet, basename='academic_supervisor')
router.register(r'Weighted_Score', views.Weighted_ScoreViewSet, basename='weighted_score')
router.register(r'issues', views.IssueViewSet, basename='issue')  


urlpatterns = [
    path('register/', views.register, name="register"),
    path('login/', views.login, name="login"),
    path('logout/', views.logout, name="logout"),
    path('me/',views.me, name="me"),
    path('', include(router.urls)), 
]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.CustomUserViewSet)
router.register(r'Internship_Placement', views.Internship_PlacementViewSet)
router.register(r'Weekly_Log', views.Weekly_LogViewSet)
router.register(r'Supervisor_Feedback', views.Supervisor_FeedbackViewSet)
router.register(r'Academic_Supervisor_Feedback', views.Academic_Supervisor_FeedbackViewSet)
router.register(r'Weighted_Score', views.Weighted_ScoreViewSet)
router.register(r'issues', views.IssueViewSet)  


urlpatterns = [
    path('', include(router.urls)),
]
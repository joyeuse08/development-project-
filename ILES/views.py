from django.shortcuts import render
from rest_framework import viewsets
from .models import CustomUser, Internship_Placement, Weekly_Log, Supervisor_Feedback, Academic_Supervisor_Feedback, Weighted_Score, Issue
from .serializers import (CustomUserSerializer, Internship_PlacementSerializer, Weekly_LogSerializer, Supervisor_FeedbackSerializer, Academic_Supervisor_FeedbackSerializer, Weighted_ScoreSerializer, IssueSerializer)

# Create your views here.
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

class Internship_PlacementViewSet(viewsets.ModelViewSet):
    queryset = Internship_Placement.objects.all()
    serializer_class = Internship_PlacementSerializer

class Weekly_LogViewSet(viewsets.ModelViewSet): 
    queryset = Weekly_Log.objects.all()
    serializer_class = Weekly_LogSerializer 

class Supervisor_FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Supervisor_Feedback.objects.all()
    serializer_class = Supervisor_FeedbackSerializer    

class Academic_Supervisor_FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Academic_Supervisor_Feedback.objects.all()
    serializer_class = Academic_Supervisor_FeedbackSerializer

class Weighted_ScoreViewSet(viewsets.ModelViewSet): 
    queryset = Weighted_Score.objects.all()
    serializer_class = Weighted_ScoreSerializer   

class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer            

from django.shortcuts import render, redirect, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes,action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import Group
from django.db.models import Q
from .models import CustomUser, Internship_Placement, Weekly_Log, Supervisor_Feedback, Academic_Supervisor_Feedback, Weighted_Score, Issue, Student_log, Notification
from .serializers import (CustomUserSerializer, Internship_PlacementSerializer, Weekly_LogSerializer, Supervisor_FeedbackSerializer, Academic_Supervisor_FeedbackSerializer, Weighted_ScoreSerializer, IssueSerializer,Student_logSerializer, RegisterSerializer)


# Create your views here.
# Custom User views
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

# Internship placement views
class Internship_PlacementViewSet(viewsets.ModelViewSet):
    queryset = Internship_Placement.objects.all()
    serializer_class = Internship_PlacementSerializer
    
# Weekly log views
class Weekly_LogViewSet(viewsets.ModelViewSet): 
    queryset= Weekly_log.objects.all()
    serializer_class = Weekly_LogSerializer 
    def get_queryset(self):
        user = self.request.user
        queryset = Weekly_Log.objects.all()

        if user.role in ('workplace', 'academic'):
    queryset = queryset.filter(supervisor=user)

        log_status = self.request.query_params.get('status')
        if log_status:
            queryset = queryset.filter(status=status)
        return queryset 

    @action(detail=True, methods=['post'])
    def review(self, request, pk=None):
        weekly_log = self.get_object()
        weekly_log.status = request.data.get('status', weekly_log.status)
        
        weekly_log.save()
        return Response({'message': 'Weekly Log updated', 'status': weekly_log.status})
    
class Student_logViewSet(viewsets.ModelViewSet):
    queryset = Student_log.objects.all()
    serializer_class = Student_logSerializer
    def get_queryset(self):
        user = self.request.user
        queryset = Student_log.objects.all()

        if user.role in ('workplace', 'academic'):
    queryset = queryset.filter(supervisor=user)

        log_status = self.request.query_params.get('status')
        if log_status:
            queryset = queryset.filter(status=status)
        return queryset
    
    @action(detail=True, methods=['post'])
    def review(self, request, pk=None):
        student_log = self.get_object()
        student_log.status = request.data.get('status', student_log.status)
        
        student_log.save()
        return Response({'message': 'Student Log updated', 'status': student_log.status})

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

# Registration view
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        # assign user to group based on role
        role = request.data.get("role", "student")
        group_name = {
            "student": "Student",
            "workplace": "Workplace Supervisor",
            "academic": "Academic Supervisor",
            "admin": "Internship Administrator"
        }.get(role, "Student")

        group, _ = Group.objects.get_or_create(name=group_name)
        user.groups.add(group)

        

        # create a token for the user
        token, _ = Token.objects.get_or_create(user=user)
    
        return Response({
            "message": "Registration successful",
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


 # login view
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    
    # check if username and password are provided
    if not username or not password:
        return Response({
            "error": "Username and password are required"
        }, status=status.HTTP_400_BAD_REQUEST)
    # authenticate the user
    user = authenticate(username=username, password=password)
    if user: #getting token from user
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "message": "Login successful",
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
            }
        }, status=status.HTTP_200_OK)
    
    # if authentification fails
    return Response({
        "error": "Invalid credentials"
    }, status=status.HTTP_401_UNAUTHORIZED)

# logout view
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    #delete the users token so they can nolonger access the api
    request.user.auth_token.delete()
    return Response(
        {"message": "Logged out succesfully"},
        status=status.HTTP_200_OK)

# Me view
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    #return the user details
    return Response({
        "id": request.user.id,
        "username": request.user.username,
        "email": request.user.email,
        "role": request.user.role,
        "department": request.user.department,
        "student_number": request.user.student_number,
        "staff_number": request.user.staff_number,
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_items(request):
    query = request.query_params.get('q', '')
    placements = Internship_Placement.objects.filter(company_name__icontains=query)
    logs = Weekly_Log.objects.filter(activities__icontains=query)
    feedbacks = Supervisor_Feedback.objects.filter(comments__icontains=query)
    academic_feedbacks = Academic_Supervisor_Feedback.objects.filter(comments__icontains=query)
    issues = Issue.objects.filter(issue_type__icontains=query)
    placement_serializer = Internship_PlacementSerializer(placements, many=True)
    log_serializer = Weekly_LogSerializer(logs, many=True)
    feedback_serializer = Supervisor_FeedbackSerializer(feedbacks, many=True)
    academic_serializer = Academic_Supervisor_FeedbackSerializer(academic_feedbacks, many=True)
    issue_serializer = IssueSerializer(issues, many=True)

    return Response({
        "placements": placement_serializer.data,
        "logs": log_serializer.data,
        "feedbacks": feedback_serializer.data,
        "academic_feedbacks": academic_serializer.data,
        "issues": issue_serializer.data,
    }, status=status.HTTP_200_OK)


from .serializers import NotificationSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    notifications = request.user.received_notifications.all()[:50]
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, id):
    notification = get_object_or_404(Notification, id=id, recipient=request.user)
    notification.is_read = True
    notification.save()
    return Response({'status': 'read'})

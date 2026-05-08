from django.shortcuts import render, redirect, get_object_or_404
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes,action,authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import Group
from django.db.models import Q
from .models import CustomUser, Internship_Placement, Weekly_Log, Supervisor_Feedback, Academic_Supervisor_Feedback, Weighted_Score, Issue, Student_log, Notification
from .serializers import (CustomUserSerializer, Internship_PlacementSerializer, Weekly_LogSerializer, Supervisor_FeedbackSerializer, Academic_Supervisor_FeedbackSerializer, Weighted_ScoreSerializer, IssueSerializer,Student_logSerializer, RegisterSerializer)


class IsSupervisorOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ('workplace', 'academic', 'admin')

class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

# Create your views here.
# Custom User views
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    
    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdminRole()]
        return [IsAuthenticated()]

# Internship placement views
class Internship_PlacementViewSet(viewsets.ModelViewSet):
   
    serializer_class = Internship_PlacementSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return Internship_Placement.objects.filter(student=user)
        if user.role == 'workplace':
            return Internship_Placement.objects.filter(workplace_supervisor=user)
        if user.role == 'academic':
            return Internship_Placement.objects.filter(academic_supervisor=user)
        return Internship_Placement.objects.all()
    
# Weekly log views
class Weekly_LogViewSet(viewsets.ModelViewSet):
    serializer_class = Weekly_LogSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Weekly_Log.objects.all()
        if user.role == 'student':
            queryset = Weekly_Log.objects.filter(placement__student=user)
        elif user.role == 'workplace':
            queryset = Weekly_Log.objects.filter(placement__workplace_supervisor=user)
        elif user.role == 'academic':
            queryset = Weekly_Log.objects.filter(placement__academic_supervisor=user)
        log_status = self.request.query_params.get('status')
        if log_status:
            queryset = queryset.filter(status=log_status)
        return queryset

    def get_permissions(self):
        if self.action == 'review':
            return [IsSupervisorOrAdmin()]
        return [IsAuthenticated()]

    @action(detail=True, methods=['post'])
    def review(self, request, pk=None):
        weekly_log = self.get_object()
        user = request.user
        if user.role == 'workplace' and weekly_log.placement.workplace_supervisor != user:
            return Response({'error': 'You are not assigned to this student.'}, status=status.HTTP_403_FORBIDDEN)
        if user.role == 'academic' and weekly_log.placement.academic_supervisor != user:
            return Response({'error': 'You are not assigned to this student.'}, status=status.HTTP_403_FORBIDDEN)
        weekly_log.status = request.data.get('status', weekly_log.status)
        weekly_log.save()
        Notification.objects.create(
            recipient=weekly_log.placement.student,
            actor=request.user,
            verb=f"reviewed your weekly log for week {weekly_log.week_number} — Status: {weekly_log.get_status_display()}",
            target_id=weekly_log.id,
            target_type='weekly_log',
        )
        return Response({'message': 'Weekly Log updated', 'status': weekly_log.status})

    def perform_update(self, serializer):
        if serializer.instance.status == 'approved':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Cannot edit a log that has been approved.")
        serializer.save()

    
class Student_logViewSet(viewsets.ModelViewSet):
    queryset = Student_log.objects.all()
    serializer_class = Student_logSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Student_log.objects.all()
        if user.role == 'student':
            queryset = queryset.filter(student__student=user)
        elif user.role in ('workplace', 'academic'):
            queryset = queryset.filter(supervisor=user)
        log_status = self.request.query_params.get('status')
        if log_status:
            queryset = queryset.filter(status=log_status)
        return queryset
    
    @action(detail=True, methods=['post'])
    def review(self, request, pk=None):
        if request.user.role not in ('workplace', 'admin'):
            return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        student_log = self.get_object()
        student_log.status = request.data.get('status', student_log.status)
        student_log.save()
        return Response({'message': 'Student Log updated', 'status': student_log.status})

class Supervisor_FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = Supervisor_FeedbackSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return Supervisor_Feedback.objects.filter(placement__student=user)
        if user.role == 'workplace':
            return Supervisor_Feedback.objects.filter(supervisor=user)
        if user.role == 'academic':
            return Supervisor_Feedback.objects.filter(placement__academic_supervisor=user)
        return Supervisor_Feedback.objects.all()

class Academic_Supervisor_FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = Academic_Supervisor_FeedbackSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return Academic_Supervisor_Feedback.objects.filter(placement__student=user)
        if user.role == 'academic':
            return Academic_Supervisor_Feedback.objects.filter(academic_supervisor=user)
        return Academic_Supervisor_Feedback.objects.all()

class Weighted_ScoreViewSet(viewsets.ModelViewSet):
    serializer_class = Weighted_ScoreSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return Weighted_Score.objects.filter(placement__student=user)
        return Weighted_Score.objects.all()

class IssueViewSet(viewsets.ModelViewSet):
    serializer_class = IssueSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return Issue.objects.filter(placement__student=user)
        if user.role == 'workplace':
            return Issue.objects.filter(placement__workplace_supervisor=user)
        if user.role == 'academic':
            return Issue.objects.filter(placement__academic_supervisor=user)
        return Issue.objects.all()     

# Registration view
@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        # assign user to group based on role
        role = user.role
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
@authentication_classes([])
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
    
    # if authentication fails
    return Response({
        "error": "Invalid credentials"
    }, status=status.HTTP_401_UNAUTHORIZED)

# logout view
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        request.user.auth_token.delete()
    except Token.DoesNotExist:
        pass
    return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

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
    user = request.user

    placements = Internship_Placement.objects.filter(
        Q(company_name__icontains=query) | Q(student__username__icontains=query)
    )
    logs = Weekly_Log.objects.filter(
        Q(activities__icontains=query) | Q(challenges__icontains=query)
    )
    feedbacks = Supervisor_Feedback.objects.filter(comments__icontains=query)
    academic_feedbacks = Academic_Supervisor_Feedback.objects.filter(comments__icontains=query)
    issues = Issue.objects.filter(
        Q(title__icontains=query) | Q(issue_type__icontains=query)
    )

    # Filter by role
    if user.role == 'student':
        placements = placements.filter(student=user)
        logs = logs.filter(placement__student=user)
        issues = issues.filter(placement__student=user)
    elif user.role == 'workplace':
        placements = placements.filter(workplace_supervisor=user)
        feedbacks = feedbacks.filter(supervisor=user)
    elif user.role == 'academic':
        placements = placements.filter(academic_supervisor=user)
        academic_feedbacks = academic_feedbacks.filter(academic_supervisor=user)

    return Response({
        "placements": Internship_PlacementSerializer(placements, many=True).data,
        "logs": Weekly_LogSerializer(logs, many=True).data,
        "feedbacks": Supervisor_FeedbackSerializer(feedbacks, many=True).data,
        "academic_feedbacks": Academic_Supervisor_FeedbackSerializer(academic_feedbacks, many=True).data,
        "issues": IssueSerializer(issues, many=True).data,
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

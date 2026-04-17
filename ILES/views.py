from django.shortcuts import render, redirect
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import Group
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

# Registration view
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = CustomUserSerializer(data=request.data)
    if serializer.is_valid():
         user = serializer.save()

         #setting the passsword properly
         user.set_password(request.data["password"])
         user.save()

         #assigning user to group based on role
         role = request.data.get("role", "student")
         group_name = {
             "student": "Student",
             "workplace_supervisor": "Workplace Supervisor",
             "academic_supervisor": "Academic Supervisor",
             "admin": "Internship Administrator"
         }.get(role, "Student")

         group, created = Group.objects.get_or_create(name=group_name)
         user.groups.add(group)

         #create a token for the user
         token, _ = Token.objects.get_or_create(user=user)
    
    return Response({
        "message": "Registration succcesful",
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
    
    #check if username and password are provided
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

#logout view
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    #delete the users token so they can nolonger access the api
    request.user.auth_token.delete()
    return Response(
        {"message": "Logged out succesfully"},
        status=status.HTTP_200_ok)

#Me view
@api_view(["POST"])
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

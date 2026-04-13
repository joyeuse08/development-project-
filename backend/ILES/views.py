from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import (
    CustomUser, Internship_Placement, Weekly_Log,
    Supervisor_Feedback, Academic_Supervisor_Feedback,
    Weighted_Score, Issue,
)
from .serializers import (
    CustomUserSerializer, Internship_PlacementSerializer,
    Weekly_LogSerializer, Supervisor_FeedbackSerializer,
    Academic_Supervisor_FeedbackSerializer, Weighted_ScoreSerializer,
    IssueSerializer,
)


class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


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

from django.shortcuts import render
from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Application
from .serializers import ApplicationSerializer

# Create your views here.

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.role == 'admin'

class ApplicationListCreateView(generics.ListCreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Application.objects.all()
        return Application.objects.filter(user=user)

class ApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Application.objects.all()
        return Application.objects.filter(user=user)

class ApplicationRespondView(generics.UpdateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Application.objects.all()

    def get_queryset(self):
        if self.request.user.role != 'admin':
            return Application.objects.none()
        return Application.objects.all()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        admin_comment = request.data.get('admin_comment')
        employee_name = request.data.get('employee_name')
        room = request.data.get('room')
        admin_image = request.FILES.get('admin_image')
        
        if not all([ employee_name, room]):
            return Response(
                {'error': 'Все поля обязательны для заполнения'},
                status=status.HTTP_400_BAD_REQUEST
            )

        instance.admin_comment = f"Сотрудник: {employee_name}\nАудитория: {room}\n\nОтвет: {admin_comment}"
        if admin_image:
            instance.admin_image = admin_image
        instance.status = 'in_progress'
        instance.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

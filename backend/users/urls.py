from django.urls import path
from .views import (
    RegisterView, AdminUserView, LoginView, DashboardView, LogoutView,
    EspecialidadListAPI, HorarioDisponibleAPI,
    CitaListCreateAPI,
    CitaConfirmAPI, 
    TratamientoAPI, 
    PagoListAPI, 
    CitaSubsecuenteCreateAPI, 
    VerifyAuthView, 
    TokenRefreshView, 
    PagoCreateAPI, 
    HorarioCreateAPI
)

urlpatterns = [
    path('auth/refresh/', TokenRefreshView.as_view(), name="token_refresh"),
    path('auth/verify/', VerifyAuthView.as_view(), name='verify-auth'),
    path('auth/login/', LoginView.as_view(), name="login"),
    path('auth/logout/', LogoutView.as_view(), name="logout"),
    path('create-user/', AdminUserView.as_view(), name="admin-create-user"),
    path('dashboard/<str:role>/', DashboardView.as_view(), name="dashboard"),
    path('especialidades/', EspecialidadListAPI.as_view(), name='especialidades-list'),
    path('horarios/disponibles/', HorarioDisponibleAPI.as_view()),
    path('citas/', CitaListCreateAPI.as_view(), name='citas-list-create'),
    path('citas/subsecuente/', CitaSubsecuenteCreateAPI.as_view(), name='cita-subsecuente'),
    path('citas/<int:pk>/confirmar/', CitaConfirmAPI.as_view()),
    path('tratamiento/', TratamientoAPI.as_view()),
    path('pagos/', PagoListAPI.as_view(), name='pagos-list'),
    path('pagos/create/', PagoCreateAPI.as_view(), name='pagos-create'),
    path('horarios/', HorarioCreateAPI.as_view(), name='horarios-create'),
]

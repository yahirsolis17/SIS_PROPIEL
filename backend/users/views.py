import logging
from rest_framework import generics, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
from .models import User, Especialidad, Horario, Cita, Tratamiento, Pago
from .serializers import (
    RegisterSerializer, AdminUserSerializer, LoginSerializer, 
    BaseUserSerializer, EspecialidadSerializer, HorarioSerializer,
    CitaSerializer, TratamientoSerializer, PagoSerializer
)
from .permissions import IsRoleMatching
from django.contrib.auth import authenticate
from rest_framework_simplejwt.views import TokenRefreshView
from django.core.exceptions import PermissionDenied 

logger = logging.getLogger(__name__)

class VerifyAuthView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"detail": "Autenticado OK"}, status=200)

class CustomTokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            if not refresh_token:
                return Response({"error": "Refresh token requerido"}, status=400)
            
            refresh = RefreshToken(refresh_token)
            new_access = str(refresh.access_token)
            response = Response({"access": new_access})
            response.set_cookie(
                key='access_token',
                value=new_access,
                httponly=True,
                secure=False,        # True en producción con HTTPS
                samesite='None',     
                max_age=900,         
                path='/'
            )
            return response

        except Exception as e:
            return Response({"error": f"Token inválido: {str(e)}"}, status=401)
        
class CitaListCreateAPI(generics.ListCreateAPIView):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        qs = super().get_queryset()
        paciente_id = self.request.query_params.get('paciente')
        if paciente_id:
            qs = qs.filter(paciente_id=paciente_id)
        return qs
    
    def perform_create(self, serializer):
        # Extraer la especialidad del request
        especialidad_id = self.request.data.get('especialidad')
        if not especialidad_id:
            raise serializers.ValidationError({"especialidad": "Este campo es requerido para asignar un doctor."})
        
        # Obtener el objeto de Especialidad
        especialidad = get_object_or_404(Especialidad, pk=especialidad_id)
        
        # Buscar un doctor con la especialidad y rol adecuado
        doctor = User.objects.filter(
            especialidad_id=especialidad_id,
            role__in=['DERMATOLOGO', 'PODOLOGO', 'TAMIZ']
        ).first()
        
        if not doctor:
            raise serializers.ValidationError({"doctor": "No hay un doctor disponible para esa especialidad."})
        
        # Guardar la cita asignando paciente, doctor y especialidad
        serializer.save(
            paciente=self.request.user,
            doctor=doctor,
            especialidad=especialidad
        )



class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({
            "message": "Registro exitoso",
            "user": response.data
        }, status=status.HTTP_201_CREATED)

class AdminUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated, IsRoleMatching]
    serializer_class = AdminUserSerializer

    def check_permissions(self, request):
        super().check_permissions(request)
        if request.user.role != 'ADMIN':
            self.permission_denied(
                request,
                message="Solo administradores pueden crear usuarios",
                code=status.HTTP_403_FORBIDDEN
            )

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        return Response({
            "user": BaseUserSerializer(user).data,
            "access": access_token,
            "refresh": str(refresh)
        }, status=status.HTTP_200_OK)

class DashboardView(APIView):
    permission_classes = [IsAuthenticated, IsRoleMatching]

    def get(self, request, role): 
        user = request.user
        role_redirects = {
            "ADMIN": "/dashboard/admin/",
            "DERMATOLOGO": "/dashboard/dermatologo/",
            "PODOLOGO": "/dashboard/podologo/",
            "TAMIZ": "/dashboard/tamiz/",
            "PACIENTE": "/dashboard/paciente/",
        }

        return Response({
            "message": f"Bienvenido {user.nombre}",
            "role": user.role,
            "redirect_to": role_redirects.get(user.role, "/dashboard/"),
        })

class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            response = Response({"detail": "Sesión cerrada correctamente."})
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            return response
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class EspecialidadListAPI(generics.ListAPIView):
    serializer_class = EspecialidadSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Especialidad.objects.all()

class HorarioDisponibleAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        especialidad_id = request.query_params.get('especialidad')
        fecha_str = request.query_params.get('fecha')
        if not especialidad_id or not fecha_str:
            return Response({"error": "Especialidad y fecha requeridas"}, status=400)
        try:
            fecha_date = datetime.strptime(fecha_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Formato de fecha inválido (YYYY-MM-DD)"}, status=400)

        dia_semana = fecha_date.weekday() + 1  # 1 = lunes, etc.
        if dia_semana == 7:
            return Response({"horas_disponibles": []}, status=200)

        horarios = Horario.objects.filter(
            especialidad_id=especialidad_id,
            dia_semana=dia_semana
        ).order_by('hora_inicio')
        horas_disponibles = [h.hora_inicio.strftime("%H:%M") for h in horarios]
        return Response({"horas_disponibles": horas_disponibles}, status=200)

class HorarioCreateAPI(generics.CreateAPIView):
    queryset = Horario.objects.all()
    serializer_class = HorarioSerializer
    permission_classes = [IsAuthenticated, IsRoleMatching]
    
    def perform_create(self, serializer):
        if self.request.user.role not in ['ADMIN', 'DERMATOLOGO', 'PODOLOGO']:
            raise PermissionDenied("No tienes permiso para crear horarios")
        serializer.save(doctor=self.request.user)

class PagoCreateAPI(generics.CreateAPIView):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer
    permission_classes = [IsAuthenticated, IsRoleMatching]
    
    def perform_create(self, serializer):
        cita_id = self.request.data.get('cita')
        cita = get_object_or_404(Cita, pk=cita_id, paciente=self.request.user)
        serializer.save(paciente=self.request.user, cita=cita)

# Actualización en la creación de citas subsecuentes: 
# Se elimina la referencia al campo 'comprobante'
class CitaSubsecuenteCreateAPI(APIView):
    permission_classes = [IsAuthenticated, IsRoleMatching]

    def post(self, request):
        tratamiento = Tratamiento.objects.filter(
            paciente=request.user,
            activo=True
        ).first()

        if not tratamiento:
            return Response(
                {"error": "No hay un tratamiento activo para este paciente."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            cita_inicial = tratamiento.citas.filter(tipo='I').first()
            if not cita_inicial:
                return Response(
                    {"error": "No existe cita inicial vinculada al tratamiento"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            fecha_cita = tratamiento.proxima_cita()
            horario = Horario.objects.filter(
                doctor=tratamiento.doctor,
                dia=fecha_cita.date(),
                hora_inicio__gte=fecha_cita.time()
            ).first()

            if not horario:
                return Response(
                    {"error": "No hay horarios disponibles para la fecha calculada."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Creamos la cita subsecuente sin el campo comprobante
            Cita.objects.create(
                paciente=request.user,
                doctor=tratamiento.doctor,
                tipo='S',
                tratamiento=tratamiento,
                estado='P',
                fecha_hora=fecha_cita,
                especialidad=tratamiento.doctor.especialidad
            )
            return Response(
                {"message": "Cita subsecuente agendada correctamente."},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {"error": f"Error al agendar la cita: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CitaConfirmAPI(APIView):
    permission_classes = [IsAuthenticated, IsRoleMatching]
    
    def post(self, request, pk):
        cita = get_object_or_404(Cita, pk=pk, doctor=request.user)
        if cita.estado not in ['P']:
            return Response(
                {'error': 'La cita ya fue procesada o cancelada'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        # Verificar comprobante a través de la relación Pago
        pago = cita.pagos.first()
        if not pago or not pago.verificado:
            return Response(
                {'error': 'El comprobante no está verificado'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cita.estado = 'C'
        cita.save()
        
        if cita.tipo == 'I':
            if not Tratamiento.objects.filter(
                paciente=cita.paciente,
                doctor=cita.doctor,
                activo=True
            ).exists():
                Tratamiento.objects.create(
                    paciente=cita.paciente,
                    doctor=cita.doctor,
                    frecuencia_dias=15
                )
        
        return Response({'status': 'Cita confirmada'})

class TratamientoAPI(generics.RetrieveUpdateAPIView):
    queryset = Tratamiento.objects.all()
    serializer_class = TratamientoSerializer
    permission_classes = [IsAuthenticated, IsRoleMatching]
    
    def get_object(self):
        return get_object_or_404(Tratamiento, paciente=self.request.user)
    
class PagoListAPI(generics.ListAPIView):
    serializer_class = PagoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        paciente_id = self.request.query_params.get('paciente')
        return Pago.objects.filter(paciente_id=paciente_id)

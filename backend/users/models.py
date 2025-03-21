from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta

# Validación personalizada para el campo de teléfono
def validate_phone_length(value):
    if len(value) < 10:
        raise ValidationError("El teléfono debe tener al menos 10 dígitos")

# Manager personalizado para el modelo User
class UserManager(BaseUserManager):
    def create_user(self, telefono, password=None, **extra_fields):
        if not telefono:
            raise ValueError("El número de teléfono es obligatorio")
        
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        
        user = self.model(telefono=telefono, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, telefono, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'ADMIN')
        return self.create_user(telefono, password, **extra_fields)

# Modelo User personalizado
class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('PACIENTE', 'Paciente'),
        ('DERMATOLOGO', 'Dermatólogo'),
        ('PODOLOGO', 'Podólogo'),
        ('TAMIZ', 'Tamiz'),
        ('ADMIN', 'Administrador'),
    ]
    
    email = None
    username = None

    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    edad = models.IntegerField()
    sexo = models.CharField(max_length=10, choices=[
        ('Masculino', 'Masculino'),
        ('Femenino', 'Femenino'),
        ('Otro', 'Otro')
    ])
    peso = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    telefono = models.CharField(max_length=15, unique=True, validators=[validate_phone_length])
    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='PACIENTE')
    especialidad = models.ForeignKey('Especialidad', null=True, blank=True, on_delete=models.SET_NULL)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'telefono'
    REQUIRED_FIELDS = ['nombre', 'apellidos', 'edad']

    objects = UserManager()

    def clean(self):
        if not self.telefono.isdigit():
            raise ValidationError({'telefono': 'Solo se permiten números'})

    def __str__(self):
        return f"{self.nombre} {self.apellidos} - {self.role}"

# Modelo Especialidad
class Especialidad(models.Model):
    nombre = models.CharField(max_length=50, unique=True, choices=[
        ('DERMATOLOGIA', 'Dermatología'),
        ('PODOLOGIA', 'Podología'),
        ('TAMIZ', 'Tamiz'),
    ])
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre

class Horario(models.Model):
    DIAS_SEMANA = [
        (1, "Lunes"),
        (2, "Martes"),
        (3, "Miércoles"),
        (4, "Jueves"),
        (5, "Viernes"),
        (6, "Sábado"),
    ]

    doctor = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        limit_choices_to={'role__in': ['DERMATOLOGO', 'PODOLOGO', 'TAMIZ']}
    )
    especialidad = models.ForeignKey('Especialidad', on_delete=models.CASCADE)

    dia_semana = models.IntegerField(choices=DIAS_SEMANA)  # 🔥 Nuevo sistema de días
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()

    class Meta:
        unique_together = ('doctor', 'dia_semana', 'hora_inicio')

    def __str__(self):
        return f"{self.doctor.nombre} - {dict(self.DIAS_SEMANA)[self.dia_semana]} {self.hora_inicio} - {self.hora_fin}"

class Pago(models.Model):
    paciente = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='pagos_paciente'
    )
    cita = models.ForeignKey(
        'Cita',
        on_delete=models.CASCADE,
        related_name='pagos'
    )
    total = models.DecimalField(max_digits=10, decimal_places=2)
    pagado = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateField(auto_now_add=True)
    verificado = models.BooleanField(default=False)
    comprobante = models.ImageField(upload_to='users/comprobantes/')  # Renombrado desde 'archivo'
    
    def saldo_pendiente(self):
        return self.total - self.pagado

    def __str__(self):
        return f"Pago {self.id} - {self.paciente.nombre}"


class Cita(models.Model):
    ESTADOS = (
        ('P', 'Pendiente'),
        ('C', 'Confirmada'),
        ('X', 'Cancelada')
    )
    
    paciente = models.ForeignKey(
        'User',
        related_name='citas_paciente',
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'PACIENTE'}
    )
    doctor = models.ForeignKey(
        'User',
        related_name='citas_doctor',
        on_delete=models.CASCADE,
        limit_choices_to={'role__in': ['DERMATOLOGO', 'PODOLOGO', 'TAMIZ']}
    )
    especialidad = models.ForeignKey('Especialidad', on_delete=models.CASCADE)
    fecha_hora = models.DateTimeField()
    tipo = models.CharField(max_length=1, choices=[('I', 'Inicial'), ('S', 'Subsecuente')], default='I')
    estado = models.CharField(max_length=1, choices=ESTADOS, default='P')
    
    # Eliminado el campo 'comprobante'. Ahora el comprobante se gestiona a través de Pago.
    tratamiento = models.ForeignKey('Tratamiento', null=True, blank=True, on_delete=models.SET_NULL)

    class Meta:
        indexes = [
            models.Index(fields=['fecha_hora']),
        ]

    def __str__(self):
        return f"Cita {self.id} - {self.paciente.nombre} con {self.doctor.nombre}"

# Modelo Tratamiento
class Tratamiento(models.Model):
    paciente = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tratamientos_paciente'
    )
    doctor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tratamientos_doctor'
    )
    frecuencia_dias = models.PositiveIntegerField(default=15)
    fecha_inicio = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)
    
    def proxima_cita(self):
        return self.fecha_inicio + timedelta(days=self.frecuencia_dias)
    
    def __str__(self):
        return f"Tratamiento {self.id} - {self.paciente.nombre}"

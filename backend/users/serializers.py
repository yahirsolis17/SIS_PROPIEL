from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User, Especialidad, Horario, Cita, Tratamiento, Pago
from django.utils import timezone
from datetime import datetime
from django.contrib.auth import authenticate

class BaseUserSerializer(serializers.ModelSerializer):
    """Serializador base para devolver datos de usuario después del login"""
    class Meta:
        model = User
        fields = ['id', 'telefono', 'nombre', 'apellidos', 'role']

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'nombre', 'apellidos', 'role']  # Ajusta los campos


class RegisterSerializer(serializers.ModelSerializer):
    """Serializador para registrar nuevos pacientes"""
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)  # Campo para confirmación

    class Meta:
        model = User
        fields = ['id', 'password', 'password2', 'nombre', 'apellidos', 'edad', 'sexo', 'peso', 'telefono', 'role']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden"})
        return data

    def validate_nombre(self, value):
        if not value.replace(" ", "").isalpha():
            raise serializers.ValidationError("El nombre solo debe contener letras.")
        if len(value) < 2:
            raise serializers.ValidationError("El nombre debe tener al menos 2 caracteres.")
        return value

    def validate_apellidos(self, value):
        if not value.replace(" ", "").isalpha():
            raise serializers.ValidationError("Los apellidos solo deben contener letras.")
        if len(value) < 2:
            raise serializers.ValidationError("Los apellidos deben tener al menos 2 caracteres.")
        return value

    def validate_edad(self, value):
        if value is None:
            raise serializers.ValidationError("La edad es obligatoria.")
        if value < 0:
            raise serializers.ValidationError("La edad no puede ser un número negativo.")
        if value < 18:
            raise serializers.ValidationError("Debes tener al menos 18 años para registrarte.")
        if value > 120:
            raise serializers.ValidationError("La edad ingresada no es válida.")
        return value

    def validate_sexo(self, value):
        if value not in ["Masculino", "Femenino", "Otro"]:
            raise serializers.ValidationError("El sexo debe ser Masculino, Femenino u Otro.")
        return value

    def validate_peso(self, value):
        if value is not None:
            if value <= 0:
                raise serializers.ValidationError("El peso debe ser un número positivo.")
            if value > 300:
                raise serializers.ValidationError("El peso ingresado no es válido.")
        return value

    def validate_telefono(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("El número de teléfono solo debe contener dígitos.")
        if len(value) != 10:
            raise serializers.ValidationError("El número de teléfono debe tener exactamente 10 dígitos.")
        if User.objects.filter(telefono=value).exists():
            raise serializers.ValidationError("Este número de teléfono ya está registrado.")
        return value

    def validate_password(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("La contraseña debe contener al menos un número.")
        if not any(char.isalpha() for char in value):
            raise serializers.ValidationError("La contraseña debe contener al menos una letra.")
        if value.isdigit():
            raise serializers.ValidationError("La contraseña no puede estar compuesta solo por números.")
        if value.lower() in ['password', '12345678', 'admin']:
            raise serializers.ValidationError("La contraseña es demasiado común. Elige una más segura.")
        return value

    def create(self, validated_data):
        validated_data.pop('password2')
        validated_data['role'] = 'PACIENTE'
        return User.objects.create_user(**validated_data)

class AdminUserSerializer(serializers.ModelSerializer):
    """Serializador para que un ADMIN cree cuentas de especialistas y otros usuarios"""
    password = serializers.CharField(write_only=True, min_length=6, validators=[validate_password])

    class Meta:
        model = User
        fields = ['id', 'password', 'nombre', 'apellidos', 'edad', 'sexo', 'peso', 'telefono', 'role']

    def validate_telefono(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Solo se permiten números en el teléfono.")
        if User.objects.filter(telefono=value).exists():
            raise serializers.ValidationError("Este teléfono ya está registrado.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class LoginSerializer(serializers.Serializer):
    telefono = serializers.CharField(max_length=10)
    password = serializers.CharField(write_only=True)

    def validate_telefono(self, value):
        value = value.strip()
        if len(value) != 10 or not value.isdigit():
            raise serializers.ValidationError("El teléfono debe contener 10 dígitos")
        return value

    def validate(self, data):
        user = authenticate(
            self.context.get('request'),
            telefono=data.get('telefono'),
            password=data.get('password')
        )
        if not user:
            raise serializers.ValidationError({"non_field_errors": ["Teléfono o contraseña incorrectos"]})
        if not user.is_active:
            raise serializers.ValidationError({"non_field_errors": ["Cuenta desactivada"]})
        data['user'] = user
        return data

# Serializadores para Citas, Especialidad, Horario, Tratamiento y Pago

class EspecialidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidad
        fields = ['id', 'nombre', 'descripcion']

class HorarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Horario
        fields = ['id', 'doctor', 'dia_semana', 'hora_inicio', 'hora_fin']
        extra_kwargs = {
            'doctor': {'read_only': True}
        }

class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'nombre', 'apellidos', 'edad', 'sexo', 'peso', 'telefono', 'role']

class CitaSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer(read_only=True)
    especialidad = EspecialidadSerializer(read_only=True)
    estado = serializers.CharField(source='get_estado_display', read_only=True)
    paciente = PacienteSerializer(read_only=True)
    pagos = serializers.SerializerMethodField()

    class Meta:
        model = Cita
        fields = [
            'id', 'paciente', 'doctor', 'especialidad', 
            'fecha_hora', 'tipo', 'estado', 'tratamiento', 'pagos'
        ]
        read_only_fields = ('estado', 'tratamiento', 'paciente', 'doctor')

    def get_pagos(self, obj):
        # Retornamos los datos de pagos; se usa PagoSerializer para cada pago
        from .models import Pago  # Importar localmente para evitar circulares
        pagos = obj.pagos.all()
        return PagoSerializer(pagos, many=True, context=self.context).data


class TratamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tratamiento
        fields = '__all__'
        read_only_fields = ('fecha_inicio',)
        
    def validate_doctor(self, value):
        if value.role not in ['DERMATOLOGO', 'PODOLOGO']:
            raise serializers.ValidationError("El doctor asignado no tiene un rol médico válido")
        return value
    
    def validate(self, data):
        if Tratamiento.objects.filter(
            paciente=data['paciente'],
            doctor=data['doctor'],
            activo=True
        ).exists():
            raise serializers.ValidationError("Ya existe un tratamiento activo para este paciente y doctor.")
        return data
    
class PagoSerializer(serializers.ModelSerializer):
    comprobante = serializers.ImageField(use_url=True)
    
    class Meta:
        model = Pago
        fields = '__all__'
        read_only_fields = ['paciente', 'fecha', 'verificado', 'pagado', 'total']

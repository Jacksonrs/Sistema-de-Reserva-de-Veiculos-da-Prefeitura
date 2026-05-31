from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Usuario


# ─── JWT customizado — inclui dados do usuário no token ──────────────────────
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['name']    = user.name
        token['role']    = user.role
        token['sector']  = user.sector
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Inclui dados do usuário na resposta do login
        data['user'] = UsuarioSerializer(self.user).data
        return data


# ─── Serializer básico (leitura) ──────────────────────────────────────────────
class UsuarioSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model  = Usuario
        fields = [
            'id', 'username', 'name', 'initials', 'email',
            'role', 'sector', 'active', 'avatar_url',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_avatar_url(self, obj):
        request = self.context.get('request')
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        return None


# ─── Serializer de criação / atualização ─────────────────────────────────────
class UsuarioCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model  = Usuario
        fields = [
            'username', 'name', 'initials', 'email',
            'role', 'sector', 'active', 'avatar', 'password',
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Usuario(**validated_data)
        user.set_password(password)
        user.save()
        return user


# ─── Serializer de atualização parcial (admin) ────────────────────────────────
class UsuarioUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, required=False)

    class Meta:
        model  = Usuario
        fields = [
            'name', 'initials', 'email', 'role',
            'sector', 'active', 'avatar', 'password',
        ]

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

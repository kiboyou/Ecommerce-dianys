from rest_framework import serializers
from .models import NouveauUtilisateur


class UtilisateurSerialiezer(serializers.ModelSerializer):

     email = serializers.EmailField(required=True)
     first_name = serializers.CharField(required=True)
     password = serializers.CharField(min_length=8, write_only=True)

     class Meta:
          model = NouveauUtilisateur
          fields = ('id', 'email', 'first_name', 'last_name',  'password','is_active', 'is_staff', 'is_superuser', )
          extra_kwargs = {'password': {'write_only': True}}


     def create(self, validated_data):
          password = validated_data.pop('password', None)
          utilisateur = self.Meta.model(**validated_data)
          if password is not None:
               utilisateur.set_password(password)
          utilisateur.save()
          return utilisateur


class InfoUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = NouveauUtilisateur
        fields = '__all__'


class ChangerMotPasseSerializer(serializers.Serializer):

     model = NouveauUtilisateur

     ancien_password = serializers.CharField(required=True)
     nouveau_password = serializers.CharField(required=True)
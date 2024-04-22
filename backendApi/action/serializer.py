from rest_framework import serializers

from .models import Commentaire, Favori


class CommentaireSerializer(serializers.ModelSerializer):
     class Meta:
          model = Commentaire
          fields = "__all__"
          

          
class FavoriSerializer(serializers.ModelSerializer):
     class Meta:
          model = Favori
          fields = "__all__"
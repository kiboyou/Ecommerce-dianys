
from rest_framework import serializers

from .models import Categorie, SousCategorie


class CategorieSerializer(serializers.ModelSerializer):
     class Meta:
          model = Categorie
          fields = "__all__"



class SousCategorieSerializer(serializers.ModelSerializer):
     class Meta:
          model = SousCategorie
          fields = "__all__"



# class TypeCategorieSerializer(serializers.ModelSerializer):
#      class Meta:
#           model = TypeCategorie
#           fields = "__all__"
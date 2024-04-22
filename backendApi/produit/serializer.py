from rest_framework import serializers


from .models import Produit,Couleur, Pointures, Image

class ProduitSerialiezer(serializers.ModelSerializer):

     class Meta:
          model = Produit
          fields = "__all__"


class ImageSerialiezer(serializers.ModelSerializer):

     class Meta:
          model = Image
          fields = "__all__"
          
          
class PointuretSerialiezer(serializers.ModelSerializer):

     class Meta:
          model = Pointures
          fields = "__all__"


class CouleurSerialiezer(serializers.ModelSerializer):

     class Meta:
          model = Couleur
          fields = "__all__"
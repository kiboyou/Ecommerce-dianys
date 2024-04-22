from django.shortcuts import render
from rest_framework import viewsets

from .models import Produit, Image, Pointures, Couleur
from .serializer import ProduitSerialiezer, ImageSerialiezer, PointuretSerialiezer, CouleurSerialiezer


class ProduitsViewsets(viewsets.ModelViewSet):
     
     serializer_class = ProduitSerialiezer
     queryset = Produit.objects.all().filter(archiver=False).order_by("date_creation")
     
     
class ImageViewsets(viewsets.ModelViewSet):
     
     serializer_class = ImageSerialiezer
     queryset = Image.objects.all()
     
     
class PointureViewsets(viewsets.ModelViewSet):
     
     serializer_class = PointuretSerialiezer
     queryset = Pointures.objects.all()
     
class CouleurViewsets(viewsets.ModelViewSet):
     
     serializer_class = CouleurSerialiezer
     queryset = Couleur.objects.all()
from django.shortcuts import render

from rest_framework.viewsets import ModelViewSet

from .models import Commande
from .serializer import CommandeSerializer


class CommandeModelViewSet(ModelViewSet):
     
     serializer_class = CommandeSerializer
     queryset = Commande.objects.all()
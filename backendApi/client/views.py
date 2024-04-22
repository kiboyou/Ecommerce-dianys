from django.shortcuts import render

from rest_framework.viewsets import ModelViewSet

from .models import Client
from .serializer import ClientSerializer



class ClientModelViewSet(ModelViewSet):
     
     serializer_class = ClientSerializer
     queryset = Client.objects.all()

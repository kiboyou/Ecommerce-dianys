from django.shortcuts import render

from rest_framework.viewsets import ModelViewSet

from .serializer import FactureSerializer
from .models import Facture


class FactureModelViewSet(ModelViewSet):
     
     serializer_class = FactureSerializer
     queryset = Facture.objects.all()
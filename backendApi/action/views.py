from django.shortcuts import render

from rest_framework.viewsets import ModelViewSet

from .models import Commentaire, Favori
from .serializer import CommentaireSerializer, FavoriSerializer



class CommentaireModelViewSet(ModelViewSet):
     
     serializer_class = CommentaireSerializer
     queryset = Commentaire.objects.all()
     


class favoriModelViewSet(ModelViewSet):
     
     serializer_class = FavoriSerializer
     queryset = Favori.objects.all()
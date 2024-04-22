from django.shortcuts import render

from rest_framework.viewsets import ModelViewSet

from .serializer import ArticleSerializer, PanierSerializer
from .models import Article, Panier


class ArticleViewSet(ModelViewSet):
     
     serializer_class = ArticleSerializer
     queryset = Article.objects.all()
     
     
     
class PanierViewSet(ModelViewSet):
     serializer_class = PanierSerializer
     queryset = Panier.objects.all()
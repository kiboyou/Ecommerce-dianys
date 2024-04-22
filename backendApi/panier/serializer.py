from rest_framework import serializers

from .models import Article, Panier


class ArticleSerializer(serializers.ModelSerializer):
     
     class Meta:
          model = Article
          fields = "__all__"


class PanierSerializer(serializers.ModelSerializer):
     
     class Meta:
          model = Panier
          fields = "__all__"

from rest_framework.viewsets import ModelViewSet

from .models import Categorie, SousCategorie
from .serializer import CategorieSerializer, SousCategorieSerializer



class CategorieModelViewSet(ModelViewSet):

     serializer_class = CategorieSerializer
     queryset = Categorie.objects.all().filter(archiver=False)



class SousCategorieModelViewSet(ModelViewSet):

     serializer_class = SousCategorieSerializer
     queryset = SousCategorie.objects.all().filter(archiver=False)



# class TypeCategorieModelViewSet(ModelViewSet):

#      serializer_class = TypeCategorieSerializer
#      queryset = TypeCategorie.objects.all().filter(archiver=False)
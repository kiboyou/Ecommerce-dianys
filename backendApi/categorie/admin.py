from django.contrib import admin

# Register your models here.

from .models import Categorie, SousCategorie


admin.site.register(Categorie)
admin.site.register(SousCategorie)
# admin.site.register(TypeCategorie)
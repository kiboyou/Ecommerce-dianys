from django.contrib import admin

from .models import Produit, Image, Pointures, Couleur


admin.site.register(Image)
admin.site.register(Pointures)
admin.site.register(Couleur)


@admin.register(Produit)
class ProduitAdmin(admin.ModelAdmin):
    list_display = ('sous_categorie','nom_produit', 'prix', 'taux_pourcentage', 'disponible', 'solder')
    list_filter = ('sous_categorie','nom_produit', 'prix', 'taux_pourcentage', 'disponible', 'solder')
    search_fields = ('sous_categorie','nom_produit', 'prix', 'taux_pourcentage', 'disponible', 'solder')
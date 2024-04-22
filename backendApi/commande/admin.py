from django.contrib import admin

from .models import Commande


@admin.register(Commande)
class CommandeAdmin(admin.ModelAdmin):
    list_display = ('num_commande','panier', 'date_livraison', 'etat_commande')
    list_filter = ('num_commande','panier', 'date_livraison', 'etat_commande')
    search_fields = ('num_commande','panier', 'date_livraison', 'etat_commande')
from django.contrib import admin


from .models import Facture



@admin.register(Facture)
class FactureAdmin(admin.ModelAdmin):
    list_display = ('num_facture','commande', 'tva', 'reduction')
    list_filter = ('num_facture','commande', 'tva', 'reduction')
    search_fields = ('num_facture','commande', 'tva', 'reduction')
    
from django.contrib import admin

from .models import Article, Panier


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('client','produit', 'quantite', 'prix_total_article', 'commander')
    list_filter = ('client','produit', 'quantite', 'prix_total_article', 'commander')
    search_fields = ('client','produit', 'quantite', 'prix_total_article', 'commander')
    
    
    
@admin.register(Panier)
class PanierAdmin(admin.ModelAdmin):
    list_display = ('client', 'prix_total')
    list_filter = ('client', 'prix_total')
    search_fields = ('client', 'prix_total')
from django.contrib import admin


from .models import Commentaire, Favori


@admin.register(Commentaire)
class CommentaireAdmin(admin.ModelAdmin):
    list_display = ('user','produit', 'Description', 'dateCommentaire')
    list_filter = ('user','produit', 'Description', 'dateCommentaire')
    search_fields = ('user','produit', 'Description', 'dateCommentaire')
    
    
    
@admin.register(Favori)
class FavoriAdmin(admin.ModelAdmin):
    list_display = ('user','produit', 'ajouteFavori')
    list_filter = ('user','produit', 'ajouteFavori')
    search_fields = ('user','produit', 'ajouteFavori')

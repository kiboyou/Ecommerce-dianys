from django.db import models
from categorie.models import SousCategorie, Categorie




class Produit(models.Model):
     categorie = models.ForeignKey(Categorie, blank=True, null=True, on_delete=models.CASCADE)
     sous_categorie = models.ForeignKey(SousCategorie, blank=True, null=True, on_delete=models.CASCADE)
     nom_produit = models.CharField(max_length=255)
     description = models.TextField(blank=True)
     image = models.ImageField(max_length=255, blank=True, null=True)
     prix = models.FloatField(default=0)
     taux_pourcentage = models.IntegerField(default=100)
     disponible = models.BooleanField(default=True)
     date_creation = models.DateTimeField(auto_now_add=True)
     date_modification = models.DateTimeField(auto_now=True)
     solder = models.BooleanField(default=False)
     archiver = models.BooleanField(default=False)



     class Meta:
          verbose_name_plural = 'Produits'
          ordering = ('-date_creation',)


     def __str__(self):
          return self.nom_produit




class Image(models.Model):
     produit = models.ForeignKey(Produit, related_name='produitImage', on_delete=models.CASCADE)
     image = models.ImageField()


     def __str__(self):
          return self.produit.nom_produit


class Pointures(models.Model):
     produit = models.ForeignKey(Produit, related_name='produitPointure', on_delete=models.CASCADE)
     taille = models.CharField(max_length=150)
     disponibilite = models.CharField(max_length=150)
     prix_personnalise = models.IntegerField(default=0)

     def __str__(self):
         return self.taille
     

class Couleur(models.Model):
     produit = models.ForeignKey(Produit, related_name='produitCouleur', on_delete=models.CASCADE)
     nom = models.CharField(max_length=150)
     code_couleur = models.CharField(max_length=150)

     def __str__(self):
         return self.nom

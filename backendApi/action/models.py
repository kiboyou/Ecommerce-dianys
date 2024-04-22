from django.db import models

from client.models import Client
from produit.models import Produit



class Commentaire(models.Model):
     user = models.ForeignKey(Client, blank= True, verbose_name=("client"), on_delete=models.CASCADE)
     produit = models.ForeignKey(Produit, blank= True, verbose_name=("produit"), on_delete=models.CASCADE)
     Description = models.TextField()
     dateCommentaire = models.DateTimeField(auto_now_add=True, blank=True, null=True)
     archiver = models.BooleanField(default=False)


     def __str__(self):
          return f'le produit {self.produit} a été commenter'




class Favori(models.Model):
     user = models.ForeignKey(Client, blank= True, verbose_name=("client"), on_delete=models.CASCADE)
     produit = models.ForeignKey(Produit, blank= True, verbose_name=("produit"), on_delete=models.CASCADE)
     ajouteFavori = models.BooleanField(default=False)
     dateFavori = models.DateTimeField(auto_now_add=True, blank=True, null=True)

     def __str__(self):
          return f'le produit {self.produit} est {self.ajouteFavori}'
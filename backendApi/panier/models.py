from django.db import models
from datetime import timezone

from client.models import Client
from produit.models import Produit, Pointures, Couleur



class Article(models.Model):
     client = models.ForeignKey(Client, on_delete=models.CASCADE)
     produit = models.ForeignKey(Produit, on_delete=models.CASCADE)
     couleur = models.ForeignKey(Couleur, on_delete=models.CASCADE, blank=True, null=True)
     pointure = models.ForeignKey(Pointures, on_delete=models.CASCADE, blank=True, null=True)
     quantite = models.IntegerField(default=1)
     prix_total_article = models.IntegerField(default=0)
     commander = models.BooleanField(default=False)
     date_commande = models.DateField(blank=True, null=True)

     def __str__(self):
          return f"{self.produit.nom_produit} [{self.quantite}]"




class Panier(models.Model):
     client = models.ForeignKey(Client, on_delete=models.CASCADE)
     article = models.ManyToManyField(Article)
     prix_total = models.IntegerField(default=0)


     def __str__(self):
          return f'Panier de {self.client.user.first_name}'
     
     
     def delete(self, *args, **kwargs):
          for article in self.article.all():
               article.commander = True
               article.date_commande = timezone.now()
               article.save() 

          self.article.clear()
          super().delete(*args, **kwargs)
from django.db import models
from commande.models import Commande


class Facture(models.Model):
     commande = models.ForeignKey(Commande, related_name='commander', on_delete=models.CASCADE)
     num_facture = models.CharField(max_length=50)
     tva = models.CharField(max_length=150, null=True, blank=True)
     reduction = models.CharField(max_length=50, null=True, blank=True)
     modalite_paiement = models.CharField(max_length=150, null=True, blank=True)
     date_facture =  models.CharField(max_length=50)
     
     def __str__(self):
          return self.num_facture

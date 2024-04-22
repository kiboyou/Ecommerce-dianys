from django.db import models
from panier.models import Panier




class Commande(models.Model):
    panier = models.ForeignKey(Panier, related_name='panier_commander', on_delete=models.CASCADE)
    num_commande = models.CharField(max_length=50)
    mode_livraison = models.CharField(max_length=150)
    date_livraison = models.CharField(max_length=150)
    adresse_livraison = models.CharField(max_length=150)
    prix_livraison = models.IntegerField()
    prix_commande = models.IntegerField()
    date_commander = models.CharField(max_length=150)
    etat_commande = models.BooleanField(default=False)
    
    def __str__(self):
        return self.num_commande
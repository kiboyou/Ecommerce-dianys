from django.db import models
from utilisateur.models import NouveauUtilisateur


class Client(models.Model):
     user = models.OneToOneField(NouveauUtilisateur, related_name='userClient', on_delete=models.CASCADE)
     numeroCNI = models.CharField(max_length=50, blank=True, null=True)
     date_naissance = models.CharField(max_length=50)
     sexe = models.CharField(max_length=10)
     telephone = models.CharField(max_length=50)
     ville = models.CharField(max_length=50) 
     commun = models.CharField(max_length=50)
     habitation = models.CharField(max_length=50)
     code_postal = models.CharField(max_length=50, blank=True, null=True)
     archiver = models.BooleanField(default=False)
     
     def __str__(self):
          return self.user.first_name
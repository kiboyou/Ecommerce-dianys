from django.db import models




class Categorie(models.Model):
    nom_categorie = models.CharField(max_length=255)
    archiver = models.BooleanField(default=False)

    def __str__(self):
        return self.nom_categorie



class SousCategorie(models.Model):
    categorie = models.ForeignKey(Categorie, related_name='categorie', on_delete=models.CASCADE)
    nom_sous_categorie = models.CharField(max_length=255)
    quantite_sous_categorie = models.IntegerField(default=1)
    archiver = models.BooleanField(default=False)

    def __str__(self):
        return self.nom_sous_categorie



# class TypeCategorie(models.Model):
#     sous_categorie = models.ForeignKey(SousCategorie, related_name='sous_categorie', on_delete=models.CASCADE)
#     nom_type_categorie = models.CharField(max_length=255)
#     quantite_type_categorie = models.IntegerField(default=1)
#     archiver = models.BooleanField(default=False)

#     def __str__(self):
#         return self.nom_type_categorie
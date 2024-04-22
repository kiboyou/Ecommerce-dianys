# Generated by Django 4.1.4 on 2023-02-19 12:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("categorie", "0002_remove_typecategorie_sous_categorie"),
        ("produit", "0002_tailleproduit"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="produit",
            name="type_categorie",
        ),
        migrations.AddField(
            model_name="produit",
            name="sous_categorie",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="sous_categorie",
                to="categorie.souscategorie",
            ),
        ),
    ]
# Generated by Django 4.1.4 on 2023-01-31 01:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("panier", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Commande",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("num_commande", models.CharField(max_length=50)),
                ("mode_livraison", models.CharField(max_length=150)),
                ("date_livraison", models.CharField(max_length=150)),
                ("adresse_livraison", models.CharField(max_length=150)),
                ("prix_livraison", models.IntegerField()),
                ("prix_commande", models.IntegerField()),
                ("date_commander", models.CharField(max_length=150)),
                ("etat_commande", models.BooleanField(default=False)),
                (
                    "panier",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="panier_commander",
                        to="panier.panier",
                    ),
                ),
            ],
        ),
    ]

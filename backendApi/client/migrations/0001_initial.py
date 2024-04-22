# Generated by Django 4.1.4 on 2023-01-31 01:37

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Client",
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
                ("numeroCNI", models.CharField(blank=True, max_length=50, null=True)),
                ("date_naissance", models.CharField(max_length=50)),
                ("sexe", models.CharField(max_length=10)),
                ("telephone", models.CharField(max_length=50)),
                ("ville", models.CharField(max_length=50)),
                ("commun", models.CharField(max_length=50)),
                ("habitation", models.CharField(max_length=50)),
                ("code_postal", models.CharField(blank=True, max_length=50, null=True)),
                ("archiver", models.BooleanField(default=False)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="userClient",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
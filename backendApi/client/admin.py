from django.contrib import admin

# Register your models here.

from .models import Client


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('user','numeroCNI', 'telephone', 'habitation')
    list_filter = ('user','numeroCNI', 'telephone', 'habitation')
    search_fields = ('user','numeroCNI', 'telephone', 'habitation')
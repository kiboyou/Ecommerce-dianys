from django.db import models
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import NouveauUtilisateur


@admin.register(NouveauUtilisateur)
class UserAdminConfig(UserAdmin):
    model = NouveauUtilisateur
    search_fields = ('email', 'last_name', 'first_name',)
    list_filter = ('email', 'last_name', 'first_name', 'is_active', 'is_staff')
    ordering = ('-start_date',)
    list_display = ('email', 'last_name', 'first_name', 'is_active', 'is_staff')
    fieldsets = (
        (None, {'fields': ('email', 'last_name', 'first_name',)}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'last_name', 'first_name', 'password1', 'password2', 'is_active', 'is_staff')}
         ),
    )


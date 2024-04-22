from django.urls import path, include

from .views import CreationUtilisateur,ChangerMotPasseiew ,BlacklistTokenUpdateView, UserConnecter


urlpatterns = [
     path('CreationUtilisateur/', CreationUtilisateur.as_view(), name="CreationUtilisateur"),
     path('changer_mot_passe/', ChangerMotPasseiew.as_view(), name='change-password'),
     path('utilisateurConnecte/', UserConnecter.as_view(), name='userConncter'),
     path('CreationUtilisateur/<int:id>', CreationUtilisateur.as_view()),
     path('deconnexion/blacklist/', BlacklistTokenUpdateView.as_view(),name='blacklist'),

     path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset'))
]

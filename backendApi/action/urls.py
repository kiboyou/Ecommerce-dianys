from rest_framework.routers import DefaultRouter

from .views import CommentaireModelViewSet, favoriModelViewSet

router = DefaultRouter()

router.register('commentaire', CommentaireModelViewSet, basename='commentaire')
router.register('favoi', favoriModelViewSet, basename='favori')


urlpatterns = router.urls
from rest_framework.routers import DefaultRouter

from .views import CommandeModelViewSet

router = DefaultRouter()

router.register('', CommandeModelViewSet, basename='commande')


urlpatterns = router.urls
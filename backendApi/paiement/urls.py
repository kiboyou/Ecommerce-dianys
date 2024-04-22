from rest_framework.routers import DefaultRouter

from .views import FactureModelViewSet

router = DefaultRouter()

router.register('', FactureModelViewSet, basename='facture')


urlpatterns = router.urls
from rest_framework.routers import DefaultRouter

from .views import ClientModelViewSet

router = DefaultRouter()

router.register('', ClientModelViewSet, basename='client')


urlpatterns = router.urls
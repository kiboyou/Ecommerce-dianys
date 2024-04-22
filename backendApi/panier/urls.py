from rest_framework.routers import DefaultRouter

from .views import ArticleViewSet, PanierViewSet

router = DefaultRouter()


router.register('', PanierViewSet, basename='panier')
router.register('panier/article', ArticleViewSet, basename='article')

urlpatterns = router.urls
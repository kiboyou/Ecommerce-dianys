from rest_framework.routers import DefaultRouter

from .views import CategorieModelViewSet, SousCategorieModelViewSet

router = DefaultRouter()

router.register('', CategorieModelViewSet, basename='categorie')
router.register('categorie/sous-categorie', SousCategorieModelViewSet, basename='sous-categorie')
# router.register('sous-categorie/type-categorie', TypeCategorieModelViewSet, basename='type-categorie')



urlpatterns = router.urls
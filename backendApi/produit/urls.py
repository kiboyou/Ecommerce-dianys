from rest_framework.routers import DefaultRouter

from .views import ProduitsViewsets,PointureViewsets,CouleurViewsets,ImageViewsets

router = DefaultRouter()

router.register('', ProduitsViewsets, basename='produit')
router.register('produit/image', ImageViewsets, basename='image')
router.register('produit/pointure', PointureViewsets, basename='pointure')
router.register('produit/couleur', CouleurViewsets, basename='couleur')

urlpatterns = router.urls
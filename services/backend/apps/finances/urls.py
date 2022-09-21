from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

stripe_router = DefaultRouter()
stripe_router.register(r'setup-intent', views.StripeSetupIntentViewSet, basename='setup-intent')

stripe_urls = [
    path("", include(stripe_router.urls)),
    path("", include("djstripe.urls", namespace="djstripe")),
]

urlpatterns = [
    path("stripe/", include(stripe_urls)),
]

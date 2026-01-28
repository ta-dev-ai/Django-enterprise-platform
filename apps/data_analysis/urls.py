from django.urls import path
from .views import dashboard_view

urlpatterns = [
    path('dashboard/test/', dashboard_view, name='dashboard-test'),
]

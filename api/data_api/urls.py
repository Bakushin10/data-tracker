# todos/urls.py
from django.urls import path

from .views import Data_Api

urlpatterns = [
    path('', Data_Api.as_view()),
]
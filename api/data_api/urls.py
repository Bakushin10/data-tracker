# todos/urls.py
from django.urls import path

from .views import DataApi, SaveCommand

urlpatterns = [
    path('', DataApi.as_view()),
    path('save', SaveCommand.as_view()),
]
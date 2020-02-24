# todos/urls.py
from django.urls import path

from .views import DataApi, SaveCommand, DeleteCommand

urlpatterns = [
    path('', DataApi.as_view()),
    path('save', SaveCommand.as_view()),
    path('delete', DeleteCommand.as_view()),
]
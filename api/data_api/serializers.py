from rest_framework import serializers
from .models import FavoriteCommand


class SaveFavoriteCommandSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteCommand
        fields = ('name', 'company', 'sql', 'previous_period')
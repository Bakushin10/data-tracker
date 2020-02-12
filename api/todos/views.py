from rest_framework import viewsets, status
from .models import Stuff
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import StuffSerializer
import json
import requests


class StuffViewSet(APIView):

    def post(self, request):
        # queryset = Stuff.objects.all()
        # serializer_class = StuffSerializer
        # return Response(data = serializer.data, status = status.HTTP_400_BAD_REQUEST)
        print("here")
        print(request.data)
        serializer = StuffSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data = "data saved", status=status.HTTP_201_CREATED)
        return Response(data = "data not saved", status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        snippets = Stuff.objects.all()
        serializer = StuffSerializer(snippets, many=True)
        print("GET")
        print(serializer.data)
        # , content_type = "application/json"
        return Response(data = json.dumps(serializer.data))
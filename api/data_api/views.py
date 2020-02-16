from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
import json
import requests
import pytz

from .serializers import SaveFavoriteCommandSerializer
from .models import FavoriteCommand

# data
import datetime as dt
import matplotlib.pyplot as plt
from matplotlib import style
import pandas as pd
import pandas_datareader.data as web
import seaborn as sns
from pandasql import sqldf
from data_tracker.utils.const import CONST, MESSAGES

JST = dt.timezone(dt.timedelta(hours=+9), 'JST')
PATH_TO_CSV = CONST.PATH_TO_CSV


class DataApi(APIView):

    def post(self, request):
        result = self.get_stock_data(request)
        if result.get("status") == CONST.SUCCESS:
            return Response(data = result.get("data"), status=status.HTTP_200_OK)
        return Response(data = result.get("message"), status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            data = FavoriteCommand.objects.all()
            serializer = SaveFavoriteCommandSerializer(data, many=True)
            return Response(data = serializer.data)
        except:
            return Response(data = MESSAGES.FAIL_DATA_NOT_FETCHED, status=status.HTTP_400_BAD_REQUEST)

    def get_stock_data(self, request):
        style.use('ggplot')
        data = self.stock_info_adaptor(request)
        print(data)

        sql = data.get("sql")
        df = web.DataReader(
                data.get("company"),
                data_source = data.get("data_source"),
                start = data.get("start"),
                end = data.get("end")
            )
        print("*** original ***")
        print(df.head(10))
        filename = str(dt.datetime.now(JST)) + "_" + data.get("company")
        #df.to_csv(PATH_TO_CSV + filename)
        
        # q = """
        #     SELECT *
        #     FROM dfddd
        #     WHERE Low < 730;
        #     """
        try:
            sdf = sqldf(sql, locals())
            print("*** after sql ***")
            print(sdf)
            return self.stock_data_result_adaptor(status = CONST.SUCCESS, data = sdf.head(10))
        except:
            return self.stock_data_result_adaptor(status = CONST.FAIL, message = MESSAGES.SQL_ERROR)
    
    def stock_data_result_adaptor(self, status = status, data = "", message = ""):
        """
            adapt
        """
        return{
            "data" : data,
            "status" : status,
            "message" : message
        }
    
    def stock_info_adaptor(self, request):
        """
            adapt the input from front-end to backend
        """
        today = dt.date.today()
        previous = request.data.get("period", 10)
        return {
            'data_source' : "yahoo",
            'company' : request.data.get("company"),
            'sql' : request.data.get("sql"),
            'start' : today - dt.timedelta(previous),
            'end' : today
        }

class SaveCommand(APIView):

    def post(self, request):
        print(request.data)
        serializer = SaveFavoriteCommandSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data = MESSAGES.SUCCESS_DATA_SAVED, status=status.HTTP_200_OK)
        return Response(data = MESSAGES.FAIL_DATA_NOT_SAVED, status=status.HTTP_400_BAD_REQUEST)

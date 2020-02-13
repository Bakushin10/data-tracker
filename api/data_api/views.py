from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
import json
import requests
import pytz

# data
import datetime as dt
import matplotlib.pyplot as plt
from matplotlib import style
import pandas as pd
import pandas_datareader.data as web


class Data_Api(APIView):

    def post(self, request):
        print("here")
        print(request.data)
        return Response(data = "data not saved", status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        print("GET")
        stockData = self.get_stock_data()
        # , content_type = "application/json"
        return Response(data = stockData)

    def get_stock_data(self):
        style.use('ggplot')
        previous = 10

        end = dt.date.today()
        start = end - dt.timedelta(previous)

        df = web.DataReader("TSLA", data_source = "yahoo", start = start, end = end)
        return df.head(10)
        



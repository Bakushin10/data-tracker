from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
import json
import requests
import pytz
import os

from .serializers import SaveFavoriteCommandSerializer
from .models import FavoriteCommand
from .adaptors import *

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

    def __init__(self):
        self.result = ""

    def post(self, request, **args):
        print("##")
        print(request.data.get("saveCSV"))
        print(self.result)
        print(type(self.result))
        print("##")
        # if request.data.get("saveCSV"):
        #     res = self.save_csv()
        #     return Response(data = "csv saved!", status=res)


        result = self.get_stock_data(request)
        if result.get("status") == CONST.SUCCESS:
            return Response(data = result.get("data"), status=status.HTTP_200_OK)
        return Response(data = result.get("message"), status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            data = FavoriteCommand.objects.all()
            serializer = SaveFavoriteCommandSerializer(data, many=True)

            print(serializer.data)
            for data in serializer.data:
                company = data.get("company")
                data["company"] = company.replace("[", "").replace("]", "").replace("'", "").split(", ")

            return Response(data = serializer.data)
        except:
            return Response(data = MESSAGES.FAIL_DATA_NOT_FETCHED, status=status.HTTP_400_BAD_REQUEST)

    def save_csv(self):
        date_dir, filename = str(dt.datetime.now(JST)).split(" ")
        path = PATH_TO_CSV + "/" + date_dir + "/"
        filename = path + filename + ".csv"
        print("--------")
        print(self.result)
        print("--------")
        if not os.path.exists(path):
            os.makedirs(path)
        self.result.to_csv(filename)
        return status.HTTP_200_OK

    def add_new_row(self, df, items):
        new_rows = CONST.ROWS
        for i in range(len(new_rows)):
            df[new_rows[i]] = items[i]
        return df

    def get_df(self, data):

        dfs = []
        for company in data.get("company"):
            df = web.DataReader(
                company,
                data_source = data.get("data_source"),
                start = data.get("start"),
                end = data.get("end")
            )
            items = [company]
            self.add_new_row(df, items)
            dfs.append(df)
        df = pd.concat(dfs)
        print(df.head())
        return df

    def get_stock_data(self, request):
        style.use('ggplot')
        data = stock_info_adaptor(request)
        print(data)

        sql = data.get("sql")
        df = self.get_df(data)
        df2 = data.get("csvFile")
        
        self.result = sqldf(sql, locals())
        print("*** after sql ***")
        print(type(self.result))
        print(self.result)
        #self.result.to_csv(PATH_TO_CSV + "file.csv")

        if request.data.get("saveCSV"):
            self.save_csv()
            #self.result.to_csv(PATH_TO_CSV + "/file.csv")
        
        sdf = self.result.head(10).to_json(orient='split')
        print(type(sdf))
        print(sdf)
        #return Response(data = "csv saved!", status=res)
        return stock_data_result_adaptor(status = CONST.SUCCESS, data = sdf)
        # except:
        #     return stock_data_result_adaptor(status = CONST.FAIL, message = MESSAGES.SQL_ERROR)
    

class SaveCommand(APIView):

    def post(self, request):
        print(request.data)
        data = input_adaptor(request.data)
        serializer = SaveFavoriteCommandSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            return Response(data = MESSAGES.SUCCESS_DATA_SAVED, status=status.HTTP_200_OK)
        return Response(data = MESSAGES.FAIL_DATA_NOT_SAVED, status=status.HTTP_400_BAD_REQUEST)
    
    
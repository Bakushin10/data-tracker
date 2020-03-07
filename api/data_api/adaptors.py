import datetime as dt
import pandas as pd
from abc import ABC, abstractmethod

class Adaptor(ABC):
    @abstractmethod
    def adapt(self, request):
        pass
    
    @abstractmethod
    def set_adaptee(self):
        pass

class Stock_info_adaptor_class(Adaptor):

    def set_adaptee(self, request):
        today = dt.date.today()
        previous = request.data.get("period", 10)

        self.data_source = "yahoo"
        self.company = request.data.get("company")
        self.sql = request.data.get("sql")
        self.start = today - dt.timedelta(previous)
        self.end = today
        self.csvFile = convert_str_to_list_csv(request.data.get("csvFile"))

    def adapt(self, request):

        self.set_adaptee(request)
        return {
            'data_source' : self.data_source,
            'company' : self.company,
            'sql' : self.sql,
            'start' : self.start,
            'end' : self.end,
            'csvFile' : self.csvFile
        }

class Input_adaptor_class(Adaptor):

    def set_adaptee(self, request):
        self.name = request.get('name')
        self.company = str(request.get('company'))
        self.sql = request.get("sql")
        self.previous_period = request.get('previous_period')

    def adapt(self, request):
        return {
            'name': self.name,
            'company': self.company,
            'sql': self.sql,
            'previous_period': self.previous_period
        }


def convert_str_to_list_csv(csv):
    """
        convert string data to panda data frame
    """
    if not csv:
        return None
    csv_data = csv.replace("'","").split("\n")
    formatted_data = [data.split(",") for data in csv_data]
    col = formatted_data[0] # list of names for each value
    values = formatted_data[1:-1] # remove the last element in the list, which is empty
    return pd.DataFrame(values, columns=col)


def stock_data_result_adaptor(status, data = "", message = ""):
    """
        adapt return value to front
    """
    return{
        "data" : str(data),
        "status" : status,
        "message" : message
    }


def input_adaptor(input):
    """
        adaptor for SaveCommand 
    """
    return{
        'name': input.get('name'),
        'company': str(input.get('company')),
        'sql': input.get('sql'),
        'previous_period': input.get('previous_period')
        }

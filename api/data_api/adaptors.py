import datetime as dt
import pandas as pd

def stock_info_adaptor(request):
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
        'end' : today,
        'csvFile' : convert_str_to_list_csv(request.data.get("csvFile"))
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

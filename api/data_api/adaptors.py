import datetime as dt

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
        convert string data to list to adapt panda data frame
    """
    if not csv:
        return None
    csv_data = csv.replace("'","").split("\n")
    return [data.split(",") for data in csv_data]


def stock_data_result_adaptor(status, data = "", message = ""):
    """
        adapt return value to front
    """
    return{
        "data" : data,
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
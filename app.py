from flask import Flask,render_template,request
from markupsafe import escape
import json, pickle, random
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
app = Flask(__name__, static_folder='static')

def gen_random_date():
    start_date = datetime(2022, 1, 1)
    end_date = datetime(2022, 12, 31)
    days_diff = (end_date - start_date).days

    # Generate a random number of days to add to the start date
    random_days = random.randint(0, days_diff)

    # Add the random number of days to the start date to get a random date
    random_date = start_date + timedelta(days=random_days)
    return random_date.strftime("%Y-%m-%d")

def build_range_data(df, group_value,index = 0):
    data = []
    for step,df_split in df.groupby(group_value):
        volume=round(df_split["amount"].sum(),2)
        high_value = round(df_split["amount"].max(),2)
        low_value = round(df_split["amount"].min(),2)
        if low_value < 0:
            low_value = -low_value
        if high_value < 0:
            high_value = -high_value
        if low_value == high_value:
            high_value += 0.1
        if volume > 0:
            color = '#f52a34'
        else:
            color = '#2cb51d'
        tmp = {"date":step,"high":high_value,"low":low_value,"volume":volume,"transNum":df_split.shape[0],"color":color }
        data.append(tmp)
    data = sorted(data, key=lambda x: x['date'])
    return data

def get_week_first_day(date_string):
    date_obj = datetime.strptime(date_string, "%Y-%m-%d")
    # week_number = date_obj.isocalendar()[1]
    first_day = date_obj - timedelta(days=date_obj.weekday())
    return first_day.strftime("%Y-%m-%d")

def get_month(date_string):
    return date_string[:-3]

def create_dict_from_list(list_of_dicts, key):
    dictionary = {}
    for item in list_of_dicts:
        dictionary[item[key]] = item
    return dictionary

def gen_sample_data(sample, build_data,index = 0):
    sample = [[gen_random_date(),i] for i in sample]
    sample_df = pd.DataFrame(sample,columns=['date','amount'])
    sample_df['week'] = sample_df['date'].apply(get_week_first_day)
    sample_df['month'] = sample_df['date'].apply(get_month)
    data = {
        "dataDay":build_data(sample_df, group_value='date',index=index), 
        "dataWeek" : build_data(sample_df, group_value='week',index=index), 
        "dataMonth":build_data(sample_df, group_value='month',index=index)
    }
    data_json = json.dumps(data)
    return data_json

with open('data/transaction_data.pkl', 'rb') as file:
    transaction_data = pickle.load(file)
transaction_data_dict = create_dict_from_list(transaction_data,'party_number')


@app.route("/")
def index():
    sample = transaction_data_dict["P00000"]['tx_currency_amount']

    data_json = gen_sample_data(sample, build_range_data)

    return render_template('index.html', data = data_json)

@app.route('/search', methods=['GET'])
def search():
    id = request.args.get('id') 
    sample = transaction_data_dict[id]['tx_currency_amount']

    data_json = gen_sample_data(sample,build_range_data)
    return render_template('index.html', data = data_json)

@app.route('/compare/<sample_list>')
def compare(sample_list):
    samples = sample_list.split(',')
    if len(samples) == 2:
        data_list = []
        for index,id in enumerate(samples):
            sample = transaction_data_dict[id]['tx_currency_amount']
            data_json = gen_sample_data(sample,build_range_data,index)
            data_list.append(data_json)
        return render_template('compare.html', data1_dict = data_list[0], data2_dict = data_list[1])
    else:
        return "Input error", 404
    
@app.errorhandler(404)
def page_not_found(error):
    return "Page not found", 404
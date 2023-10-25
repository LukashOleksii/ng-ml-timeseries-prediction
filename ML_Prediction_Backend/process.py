import joblib
import pandas as pd
import numpy as np
import json
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime
from sklearn.preprocessing import PolynomialFeatures

import missingno as msno
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
# import tensorflow as tf
# from tensorflow.keras.models import Sequential
# from tensorflow.keras.layers import Dense, Dropout
# from tensorflow.keras.layers import LSTM, Conv1D
# from tensorflow.python.keras.layers import Dense, LSTM, Flatten
# from tensorflow.python.keras.layers.convolutional import Conv1D, MaxPooling1D
# from tensorflow.keras import optimizers

from sklearn.metrics import mean_squared_error, mean_absolute_error

SENSORS_LABELS = ['Engine Temperature', 'Engine RPM', 'Fuel Consumption', 'Hydraulic Flow Rate', 'Hydraulic Pressure', 'Hydraulic Temperature', 'Voltage Supply', 'Current Draw', 'Battery Voltage', 'Brake Pressure', 'Transmission Temperature', 'Brake Temperature',
                  'Coolant Flow Rate','Emission Levels (e.g., CO, NOx, SOx)', 'Fuel Pressure', 'Lubricant Pressure', 'Lubricant Temperature', 'Radiator Temperature', 'Exhaust Temperature (Post-CAT)', 'Exhaust Temperature (Pre-CAT)', 'Exhaust Gas Flow Rate',
                  'Air Intake Temperature', 'Air Flow Rate', 'Steering Pressure', 'Oil Temperature', 'Oil Pressure', 'Air Pressure', 'Torque (Engine)', 'Torque (Drive Train)', 'Fluid hydraulic Rate', 'Transmission Oil Pressure', 'Transmission Oil Temperature',
                  'Exhaust Gas Temperature', 'Pump Pressure', 'Oxygen Content', 'Fuel Flow Rate (for accurate consumption monitoring)', 'Cabin Temperature', 'Vibration Level', 'Load Weight', 'Noise Frequency Spectrum', 'Particle Count (e.g., for air quality or filtration monitoring)',
                    'Carbon Dioxide (CO2) Content', 'Bucket Position', 'Bucket Angle', 'Noise Level']

class Process:
  def __init__(self, data):
    self.typeOfWorkDifficulty = data['typeOfWorkDifficulty']
    self.typeOfVehicle = data['typeOfVehicle']
    self.database = pd.read_csv('all_final_data.csv')

  def predict(self):
    pass
    cnn_sensors_statuses = pd.DataFrame(columns=labels)
    cnn_sensors_predict = pd.DataFrame(columns=labels)
    cnn_statuses_on_percentage = pd.DataFrame(columns=['SENSOR_NAME', 'NORMAL', 'WARNING', 'CRITICAL'])
    cnn_accuracy = pd.DataFrame(columns=['SENSOR_NAME', 'MAE', 'MSE', 'RMSE'])

    model_type = 'CNN'
    for sensor in sensor_labels:
      cnn_sensors_predict[sensor], cnn_statuses_on_percentage.loc[len(cnn_statuses_on_percentage)], cnn_accuracy.loc[len(cnn_accuracy)] = __predict_values(database, cnn_sensors_statuses, model_type, sensor)
    #   cnn_statuses_on_percentage.loc[len(cnn_statuses_on_percentage)] = __check_statuses_on_percentage(cnn_sensors_statuses[sensor], sensor)

    lstm_sensors_statuses = pd.DataFrame(columns=labels)
    lstm_sensors_predict = pd.DataFrame(columns=labels)
    lstm_statuses_on_percentage = pd.DataFrame(columns=['SENSOR_NAME', 'NORMAL', 'WARNING', 'CRITICAL'])
    lstm_accuracy = pd.DataFrame(columns=['SENSOR_NAME', 'MAE', 'MSE', 'RMSE'])


    model_type = 'LSTM'
    for sensor in sensor_labels:
      lstm_sensors_predict[sensor], lstm_statuses_on_percentage.loc[len(lstm_statuses_on_percentage)], lstm_accuracy.loc[len(lstm_accuracy)] = __predict_values(database, lstm_sensors_statuses, model_type, sensor)
    #   lstm_statuses_on_percentage.loc[len(lstm_statuses_on_percentage)] = __check_statuses_on_percentage(cnn_sensors_statuses[sensor], sensor)

    results = {
      "labels" : SENSORS_LABELS,
      "models" : [
        {
          "CNN" : [
            {
              "statusOnPercentage" : cnn_statuses_on_percentage,
              "accuracyDeviation" : cnn_accuracy
            }
          ],
          "LSTM" : [
            {
              "statusOnPercentage" : lstm_statuses_on_percentage,
              "accuracyDeviation" : lstm_accuracy
            }
          ]
        }
      ]
    }

    return json.dumps(results)

  def __predict_values(data, sensors_statuses, model, sensor, model_type):
    model = joblib.load(f'{model_type}_sensors_models/{sensor}_{model_type}_model.sav') ###
    split_d = data[['Date',  sensor]].copy()
    for_train = split_d[-20000:-2000]
    for_predict = split_d[-2000:]

    for_train.index = pd.to_datetime(for_train['Date'])
    del for_train['Date']

    for_predict.index = pd.to_datetime(for_predict['Date'])
    del for_predict['Date']

    window = 5
    lag_size = 60

    predict_series = __series_to_supervised(for_predict, window=window, lag=lag_size)
    series = predict_series.drop(f'{sensor}(x+{lag_size})', axis=1)
    X_pred = series.values.reshape((series.shape[0], series.shape[1], 1))

    pred = model.predict(X_pred).flatten()

    predict = for_predict.copy()

    predict[sensor][(window * lag_size) : (window * lag_size + len(pred)) ] = pred

    check_model_accuracy = __check_accuracy(for_predict, predict[sensor])

    sensors_percentage_statuses = __check_status_sensor_pp2(split_d, predict, sensor)

    __pp2(for_train, split_d, sensor, predict, model_type) ###

    return predict, sensors_percentage_statuses, check_model_accuracy

    #  ###

  def __series_to_supervised(data, window=1, lag=1, dropnan=True):
    cols, names = list(), list()

    for i in range(window, 0, -1):
      cols.append(data.shift(i*lag))
      names += [('%s(x-%d)' % (col, i)) for col in data.columns]

    cols.append(data)
    names += [('%s(x)' % (col)) for col in data.columns]

    cols.append(data.shift(-lag))
    names += [('%s(x+%d)' % (col, lag)) for col in data.columns]

    agg = pd.concat(cols, axis=1)
    agg.columns = names

    if dropnan:
      agg.dropna(inplace=True)

    return agg

  def __pp2(data, data_original, sensor, predicted, model_type, k = 1, lag = 0):
    mean = data_original[sensor].mean()
    std = data_original[sensor].std()

    plt.figure(figsize=(24,8))

    plt.plot(data[sensor], color='grey',label='Current value')
    plt.plot(predicted[sensor][lag:], color='blue',label='Predicted value')

    plt.axhline(y = mean+2*std*k + std*k, color = 'red', linestyle = '--', label='Critical values line')
    plt.axhline(y = mean+2*std*k, color = 'orange', linestyle = '--', label='Warning line')

    plt.axhline(y = mean-2*std*k, color = 'orange', linestyle = '--')
    plt.axhline(y = mean-2*std*k - std*k, color = 'red', linestyle = '--')

    plt.xlabel('Date and Time')
    plt.ylabel('Sensor Reading')
    plt.title(sensor)
    plt.legend(loc='best')

    plt.savefig(f'{model_type}/{sensor}.png')
    plt.close(fig)

    # plt.show()

  def __check_status_sensor_pp2(data, predicted, sensor, k = 1):
    mean = data[sensor].mean()
    std = data[sensor].std()

    status_sensor = []

    for i in range(len(predicted[sensor])):
      if predicted[sensor][i] >= (mean-2*std*k) and predicted[sensor][i] <= (mean+2*std*k):
        status_sensor.append('NORMAL')
      elif (predicted[sensor][i] >= (mean+2*std*k) and predicted[sensor][i] < (mean+2*std*k + std*k)) or (predicted[sensor][i] > (mean-2*std*k - std*k) and predicted[sensor][i] <= (mean-2*std**k)):
        status_sensor.append('WARNING')
      else:
        status_sensor.append('CRITICAL')

    statuses_on_percentage = __check_statuses_on_percentage(status_sensor, sensor)

    return statuses_on_percentage

  def __check_statuses_on_percentage(data, sensor):
    normal_count = sum(1 for status in data[sensor] if status == "NORMAL")
    warning_count = sum(1 for status in data[sensor] if status == "WARNING")

    total = len(data)

    percentage_normal = (normal_count / total) * 100
    percentage_warning = (warning_count / total) * 100
    percentage_critical = (total - normal_count - warning_count) / total * 100

    print(f"______SENSOR: {sensor}___________")
    print(f"Percentage of NORMAL: {percentage_normal:.2f}%")
    print(f"Percentage of WARNING: {percentage_warning:.2f}%")
    print(f"Percentage of CRITICAL: {percentage_critical:.2f}%")
    print('________________________________________________________\n')

    data_percentage = {
      'SENSOR_NAME' : sensor,
      'NORMAL' : f'{percentage_normal:.2f}%',
      'WARNING' : f'{percentage_warning:.2f}%',
      'CRITICAL' : f'{percentage_critical:.2f}%'
    }

    return data_percentage

  def __check_accuracy(real_data, predicted_data):

    data_accuracy = {
      'SENSOR_NAME' : sensor,
      'MAE' : f'{mean_absolute_error(real_data, predicted_data):.4f}%',
      'MSE' : f'{mean_squared_error(real_data, predicted_data):.4f}%',
      'RMSE' : f'{np.sqrt(mean_squared_error(real_data, predicted_data)):.4f}%'
    }

    return data_accuracy

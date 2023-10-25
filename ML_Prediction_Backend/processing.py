import joblib
import pandas as pd
import numpy as np
import json
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime
from sklearn.preprocessing import PolynomialFeatures

class Processing:

  def __init__(self, data):
    self.vehicleType = data['vehicleType']
    self.values = data['fields']
    self.deviations = json.load(open('deviations.json'))

  def predict(self):
    return json.dumps(list({'RETURN'}))

    model_name = self.vehicleType
    deviations = self.deviations

    df = self.dataframe_columns(model_name, self.values)

    df = self.prepare_for_predict(df, model_name)

    scaler = joblib.load(f'models/{model_name}/scaler_{model_name}.sav')
    NN_model = joblib.load(f'models/{model_name}/NN_model_{model_name}.sav')
    LR_model = joblib.load(f'models/{model_name}/LinearRegression_{model_name}.sav')
    PL_model = joblib.load(f'models/{model_name}/PolynomialRegression_{model_name}.sav')
    DT_model = joblib.load(f'models/{model_name}/DecisionTreeRegressor_{model_name}.sav')
    RF_model = joblib.load(f'models/{model_name}/RandomForestRegressor_{model_name}.sav')

    if model_name == 'Mini_excavators':
      PL = int(PL_model.predict(PolynomialFeatures(degree=4).fit_transform(df)))
    elif model_name == 'Telehandlers':
      PL = int(PL_model.predict(PolynomialFeatures(degree=3).fit_transform(df)))
    else:
      PL = int(PL_model.predict(PolynomialFeatures(degree=5).fit_transform(df)))

    results = {
      "result": [
        {
          "modelName": "Neural Network",
          "price": int(scaler.inverse_transform(NN_model.predict(np.asarray(df).astype('float32')))),
          "deviation": deviations[model_name]['Neural Network']
        },
        {
          "modelName": "Linear Regression",
          "price": int(LR_model.predict(df)),
          "deviation":  deviations[model_name]['Linear Regression']
        },
        {
          "modelName": "Polynomial Regression",
          "price": PL,
          "deviation": deviations[model_name]['Polynomial Regression']
        },
        {
          "modelName": "Decision Tree Regressor",
          "price": int(DT_model.predict(df)),
          "deviation": deviations[model_name]['Decision Tree Regressor']
        },
        {
          "modelName": "Random Forest Regressor",
          "price": int(RF_model.predict(df)),
          "deviation": deviations[model_name]['Random Forest Regressor']
        }
      ]
    }

    return json.dumps(results)

  def dataframe_columns(self, vehicleType, data):
    if vehicleType == "Tractors":
      columns = ['original_manufacturer', 'model version', 'operating_hours',
         'year_of_manufacture', 'country', 'driver_pneumatic_seat', 'max_speed',
         'hydraulic_front_equipment', 'all_wheel_drive', 'suspended_front_axle',
         'power_output(kw)']
    elif vehicleType == "Skit_steer_loaders":
      columns = ['original_manufacturer', 'model version', 'weight_t',
         'ratedoperatingcapacity_kg', 'country', 'bucketwidth_m',
         'driverprotection', 'steeringmode', 'maxdischargeheight_m',
         'liftingforce_kn', 'operating_hours', 'age_in_months']
    elif vehicleType == "Mini_excavators":
      columns = ['original_manufacturer', 'model version', 'weight_t',
         'bucketcapacity_mÂł', 'trackwidth_mm', 'country',
         'maxreachhorizontal_m', 'dredgingdepth_m', 'tearoutforce_kn',
         'enginepower_kw', 'operating_hours', 'year_of_manufacture']
    elif vehicleType == "Telehandlers":
      columns = ['original_manufacturer', 'model version', 'Nominalloadatcog t',
         'Maxreachhorizontal m', 'country', 'Capacityatfullforwardreach t',
         'Liftingheight m', 'Capacityatfulllifthight t', 'Weight t',
         'Operating hours', 'Year of manufacture']

    dataframe = pd.DataFrame(columns = columns)
    arr = [data[i] for i in columns]

    dataframe = dataframe.append(dict(zip(columns, arr)), ignore_index=True)

    return dataframe


  def prepare_for_predict(self, dataframe, vehicleType):
    dataframe = dataframe.drop(columns=['original_manufacturer', 'model version', 'country'])

    for i in dataframe:
      dataframe[i] = dataframe[i].astype(float)


    if vehicleType == "Skit_steer_loaders":

      for i in ['driverprotection','steeringmode']:
        label_encoder = joblib.load(f'models/{vehicleType}/{i}_labelEncoder_{vehicleType}.sav')
        dataframe[i] = label_encoder.transform(dataframe[i])


      dataframe['age_in_months'] = int((datetime.today().year - 1 - dataframe['age_in_months']) * 12 + datetime.today().month)

    return dataframe
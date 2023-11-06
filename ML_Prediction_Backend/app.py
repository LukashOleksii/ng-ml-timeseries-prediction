from flask import Flask, json, jsonify, request
from flask_cors import CORS
from processing import Processing
from process import Process

app = Flask(__name__)

cors = CORS(app, resources={r"*": {"origins": "*"}})

@app.route('/')
def home():
    return 'Hello, Flask!'

@app.route('/hello')
def hello():
    return 'Hello, Hello!'

@app.route('/prediction', methods=["POST"])
def prediction():
    # response = Process(request.json).predict()
    response = jsonify(json.load(open('results.json')))

    return response


@app.route('/models',methods=["GET"])
def models():

    MlPredictionInput = jsonify(json.load(open('structure.json')))


    return MlPredictionInput


if __name__ == '__main__':
   app.run()

from flask import Flask, render_template, jsonify, redirect
from pymongo import MongoClient
#from ipynbfiledconverted import the function

app = Flask(__name__)
conn = 'mongodb://localhost:27017'
client = MongoClient(conn)
db = client.planets_db

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/bubble")
def bubble():
    return render_template("bubble_chart.html")

@app.route("/distance")
def distance():
    return render_template("distance_earth.html")

# @app.route("/data")
# def data():


if __name__ == "__main__":
    app.run(debug=True, port=9000)
from flask import Flask, jsonify
from flask_cors import CORS
from PandasLogic import process_data

app = Flask(__name__)
CORS(app, origins="*")

@app.route('/api/processed-data', methods=['GET'])
def get_processed_data():
    data = process_data()  # Get data from PandasLogic
    return jsonify(data)  # Return data as JSON

if __name__ == '__main__':
    app.run(debug=True, port=8080)

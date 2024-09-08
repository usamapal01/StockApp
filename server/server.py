from flask import Flask, jsonify, request
from flask_cors import CORS
from PandasLogic import process_data

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins (restrict this to specific origins if needed)

# In-memory storage
sku_storage = []

@app.route('/api/processed-data', methods=['GET'])
def get_processed_data():
    # Use the in-memory storage to process data
    data = process_data(sku_storage)
    return jsonify(data)

@app.route('/api/update-display-items', methods=['POST'])
def update_display_items():
    global sku_storage
    sku_data = request.json.get('skus', [])
    sku_storage = sku_data  # Store SKUs in-memory
    return jsonify({'message': sku_data})

if __name__ == '__main__':
    app.run(debug=True, port=8080)

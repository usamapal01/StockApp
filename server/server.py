from flask import Flask, jsonify, request
from flask_cors import CORS
from PandasLogic import process_data

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins (restrict this to specific origins if needed)

# In-memory storage
display_storage = []
item_storage = []


@app.route('/api/processed-data', methods=['GET'])
def get_processed_data():
    # Use the in-memory storage to process data
    data = process_data(display_storage, item_storage)
    return jsonify(data)

@app.route('/api/update-display-items', methods=['POST'])
def update_display_items():
    global display_storage
    display_data = request.json.get('skus', [])
    display_storage = display_data  # Store SKUs in-memory
    return jsonify({'message': display_data})

@app.route('/api/update-stock-items', methods=['POST'])
def update_stock_items():
    global item_storage
    stock_data = request.json.get('skus', [])
    item_storage = stock_data  # Store SKUs in-memory
    return jsonify({'message': stock_data})

if __name__ == '__main__':
    app.run(debug=True, port=8080)

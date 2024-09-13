from flask import Flask, jsonify, request, g
from flask_cors import CORS
from PandasLogic import process_data, process_master_data

app = Flask(__name__)
frontend_url = "https://jdotstock.netlify.app/"  
CORS(app, resources={r"/*": {"origins": frontend_url}})

# In-memory storage
display_storage = []
item_storage = []
master_df = None  # Global variable to hold the DataFrame

@app.route('/api/upload', methods=['POST'])
def upload_file():
    global master_df

    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    df = process_master_data(file)  # Now only one value is returned
    print("Master Data after columns dropped\n", df)
    if df is None:
        return jsonify({'error': 'Failed to process the file'}), 500

    # Store the processed DataFrame in Flask's `g` for current request
    master_df = df
    print("gmaster\n", master_df)
    return jsonify({'message': 'Data Ready'}), 200


@app.route('/api/processed-data', methods=['GET'])
def get_processed_data():
    global master_df  # Access the global DataFrame variable

    if master_df is None:
        return jsonify({'error': 'No data uploaded yet'}), 400

    # Use the in-memory storage to process data
    data = process_data(master_df, display_storage, item_storage)
    return jsonify(data), 200


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
    app.run()

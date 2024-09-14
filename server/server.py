import os
from flask import Flask, jsonify, request, g
from flask_cors import CORS
from dotenv import load_dotenv  # Import dotenv to load env variables
from PandasLogic import process_data, process_master_data

# Load environment variables from the .env file
load_dotenv()

app = Flask(__name__)
frontend_url = "https://jdotstock.netlify.app/"  
CORS(app, resources={r"/*": {"origins": "*"}})

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
    print("Master Data\n", df)
    if df is None:
        return jsonify({'error': 'Failed to process the file'}), 500

    master_df = df
    return jsonify({'message': 'Data Ready'}), 200


@app.route('/api/processed-data', methods=['GET'])
def get_processed_data():
    global master_df  # Access the global DataFrame variable

    if master_df is None:
        return jsonify({'error': 'No data uploaded yet'}), 400

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
    # Fetch settings from environment variables
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    port = int(os.getenv('FLASK_PORT', 5000))  # Default to port 5000 if not set

    print(f"Port is listening on {port} and debug is {debug}")
    app.run(debug=debug, port=port)

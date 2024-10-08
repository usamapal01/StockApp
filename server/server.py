import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv  # Import dotenv to load env variables
from PandasLogic import process_size_count, process_data, process_master_data, size_Qty

# Load environment variables from .env file if it exists
if os.path.exists('.env'):
    load_dotenv()

app = Flask(__name__)
frontend_url = "https://jdotstock.netlify.app/"  
# CORS(app, resources={r"/*": {"origins": "*"}})
# Only allow requests from your Netlify frontend
CORS(app, resources={r"/*": {"origins": frontend_url}})

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'https://jdotstock.netlify.app'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    return response


# In-memory storage based on store names
store_data = {}

# Helper function to get store-specific data
def get_store_data(store_name):
    if store_name not in store_data:
        store_data[store_name] = {
            'display_storage': [],
            'item_storage': [],
            'master_df': None
        }
    return store_data[store_name]


@app.route('/api/upload/<store_name>', methods=['POST', 'OPTIONS'])
def upload_file(store_name):  # Accept store_name directly as an argument

    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200  # Respond to preflight request
    
    # No need to use request.view_args or request.args
    if not store_name:
        return jsonify({'error': 'Store name is required'}), 400

    store_info = get_store_data(store_name)

    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    df = process_master_data(file)
    if df is None:
        return jsonify({'error': 'Failed to process the file'}), 500

    store_info['master_df'] = df  # Store the master DataFrame for the store
    return jsonify({'message': 'Data Ready'}), 200



@app.route('/api/processed-data', methods=['GET'])
def get_processed_data():
    store_name = request.args.get('store')  # Store name passed as a query parameter
    if not store_name:
        return jsonify({'error': 'Store name is required'}), 400

    store_info = get_store_data(store_name)

    if store_info['master_df'] is None:
        return jsonify({'error': 'No data uploaded yet'}), 400

    data = process_data(store_info['master_df'], store_info['display_storage'], store_info['item_storage'])
    return jsonify(data), 200


@app.route('/api/update-display-items', methods=['POST'])
def update_display_items():
    store_name = request.args.get('store')  # Store name passed as a query parameter
    if not store_name:
        return jsonify({'error': 'Store name is required'}), 400

    store_info = get_store_data(store_name)
    display_data = request.json.get('skus', [])
    store_info['display_storage'] = display_data  # Store SKUs in-memory for the specific store
    return jsonify({'message': display_data})


@app.route('/api/size-id-count', methods=['GET'])
def get_size_id_count():
    store_name = request.args.get('store')  # Store name passed as a query parameter
    if not store_name:
        return jsonify({'error': 'Store name is required'}), 400

    store_info = get_store_data(store_name)

    if store_info['display_storage'] is None:
        return jsonify({'error': 'No data uploaded yet'}), 400

    size_id_counts = process_size_count(store_info['display_storage'], store_info['master_df'])
    return jsonify(size_id_counts), 200


@app.route('/api/update-stock-items', methods=['POST'])
def update_stock_items():
    store_name = request.args.get('store')  # Store name passed as a query parameter
    if not store_name:
        return jsonify({'error': 'Store name is required'}), 400

    store_info = get_store_data(store_name)
    stock_data = request.json.get('skus', [])
    store_info['item_storage'] = stock_data  # Store SKUs in-memory for the specific store
    return jsonify({'message': stock_data})


@app.route('/api/size-check', methods=['GET'])
def size_check():
    store_name = request.args.get('store')  # Store name passed as a query parameter
    print(store_name)
    if not store_name:
        return jsonify({'error': 'Store name is required'}), 400

    store_info = get_store_data(store_name)

    # Get the barcode from query params
    barcode = request.args.get('barcode')
    if not barcode:
        return jsonify({'error': 'No barcode provided'}), 400

    if store_info['master_df'] is None:
        return jsonify({'error': 'No master data available. Please upload.'}), 400

    size_data = size_Qty([barcode], store_info['master_df'])

    if not size_data:
        return jsonify({'error': 'No data found for the given barcode'}), 404

    return jsonify(size_data), 200


if __name__ == '__main__':
    # Check if running on Render (production) or locally (development)
    if 'RENDER' in os.environ:
        # Production environment: Use the port provided by Render
        port = int(os.environ.get('PORT'))  # Render sets this environment variable
        debug = False  # Disable debug in production
    else:
        # Local development: Use settings from .env file
        debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
        port = int(os.getenv('FLASK_PORT', 8080))  # Default to 8080 for local

    app.run(port=port, debug=debug)

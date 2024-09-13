from flask import Flask, jsonify, request, session, g
from flask_cors import CORS
from PandasLogic import process_data, process_master_data
import os
from dotenv import load_dotenv  # Add this import

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Allow all origins for CORS (restrict this in production)
frontend_url = "https://jdotstock.netlify.app/"
CORS(app, resources={r"/*": {"origins": "*"}})

# Set a secret key for session management
app.secret_key = os.environ.get('SECRET_KEY', 'fallbacksupersecretkey')  # Corrected here


# Helper function to initialize session variables
def initialize_session():
    if 'display_storage' not in session:
        session['display_storage'] = []
    if 'item_storage' not in session:
        session['item_storage'] = []
    if 'master_df' not in session:
        session['master_df'] = None

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    df = process_master_data(file)

    if df is None:
        return jsonify({'error': 'Failed to process the file'}), 500

    g.master_df = df  # Store in-memory only for the current request
    return jsonify({'message': 'Data Ready'}), 200


@app.route('/api/processed-data', methods=['GET'])
def get_processed_data():
    initialize_session()

    master_df = session.get('master_df')
    print("master_df in session: ", session.get('master_df'))


    if master_df is None:
        return jsonify({'error': 'No data uploaded yet or session expired. Please upload a file first.'}), 400

    # Convert master_df back from dict to DataFrame for processing
    data = process_data(pd.DataFrame.from_dict(master_df), session['display_storage'], session['item_storage'])
    return jsonify(data), 200



@app.route('/api/update-display-items', methods=['POST'])
def update_display_items():
    initialize_session()

    display_data = request.json.get('skus', [])
    session['display_storage'] = display_data  # Store SKUs in session storage
    return jsonify({'message': display_data})


@app.route('/api/update-stock-items', methods=['POST'])
def update_stock_items():
    initialize_session()

    stock_data = request.json.get('skus', [])
    session['item_storage'] = stock_data  # Store SKUs in session storage
    return jsonify({'message': stock_data})


if __name__ == '__main__':
    app.run()

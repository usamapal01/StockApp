from flask import Flask, jsonify, request, session, g
from flask_cors import CORS
from PandasLogic import process_data, process_master_data
import os
import pandas as pd
import uuid  # For generating unique session IDs
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

frontend_url = "https://jdotstock.netlify.app/"
CORS(app, resources={r"/*": {"origins": "*"}})

app.secret_key = os.environ.get('SECRET_KEY', 'fallbacksupersecretkey')

# Global dictionary to hold user-specific master_df
data_store = {}

# Helper function to initialize session variables
def initialize_session():
    if 'display_storage' not in session:
        session['display_storage'] = []
    if 'item_storage' not in session:
        session['item_storage'] = []
    if 'session_id' not in session:
        session['session_id'] = str(uuid.uuid4())  # Generate a unique session ID

@app.route('/api/upload', methods=['POST'])
def upload_file():
    initialize_session()
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    df = process_master_data(file)

    if df is None:
        return jsonify({'error': 'Failed to process the file'}), 500

    # Store the DataFrame in the global data_store
    session_id = session['session_id']
    data_store[session_id] = df  # Store the DataFrame in-memory using the session_id as the key

    return jsonify({'message': 'Data Ready'}), 200

@app.route('/api/processed-data', methods=['GET'])
def get_processed_data():
    initialize_session()

    session_id = session.get('session_id')
    master_df = data_store.get(session_id)

    if master_df is None:
        return jsonify({'error': 'No data uploaded yet or session expired. Please upload a file first.'}), 400

    # Process the data using the display and stock items stored in the session
    data = process_data(master_df, session['display_storage'], session['item_storage'])
    
    return jsonify(data), 200

@app.route('/api/update-display-items', methods=['POST'])
def update_display_items():
    initialize_session()

    display_data = request.json.get('skus', [])
    session['display_storage'] = display_data  # Store SKUs in session storage
    return jsonify({'message': 'Display items updated successfully.'})

@app.route('/api/update-stock-items', methods=['POST'])
def update_stock_items():
    initialize_session()

    stock_data = request.json.get('skus', [])
    session['item_storage'] = stock_data  # Store SKUs in session storage
    return jsonify({'message': 'Stock items updated successfully.'})

if __name__ == '__main__':
    app.run()

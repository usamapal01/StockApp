import pandas as pd
from io import BytesIO

def process_master_data(file):
    try:
        df = pd.read_excel(BytesIO(file.read()))  # If it's an Excel file
        return df  # Only return the DataFrame
    except Exception as e:
        return None  # Return None on error

def process_data(df, display_storage=None, item_storage=None):
    # Retain only necessary columns from master data
    df = df.drop(df.columns.difference(['Item Id', 'Item Name', 'Color ID', 'Size ID', 'Retail Rate', 'Barcode']), axis=1)
    print("Master Data\n", df)

    # Create DataFrame from in-memory SKU storage
    df2 = pd.DataFrame(display_storage, columns=['Barcode'])
    df3 = pd.DataFrame(item_storage, columns=['Barcode'])

    # Merge based on 'Barcode'
    updated_df2 = df.merge(df2, how='right', on='Barcode')
    updated_df3 = df.merge(df3, how='right', on='Barcode')
    updated_df3 = updated_df3.astype(object)
    updated_df3.fillna("Not Found", inplace=True)
    
    # Compare based on 'Item Id'
    result = updated_df3[~updated_df3['Item Id'].isin(updated_df2['Item Id'])]
    result = result.drop_duplicates(subset=['Item Id'])
    print("Results\n", result)

    return result.to_dict(orient='records')  # Return as dictionary

import pandas as pd
from io import BytesIO

def process_master_data(file):
    try:
        df = pd.read_excel(BytesIO(file.read()))  # If it's an Excel file
        # Data Cleaning
        df = df.drop(df.columns.difference(['Item Id', 'Item Name', 'Color ID', 'Size ID', 'Retail Rate', 'Barcode', 'Physical Qty']), axis=1)

        return df  # Only return the DataFrame
    except Exception as e:
        return None  # Return None on error
    
def process_size_count(display_df, master_df):
    new_df = pd.DataFrame(display_df, columns=['Barcode'])
    count_df = master_df.merge(new_df, how='right', on='Barcode')

    return count_df['Size ID'].value_counts().to_dict()

def size_Qty(barcode_list, master_df):
    results = []

    for barcode in barcode_list:
        # Filter rows where the Barcode matches the given barcode
        item_rows = master_df[master_df['Barcode'] == barcode]
        
        if item_rows.empty:
            continue  # Skip if no matching rows are found
        
        # Get the Item Id for the matched barcode
        item_id = item_rows['Item Id'].iloc[0]

        # Filter all rows with the same Item Id (since different sizes share the same Item Id)
        related_rows = master_df[master_df['Item Id'] == item_id]
        
        # Extract the necessary information for each size
        for _, row in related_rows.iterrows():
            results.append({
                'Size': row['Size ID'],
                'Physical Qty': row['Physical Qty'],
                'Retail Rate': row['Retail Rate']
            })

    return results


    

def process_data(df, display_storage=None, item_storage=None):
    # Retain only necessary columns from master data
    # df = df.drop(df.columns.difference(['Item Id', 'Item Name', 'Color ID', 'Size ID', 'Retail Rate', 'Barcode']), axis=1)
    # print("Master Data in process data\n", df)

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

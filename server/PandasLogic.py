import pandas as pd

def process_data(display_storage=None, item_storage=None):
    # Read the Excel file and retain only the necessary columns
    df = pd.read_excel('MasterStock.xlsx')
    df = df.drop(df.columns.difference(['Item Id', 'Item Name', 'Color ID', 'Size ID', 'Retail Rate', 'Barcode']), axis=1)
    print("Master Data\n", df)

    # Create a DataFrame from the in-memory SKU storage
    # Each SKU in sku_storage should be treated as a new line
    df2 = pd.DataFrame(display_storage, columns=['Barcode'])
    print(df2)

    # Each SKU in sku_storage should be treated as a new line
    df3 = pd.DataFrame(item_storage, columns=['Barcode'])
    print(df3)

    # Merge based on 'Barcode'
    updated_df2 = df.merge(df2, how='right', on='Barcode')
    print(updated_df2)
    updated_df3 = df.merge(df3, how='right', on='Barcode')
    print(updated_df3)

    # Now comparing based on 'Item Id'
    result = updated_df3[~updated_df3['Item Id'].isin(updated_df2['Item Id'])]
    result = result.drop_duplicates(subset=['Item Id'])
    print(result)

    # Return the result as a dictionary
    return result.to_dict(orient='records')

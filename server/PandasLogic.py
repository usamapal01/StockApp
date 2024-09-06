import pandas as pd

def process_data():
    df = pd.read_excel('MasterStock.xlsx') 
    df = df.drop(df.columns.difference(['Item Id', 'Item Name', 'Color ID', 'Size ID', 'Retail Rate', 'Barcode']), axis=1)
    
    df2 = pd.read_csv('DisplayItems.txt', sep=" ")
    df3 = pd.read_csv('StockroomItems.txt', sep=" ")
    
    updated_df2 = df.merge(df2, how='right')
    updated_df3 = df.merge(df3, how='right')
    
    result = updated_df3[~updated_df3['Item Id'].isin(updated_df2['Item Id'])]
    result = result.drop_duplicates(subset=['Item Id'])
    
    return result.to_dict(orient='records')

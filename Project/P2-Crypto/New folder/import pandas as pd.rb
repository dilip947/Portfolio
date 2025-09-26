import pandas as pd
import glob

# Folder containing your CSV files
path = r"C:\Users\DILIP\Desktop\Project\P2-Crypto"
all_files = glob.glob(path + "/*.csv")

df_list = []

for file in all_files:
    # Extract coin name from filename
    coin_name = file.split("\\")[-1].split(".")[0]
    
    # Read CSV
    df = pd.read_csv(file)
    
    # Rename columns to standard names
    df = df.rename(columns={'Price': 'Close', 'Vol.': 'Volume'})
    
    # Keep only required columns
    df = df[['Date', 'Open', 'High', 'Low', 'Close', 'Volume']]
    
    # Add Coin column
    df['Coin'] = coin_name.upper()
    
    df_list.append(df)

# Merge all coins
merged_df = pd.concat(df_list, ignore_index=True)

# Save merged CSV
merged_df.to_csv(path + "\\merged_crypto.csv", index=False)

print("Merged CSV saved as merged_crypto.csv")

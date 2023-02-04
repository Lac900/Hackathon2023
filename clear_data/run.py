import pandas as pd
import preprocess
from pathlib import Path  

df_O = pd.read_csv('./data/actes-criminels.csv') #.sample(n=100000, random_state=1)
df_clear_nan = preprocess.clear_NaN('PDQ',df_O)
df_clear_nan = preprocess.clear_NaN('LATITUDE',df_clear_nan)
df_rename =  preprocess.rename(df_clear_nan)
df_clean = df_rename

filepath = Path('data/clean_data.csv')  
filepath.parent.mkdir(parents=True, exist_ok=True)  
df_clean.to_csv(filepath, index=False)  
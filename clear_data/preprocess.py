import pandas as pd
import numpy as np

TITLES_PDQ = {
    1: 'Baie-D\'Urfé, Beaconsfield, Kirkland, Sainte-Anne-de-Bellevue, Senneville',
    3: 'L\'Île-Bizard, Pierrefonds, Sainte-Geneviève, Roxboro',
    4: 'Dollard-Des Ormeaux', 
    5: 'Dorval, L\'Île-Dorval, Pointe-Claire', 
    7: 'Saint-Laurent', 
    8: 'Lachine, Saint-Pierre',
    9: 'Notre-Dame-De-Grâce, Côte Saint-Luc, Hampstead, Montréal-Ouest',
    10: 'Bordeaux, Cartierville',
    11: 'Notre-Dame-de-Grâce',
    12: 'Ville-Marie Ouest, Westmount', 
    13: 'LaSalle',
    15: 'Saint-Paul, Petite-Bourgogne, Pointe-Saint-Charles, Saint-Henri, Ville-Émard', 
    16: 'Île-des-Sœurs, Verdun', 
    20: 'Centre-ville (Ville-Marie Ouest), parc du Mont-Royal',
    21: 'Centre-ville (Ville-Marie Est), île Notre-Dame, île Sainte-Hélène, Vieux-Montréal',
    22: 'Centre-Sud',
    23: 'Hochelaga-Maisonneuve', 
    24: 'Ville Mont-Royal, Outremont ', 
    26: 'Côte-des-Neiges, Mont-Royal, Outremont',
    27: 'Ahuntsic',
    30: 'Saint-Michel', 
    31: 'Villeray, Parc-Extension', 
    33: 'Parc-Extension', 
    35: 'La Petite-Italie, La Petite-Patrie, Outremont (3 rues)', 
    38: 'Le Plateau-Mont-Royal', 
    39: 'Arrondissement de Montréal-Nord', 
    42: 'Saint-Léonard', 
    44: 'Rosemont - La Petite-Patrie', 
    45: 'Rivière-des-Prairies', 
    46: 'Anjou', 
    48: 'Arrondissement de Mercier—Hochelaga-Maisonneuve', 
    49: 'Ville de Montréal-Est, Pointe-aux-Trembles', 
    50: 'Métro de Montréal', 
    55: 'Aéroport international Pierre-Elliott-Trudeau de Montréal'
}

def clear_NaN(col, df):
    df = df.loc[df[col].notnull()]
    df = df.reset_index(drop=True)
    return df

def rename(df):
    df['PDQ_NOM'] = df['PDQ'].map(TITLES_PDQ)
    print(df)
    return df
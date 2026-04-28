"""
Data processing utilities using Pandas.
Provides helper functions for statistics and data transformation.
"""

import pandas as pd
from models import HealthRecord


def get_records_dataframe():
    """
    Fetch all health records from the database
    and return them as a Pandas DataFrame.
    """
    records = HealthRecord.query.order_by(HealthRecord.date.asc()).all()

    if not records:
        return pd.DataFrame(columns=['id', 'date', 'weight', 'steps', 'calories'])

    data = [r.to_dict() for r in records]
    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date'])
    return df


def compute_statistics(df):
    """
    Compute summary statistics from a DataFrame of health records.
    Returns averages, min/max, and the latest entry.
    """
    if df.empty:
        return {
            'count': 0,
            'average': {'weight': 0, 'steps': 0, 'calories': 0},
            'min': {'weight': 0, 'steps': 0, 'calories': 0},
            'max': {'weight': 0, 'steps': 0, 'calories': 0},
            'latest': None,
        }

    # Use Pandas aggregation for clean, vectorized computation
    metrics = ['weight', 'steps', 'calories']

    stats = {
        'count': int(len(df)),
        'average': {
            'weight': round(float(df['weight'].mean()), 2),
            'steps': int(df['steps'].mean()),
            'calories': int(df['calories'].mean()),
        },
        'min': {
            'weight': round(float(df['weight'].min()), 2),
            'steps': int(df['steps'].min()),
            'calories': int(df['calories'].min()),
        },
        'max': {
            'weight': round(float(df['weight'].max()), 2),
            'steps': int(df['steps'].max()),
            'calories': int(df['calories'].max()),
        },
    }

    # Latest entry
    latest = df.sort_values('date', ascending=False).iloc[0]
    stats['latest'] = {
        'date': str(latest['date'].date()) if hasattr(latest['date'], 'date') else str(latest['date']),
        'weight': round(float(latest['weight']), 2),
        'steps': int(latest['steps']),
        'calories': int(latest['calories']),
    }

    return stats

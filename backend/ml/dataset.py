import pandas as pd
import os

# Path to the dataset
DATASET_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "old-backend-standby", "datasets", "movies_metadata.csv"
)

# Global cache
_movies_df = None

def get_movies_df() -> pd.DataFrame:
    global _movies_df
    if _movies_df is not None:
        return _movies_df
        
    try:
        # Load dataset
        # The movies_metadata.csv can have mixed types in some columns, we specify low_memory=False
        df = pd.read_csv(DATASET_PATH, low_memory=False)
        
        # Clean data: drop rows without a title or overview
        df = df.dropna(subset=["original_title", "overview"])
        
        # Keep only necessary columns for recommendations to save memory
        df = df[["id", "original_title", "overview", "genres", "vote_average", "vote_count"]]
        
        # Reset index for easy iloc access
        df = df.reset_index(drop=True)
        
        _movies_df = df
        return _movies_df
    except Exception as e:
        print(f"Failed to load dataset from {DATASET_PATH}: {e}")
        return pd.DataFrame()

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from .dataset import get_movies_df

# Global cache for TF-IDF matrix and vectorizer
_tfidf_matrix = None
_cosine_sim = None
_indices = None

def _initialize_model():
    global _tfidf_matrix, _cosine_sim, _indices
    
    if _cosine_sim is not None:
        return
        
    df = get_movies_df()
    if df.empty:
        return
        
    # We'll use the overview for basic content-based similarity
    # Replace NaN with empty string
    df['overview'] = df['overview'].fillna('')
    
    # Define a TF-IDF Vectorizer
    # Remove all english stop words such as 'the', 'a'
    tfidf = TfidfVectorizer(stop_words='english', max_features=10000)
    
    # Construct the required TF-IDF matrix by fitting and transforming the data
    _tfidf_matrix = tfidf.fit_transform(df['overview'])
    
    # Compute the cosine similarity matrix
    _cosine_sim = linear_kernel(_tfidf_matrix, _tfidf_matrix)
    
    # Construct a reverse map of indices and movie titles
    _indices = pd.Series(df.index, index=df['original_title'].str.lower()).drop_duplicates()

def get_recommendations(title: str, num_recommendations: int = 5) -> list:
    """
    Get top N recommendations based on the movie title.
    Returns a list of dictionaries with movie info.
    """
    _initialize_model()
    
    if _cosine_sim is None or _indices is None:
        return []
        
    title_lower = title.lower()
    
    if title_lower not in _indices:
        # Title not found in dataset
        return []
        
    # Get the index of the movie that matches the title
    idx = _indices[title_lower]
    
    # If there are duplicate titles, take the first one
    if isinstance(idx, pd.Series):
        idx = idx.iloc[0]
        
    # Get the pairwise similarity scores of all movies with that movie
    sim_scores = list(enumerate(_cosine_sim[idx]))
    
    # Sort the movies based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    # Get the scores of the N most similar movies (ignoring the first one which is itself)
    sim_scores = sim_scores[1:num_recommendations+1]
    
    # Get the movie indices
    movie_indices = [i[0] for i in sim_scores]
    
    # Return the top N most similar movies
    df = get_movies_df()
    recommended_movies = df.iloc[movie_indices]
    
    results = []
    for _, row in recommended_movies.iterrows():
        results.append({
            "title": row["original_title"],
            "overview": row["overview"],
            "reason": f"Similar themes to '{title}' based on AI analysis."
        })
        
    return results

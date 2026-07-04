import random

# Maps the 7 basic emotions from face-api.js to a genre or specific vibe.
EMOTION_TO_GENRE_MAP = {
    "happy": ["Comedy", "Adventure", "Family", "Animation"],
    "sad": ["Drama", "Romance", "Comedy", "Feel-Good"],
    "angry": ["Action", "Thriller", "Crime"],
    "fearful": ["Horror", "Mystery", "Thriller"],
    "disgusted": ["Documentary", "Science Fiction", "Mystery"],
    "surprised": ["Mystery", "Fantasy", "Science Fiction", "Thriller"],
    "neutral": ["Drama", "Documentary", "History", "Slice of Life"]
}

# Maps emotions to our specific Jars
EMOTION_TO_JAR_MAP = {
    "happy": "laugh",
    "sad": "sad",
    "angry": "thrill",
    "fearful": "spooky",
    "disgusted": "inspire",
    "surprised": "inspire",
    "neutral": "cozy"
}

def get_recommendation_for_mood(mood: str, df) -> dict:
    """
    Returns a random movie from the dataset that matches the mapped genre for the mood.
    If df is empty, falls back to the in-memory JARS_DATA via EMOTION_TO_JAR_MAP.
    """
    from services.in_memory_jars import JARS_DATA
    
    mood = mood.lower()
    
    # 1. Try to find a movie from the dataset based on Genre mapping
    if df is not None and not df.empty:
        genres = EMOTION_TO_GENRE_MAP.get(mood, ["Drama"])
        
        # Simple filter: check if any of the target genres are in the movie's genres string
        # Since 'genres' in movies_metadata might be JSON or string, we do a basic string match
        df_filtered = df[df['genres'].str.contains('|'.join(genres), case=False, na=False)]
        
        if not df_filtered.empty:
            # Pick a highly rated one randomly to ensure quality
            df_filtered = df_filtered[df_filtered['vote_average'] > 7.0]
            if not df_filtered.empty:
                movie = df_filtered.sample(1).iloc[0]
                return {
                    "title": movie["original_title"],
                    "overview": movie["overview"],
                    "reason": f"Because you are feeling {mood}, we thought a {genres[0]} movie would fit."
                }
    
    # 2. Fallback to Jars data
    jar_id = EMOTION_TO_JAR_MAP.get(mood, "cozy")
    for jar in JARS_DATA:
        if jar["id"] == jar_id:
            if jar["movies"]:
                title = random.choice(jar["movies"])
                return {
                    "title": title,
                    "overview": "A curated pick from our jars.",
                    "reason": f"Since you seem {mood}, we picked this from the {jar['mood']} jar."
                }
                
    return {
        "title": "The Grand Budapest Hotel",
        "overview": "A fallback feel-good movie.",
        "reason": f"We detected {mood}, but our systems are dreaming. Here's a great movie anyway."
    }

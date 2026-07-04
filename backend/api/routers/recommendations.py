from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel
from ml.content_based import get_recommendations

router = APIRouter()

class RecommendationRequest(BaseModel):
    title: str
    limit: int = 5

@router.post("/similar", response_model=List[Dict[str, Any]])
async def get_similar_movies(request: RecommendationRequest):
    """
    Get movie recommendations based on a reference movie title using TF-IDF Content-Based Filtering.
    """
    results = get_recommendations(request.title, request.limit)
    if not results:
        # Fallback if movie isn't in dataset or dataset failed to load
        return [
            {
                "title": "Inception",
                "overview": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
                "reason": "Fallback recommendation due to missing dataset entry."
            }
        ]
        
    return results

class MoodRequest(BaseModel):
    mood: str

@router.post("/mood", response_model=Dict[str, Any])
async def get_mood_movie(request: MoodRequest):
    """
    Get a movie recommendation based on detected facial emotion.
    """
    from ml.dataset import get_movies_df
    from ml.emotion_mapper import get_recommendation_for_mood
    
    df = get_movies_df()
    result = get_recommendation_for_mood(request.mood, df)
    return result

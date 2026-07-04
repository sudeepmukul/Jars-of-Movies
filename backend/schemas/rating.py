from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MovieAspectRatingBase(BaseModel):
    category_name: Optional[str] = None
    custom_category_id: Optional[int] = None
    score: float

class MovieAspectRatingCreate(MovieAspectRatingBase):
    pass

class MovieAspectRating(MovieAspectRatingBase):
    id: int
    parent_rating_id: int
    
    model_config = {"from_attributes": True}

class RatingBase(BaseModel):
    overall_score: float
    review_text: Optional[str] = None

class RatingCreate(RatingBase):
    movie_id: int
    aspects: List[MovieAspectRatingCreate] = []

class RatingUpdate(RatingBase):
    pass

class Rating(RatingBase):
    id: int
    user_id: int
    movie_id: int
    created_at: datetime
    aspect_ratings: List[MovieAspectRating] = []
    
    model_config = {"from_attributes": True}

class CustomRatingCategoryBase(BaseModel):
    name: str

class CustomRatingCategoryCreate(CustomRatingCategoryBase):
    pass

class CustomRatingCategory(CustomRatingCategoryBase):
    id: int
    owner_id: int
    
    model_config = {"from_attributes": True}

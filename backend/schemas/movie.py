from pydantic import BaseModel
from typing import Optional
from datetime import date

class MovieBase(BaseModel):
    title: str
    tmdb_id: Optional[int] = None
    overview: Optional[str] = None
    release_date: Optional[date] = None
    poster_path: Optional[str] = None
    backdrop_path: Optional[str] = None
    runtime: Optional[int] = None
    genres: Optional[str] = None
    language: Optional[str] = None

class MovieCreate(MovieBase):
    pass

class MovieUpdate(MovieBase):
    pass

class Movie(MovieBase):
    id: int
    average_rating: float
    rating_count: int
    
    model_config = {"from_attributes": True}

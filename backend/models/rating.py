from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database.session import Base
from datetime import datetime, timezone

class Rating(Base):
    """Overall rating for a movie by a user"""
    __tablename__ = "ratings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    movie_id = Column(Integer, ForeignKey("movies.id"), nullable=False)
    
    overall_score = Column(Float, nullable=False)
    review_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    user = relationship("User", back_populates="ratings")
    movie = relationship("Movie", back_populates="ratings")
    aspect_ratings = relationship("MovieAspectRating", back_populates="parent_rating", cascade="all, delete-orphan")

class CustomRatingCategory(Base):
    """User-defined rating categories like 'World Building', 'Villain'"""
    __tablename__ = "custom_rating_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    owner = relationship("User", back_populates="custom_categories")
    aspect_ratings = relationship("MovieAspectRating", back_populates="custom_category")

class MovieAspectRating(Base):
    """Granular ratings for a movie (e.g., Plot, Characters, Visuals, or Custom)"""
    __tablename__ = "movie_aspect_ratings"
    
    id = Column(Integer, primary_key=True, index=True)
    parent_rating_id = Column(Integer, ForeignKey("ratings.id"), nullable=False)
    
    # Either a predefined category string (e.g., "plot", "acting") OR a custom category ID
    category_name = Column(String, nullable=True) 
    custom_category_id = Column(Integer, ForeignKey("custom_rating_categories.id"), nullable=True)
    
    score = Column(Float, nullable=False)
    
    parent_rating = relationship("Rating", back_populates="aspect_ratings")
    custom_category = relationship("CustomRatingCategory", back_populates="aspect_ratings")

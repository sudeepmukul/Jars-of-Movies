from sqlalchemy import Column, Integer, String, Float, Text, Date, Boolean
from sqlalchemy.orm import relationship
from database.session import Base

class Movie(Base):
    __tablename__ = "movies"
    
    id = Column(Integer, primary_key=True, index=True)
    tmdb_id = Column(Integer, unique=True, index=True, nullable=True)
    title = Column(String, index=True, nullable=False)
    overview = Column(Text)
    release_date = Column(Date)
    poster_path = Column(String)
    backdrop_path = Column(String)
    runtime = Column(Integer)
    genres = Column(String) # Stored as comma separated string for simplicity, or JSON
    language = Column(String)
    
    # Metrics
    average_rating = Column(Float, default=0.0)
    rating_count = Column(Integer, default=0)
    
    # Relationships
    ratings = relationship("Rating", back_populates="movie", cascade="all, delete-orphan")
    jar_entries = relationship("JarEntry", back_populates="movie", cascade="all, delete-orphan")

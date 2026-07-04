from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database.session import Base

class Jar(Base):
    __tablename__ = "jars"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False) # e.g., "Comfort Jar", "Late Night Jar"
    description = Column(String)
    is_system = Column(Boolean, default=False) # True if it's a default jar provided by JARS
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Null if system jar
    
    owner = relationship("User", back_populates="custom_jars")
    entries = relationship("JarEntry", back_populates="jar", cascade="all, delete-orphan")

class JarEntry(Base):
    __tablename__ = "jar_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    jar_id = Column(Integer, ForeignKey("jars.id"), nullable=False)
    movie_id = Column(Integer, ForeignKey("movies.id"), nullable=False)
    added_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    jar = relationship("Jar", back_populates="entries")
    movie = relationship("Movie", back_populates="jar_entries")

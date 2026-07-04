from pydantic import BaseModel
from typing import Optional, List
from .movie import Movie

class JarBase(BaseModel):
    name: str
    description: Optional[str] = None

class JarCreate(JarBase):
    is_system: bool = False

class JarUpdate(JarBase):
    pass

class Jar(JarBase):
    id: int
    is_system: bool
    owner_id: Optional[int] = None
    
    model_config = {"from_attributes": True}

class JarEntryBase(BaseModel):
    jar_id: int
    movie_id: int

class JarEntryCreate(JarEntryBase):
    pass

class JarEntry(JarEntryBase):
    id: int
    added_by_id: Optional[int] = None
    movie: Optional[Movie] = None # Include movie details when reading an entry
    
    model_config = {"from_attributes": True}

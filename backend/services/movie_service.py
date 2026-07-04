from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.movie import Movie
from schemas.movie import MovieCreate, MovieUpdate
from .base import CRUDBase

class CRUDMovie(CRUDBase[Movie, MovieCreate, MovieUpdate]):
    async def get_by_tmdb_id(self, db: AsyncSession, *, tmdb_id: int) -> Optional[Movie]:
        result = await db.execute(select(Movie).filter(Movie.tmdb_id == tmdb_id))
        return result.scalars().first()
        
    async def search_by_title(self, db: AsyncSession, *, title: str, limit: int = 10) -> List[Movie]:
        # Simple ilike search for now
        result = await db.execute(
            select(Movie).filter(Movie.title.ilike(f"%{title}%")).limit(limit)
        )
        return result.scalars().all()

movie = CRUDMovie(Movie)

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from database.session import get_db
from schemas.movie import Movie, MovieCreate
from services.movie_service import movie as crud_movie

router = APIRouter()

@router.get("/", response_model=List[Movie])
async def read_movies(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Retrieve movies.
    """
    movies = await crud_movie.get_multi(db, skip=skip, limit=limit)
    return movies

@router.post("/", response_model=Movie)
async def create_movie(
    *,
    db: AsyncSession = Depends(get_db),
    movie_in: MovieCreate,
):
    """
    Create new movie.
    """
    if movie_in.tmdb_id:
        existing = await crud_movie.get_by_tmdb_id(db, tmdb_id=movie_in.tmdb_id)
        if existing:
            raise HTTPException(status_code=400, detail="Movie with this TMDB ID already exists")
    
    return await crud_movie.create(db=db, obj_in=movie_in)

@router.get("/{movie_id}", response_model=Movie)
async def read_movie(
    movie_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    Get movie by ID.
    """
    movie = await crud_movie.get(db=db, id=movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie

from fastapi import APIRouter

from api.routers import movies, jars, recommendations

api_router = APIRouter()
api_router.include_router(movies.router, prefix="/movies", tags=["movies"])
api_router.include_router(jars.router, prefix="/jars", tags=["jars"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
# api_router.include_router(ratings.router, prefix="/ratings", tags=["ratings"])

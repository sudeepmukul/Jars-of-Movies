from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel

from services.in_memory_jars import JARS_DATA

router = APIRouter()

class AddMovieRequest(BaseModel):
    title: str

@router.get("/", response_model=List[Dict[str, Any]])
async def get_all_jars():
    """
    Retrieve all jars and their movies (in-memory MVP).
    """
    return JARS_DATA

@router.post("/{jar_id}/movies")
async def add_movie_to_jar(jar_id: str, request: AddMovieRequest):
    """
    Add a custom movie to a jar (in-memory MVP).
    """
    for jar in JARS_DATA:
        if jar["id"] == jar_id:
            # Simple deduplication
            if request.title.lower() not in [m.lower() for m in jar["movies"]]:
                jar["movies"].append(request.title.strip())
                return {"status": "success", "movie": request.title, "jar_id": jar_id}
            else:
                raise HTTPException(status_code=400, detail="Movie already exists in this jar")
    
    raise HTTPException(status_code=404, detail="Jar not found")

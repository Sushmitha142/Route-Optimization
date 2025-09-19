from typing import List, Tuple
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.transport_model import optimize_route


app = FastAPI(title="Transportation & Logistics Analytics")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint


@app.get("/")
def root():
    return {"message": "Transport API Running"}

# 1. Route Optimization


class RouteRequest(BaseModel):
    edges: List[Tuple[str, str, float]]
    start: str
    end: str


@app.post("/predict/route")
def route(data: RouteRequest):
    result = optimize_route(data.model_dump())
    if isinstance(result, str):
        result = result.split(" -> ")  # split string path into list
    return {"result": result}

import json
import os
import io
import networkx as nx
import matplotlib as mpl
mpl.use('Agg')
import matplotlib.pyplot as plt
from typing import List, Tuple
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from models.transport_model import optimize_route_shortest_path, optimize_route_astar

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

@app.post("/predict/route_shortest_path")
def route_shortest_path(data: RouteRequest):
    result = optimize_route_shortest_path(data.model_dump())
    return result

# Removed /predict/route_with_time endpoint as time-weighted routing is no longer supported.

@app.post("/predict/route_astar")
def route_astar(data: RouteRequest):
    result = optimize_route_astar(data.model_dump())
    return result

# 2. Graph Persistence
class SaveGraphRequest(BaseModel):
    name: str
    edges: List[Tuple[str, str, float]]

@app.post("/graphs/save")
def save_graph(data: SaveGraphRequest):
    os.makedirs("graphs", exist_ok=True)
    file_path = f"graphs/{data.name}.json"
    
    with open(file_path, "w") as f:
        json_data = {
            "name": data.name,
            "edges": [list(edge) for edge in data.edges]
        }
        json.dump(json_data, f)
    
    return {"message": f"Graph '{data.name}' saved successfully."}

@app.get("/graphs/load/{graph_name}")
def load_graph(graph_name: str):
    file_path = f"graphs/{graph_name}.json"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Graph not found.")
    
    with open(file_path, "r") as f:
        graph_data = json.load(f)
    
    return graph_data

# 3. Static Graph Visualization
class GraphVisualizationRequest(BaseModel):
    edges: List[Tuple[str, str, float]]
    path: List[str]

@app.post("/graphs/visualize_full")
def visualize_full_graph(data: GraphVisualizationRequest):
    G = nx.Graph()
    for u, v, w in data.edges:
        G.add_edge(u.lower(), v.lower(), weight=w)

    pos = nx.spring_layout(G)
    
    plt.figure(figsize=(10, 8))
    nx.draw_networkx_nodes(G, pos, node_color='lightblue', node_size=700)
    nx.draw_networkx_labels(G, pos, font_size=12, font_family='sans-serif', labels={node: node.upper() for node in G.nodes()})
    nx.draw_networkx_edges(G, pos, edge_color='gray', width=1)
    
    edge_labels = {edge: G.edges[edge]['weight'] for edge in G.edges()}
    nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels)
    
    plt.title("Original Graph Visualization")
    plt.axis('off')
    
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    plt.close()
    
    return StreamingResponse(buffer, media_type="image/png")

@app.post("/graphs/visualize")
def visualize_graph(data: GraphVisualizationRequest):
    G = nx.Graph()
    for u, v, w in data.edges:
        G.add_edge(u.lower(), v.lower(), weight=w)

    pos = nx.spring_layout(G)
    
    plt.figure(figsize=(10, 8))
    nx.draw_networkx_nodes(G, pos, node_color='lightblue', node_size=700)
    nx.draw_networkx_labels(G, pos, font_size=12, font_family='sans-serif', labels={node: node.upper() for node in G.nodes()})
    
    nx.draw_networkx_edges(G, pos, edge_color='gray', width=1)
    
    if data.path and len(data.path) > 1:
        path_edges = list(zip(data.path, data.path[1:]))
        nx.draw_networkx_edges(G, pos, edgelist=path_edges, edge_color='green', width=2)
    
    edge_labels = {edge: G.edges[edge]['weight'] for edge in G.edges()}
    nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels)
    
    plt.title("Optimized Route Visualization")
    plt.axis('off')
    
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    plt.close()
    
    return StreamingResponse(buffer, media_type="image/png")
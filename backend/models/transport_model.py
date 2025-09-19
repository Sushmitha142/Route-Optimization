import pandas as pd
import networkx as nx
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier
import joblib

# ----------------------------
# 1. Route Optimization
# ----------------------------


# def optimize_route(data):
#     G = nx.Graph()
#     edges = data.get("edges", [])
#     for u, v, w in edges:
#         G.add_edge(u, v, weight=w)
#     start, end = data["start"], data["end"]
#     try:
#         path = nx.shortest_path(G, source=start, target=end, weight="weight")
#         distance = nx.shortest_path_length(
#             G, source=start, target=end, weight="weight")
#         return {"path": path, "distance": distance}
#     except:
#         return {"path": ["No path found"], "distance": None}

def optimize_route(data):
    G = nx.Graph()
    edges = data.get("edges", [])
    for u, v, w in edges:
        G.add_edge(u, v, weight=w)
    start, end = data["start"], data["end"]
    try:
        path = nx.shortest_path(G, source=start, target=end, weight="weight")
        return path  # <--- return list directly
    except:
        return ["No path found"]

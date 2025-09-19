import pandas as pd
import networkx as nx
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier
import joblib

# ----------------------------
# 1. Route Optimization
# ----------------------------

def optimize_route_shortest_path(data):
    G = nx.Graph()
    edges = data.get("edges", [])
    for u, v, w in edges:
        G.add_edge(u, v, weight=w)
    start, end = data["start"], data["end"]
    try:
        path = nx.shortest_path(G, source=start, target=end, weight="weight")
        return {"path": path, "cost": nx.shortest_path_length(G, source=start, target=end, weight="weight")}
    except nx.NetworkXNoPath:
        return {"path": ["No path found"], "cost": None}


def optimize_route_with_time(data):
    G = nx.Graph()
    edges = data.get("edges", [])
    for u, v, w in edges:
        # For this example, 'time' is simply the 'weight' * a factor
        # You would replace this with your actual logic for traffic/time
        time = w * 1.5
        G.add_edge(u, v, weight=time)
    start, end = data["start"], data["end"]
    try:
        path = nx.shortest_path(G, source=start, target=end, weight="weight")
        return {"path": path, "cost": nx.shortest_path_length(G, source=start, target=end, weight="weight")}
    except nx.NetworkXNoPath:
        return {"path": ["No path found"], "cost": None}
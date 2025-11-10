import networkx as nx

# ----------------------------
# 1. Route Optimization
# ----------------------------

def heuristic(u, v):
    """
    A simple heuristic for the A* algorithm based on node names.
    In a real-world application, this would use actual geographic coordinates.
    """
    # This simplified heuristic assumes nodes are single letters and assigns them
    # a position to calculate Euclidean distance.
    positions = {chr(ord('a') + i): (i, 0) for i in range(26)}
    u_pos = positions.get(u, (0, 0))
    v_pos = positions.get(v, (0, 0))
    return ((u_pos[0] - v_pos[0])**2 + (u_pos[1] - v_pos[1])**2)**0.5

def optimize_route_shortest_path(data):
    G = nx.Graph()
    edges = data.get("edges", [])
    for u, v, w in edges:
        G.add_edge(u.lower(), v.lower(), weight=w)
    start, end = data["start"].lower(), data["end"].lower()
    try:
        path = nx.shortest_path(G, source=start, target=end, weight="weight")
        return {"path": path, "cost": nx.shortest_path_length(G, source=start, target=end, weight="weight")}
    except nx.NetworkXNoPath:
        return {"path": ["No path found"], "cost": None}


# Removed time-weighted variant to keep only shortest path and A* as requested.

def optimize_route_astar(data):
    G = nx.Graph()
    edges = data.get("edges", [])
    for u, v, w in edges:
        G.add_edge(u.lower(), v.lower(), weight=w)
    start, end = data["start"].lower(), data["end"].lower()
    try:
        path = nx.astar_path(G, source=start, target=end, heuristic=heuristic, weight="weight")
        return {"path": path, "cost": nx.shortest_path_length(G, source=start, target=end, weight="weight")}
    except nx.NetworkXNoPath:
        return {"path": ["No path found"], "cost": None}
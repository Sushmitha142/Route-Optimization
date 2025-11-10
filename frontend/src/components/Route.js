import React, { useState } from "react";
import "../styles/routepage.css";

function RoutePage() {
    const [edges, setEdges] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [path, setPath] = useState(null);
    const [cost, setCost] = useState(null);
    const [algorithm, setAlgorithm] = useState("shortest_path");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [originalGraphImage, setOriginalGraphImage] = useState(null);
    const [optimizedGraphImage, setOptimizedGraphImage] = useState(null);

    // API URL: Use environment variable if set, otherwise default to localhost
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

    const submit = async () => {
        setPath(null);
        setCost(null);
        setOriginalGraphImage(null);
        setOptimizedGraphImage(null);
        setError(null);
        setIsLoading(true);

        const formattedEdges = edges.split(";").map(edge => {
            const [u, v, w] = edge.split(",");
            return [u.trim(), v.trim(), parseFloat(w)];
        });

        const url = `${API_URL}/predict/route_${algorithm}`;

        try {
            // First, get the path and cost from the backend
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ edges: formattedEdges, start, end }),
            });

            if (!res.ok) {
                throw new Error(`Error: ${res.statusText}`);
            }

            const data = await res.json();
            const newPath = Array.isArray(data.path) ? data.path : ["No path found"];
            setPath(newPath);
            setCost(data.cost);

            // Second, get the original graph image
            const originalImageRes = await fetch(`${API_URL}/graphs/visualize_full`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ edges: formattedEdges, path: [] }), // Pass an empty path
            });
            if (originalImageRes.ok) {
                const imageBlob = await originalImageRes.blob();
                setOriginalGraphImage(URL.createObjectURL(imageBlob));
            }

            // Third, get the optimized graph image
            const optimizedImageRes = await fetch(`${API_URL}/graphs/visualize`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ edges: formattedEdges, path: newPath }), // Pass the new path
            });

            if (optimizedImageRes.ok) {
                const imageBlob = await optimizedImageRes.blob();
                setOptimizedGraphImage(URL.createObjectURL(imageBlob));
            }

        } catch (error) {
            console.error("Failed to fetch route:", error);
            setError("Failed to get a result. Please check your network and input.");
            setPath(["Error finding path"]);
            setCost(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="route-container">
            {/* Title */}
            <h1>🚦 Route Optimization</h1>
            <p>Enter your network and find the most efficient path ✨</p>

            {/* Inputs */}
            <div className="input-group">
                <label>Graph Edges</label>
                <textarea
                    placeholder="A,B,5; B,C,3; C,D,2"
                    onChange={(e) => setEdges(e.target.value)}
                    value={edges}
                />
            </div>

            <div className="input-group">
                <label>Start Node</label>
                <input
                    placeholder="Start Node"
                    onChange={(e) => setStart(e.target.value)}
                    value={start}
                />
            </div>

            <div className="input-group">
                <label>End Node</label>
                <input
                    placeholder="End Node"
                    onChange={(e) => setEnd(e.target.value)}
                    value={end}
                />
            </div>

            {/* New Algorithm Selector */}
            <div className="input-group">
                <label>Optimization Algorithm</label>
                <select onChange={(e) => setAlgorithm(e.target.value)} value={algorithm}>
                    <option value="shortest_path">Shortest Path</option>
                    <option value="astar">A* Algorithm</option>
                </select>
            </div>

            {/* Button */}
            <button onClick={submit} disabled={isLoading}>
                {isLoading ? "Optimizing..." : "🚀 Optimize Route"}
            </button>

            {/* Loading and Error States */}
            {isLoading && <div className="loading-message">Optimizing route...</div>}
            {error && <div className="error-message">{error}</div>}

            {/* Result */}
            {path && !isLoading && (
                <div className="result-box">
                    <div>Best Path: {Array.isArray(path) ? path.join(" → ") : path}</div>
                    <div>Total Cost: {cost !== null ? cost : "N/A"}</div>
                </div>
            )}
            
            {/* Graph Visualizations */}
            <div className="graph-images-container">
                {originalGraphImage && (
                    <div className="graph-container">
                        <h2>Original Graph</h2>
                        <img src={originalGraphImage} alt="Original Graph" className="graph-image" />
                    </div>
                )}
                {optimizedGraphImage && (
                    <div className="graph-container">
                        <h2>Optimized Route</h2>
                        <img src={optimizedGraphImage} alt="Optimized Route" className="graph-image" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default RoutePage;
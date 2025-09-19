import React, { useState } from "react";
import { Graph } from "react-d3-graph";
import "../styles/routepage.css";

function RoutePage() {
    const [edges, setEdges] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [path, setPath] = useState(null);
    const [cost, setCost] = useState(null);
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [algorithm, setAlgorithm] = useState("shortest_path"); // New state for algorithm choice

    const submit = async () => {
        // Clear previous results and graph data
        setPath(null);
        setCost(null);
        setGraphData({ nodes: [], links: [] });

        const formattedEdges = edges.split(";").map(edge => {
            const [u, v, w] = edge.split(",");
            return [u.trim(), v.trim(), parseFloat(w)];
        });

        // Use the selected algorithm to form the correct URL
        const url = `http://localhost:8000/predict/route_${algorithm}`;

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ edges: formattedEdges, start, end }),
            });

            const data = await res.json();
            // The new backend response has 'path' and 'cost' keys
            const newPath = Array.isArray(data.path) ? data.path : ["No path found"];
            setPath(newPath);
            setCost(data.cost);

            // Prepare graph data for visualization
            const nodesSet = new Set();
            formattedEdges.forEach(([u, v]) => {
                nodesSet.add(u);
                nodesSet.add(v);
            });
            const nodes = Array.from(nodesSet).map(node => ({
                id: node,
                color: newPath.includes(node) ? "#22d3ee" : "#888",
            }));
            const links = formattedEdges.map(([u, v, w]) => ({
                source: u,
                target: v,
                color:
                    newPath.includes(u) && newPath.includes(v) &&
                        newPath.indexOf(v) - newPath.indexOf(u) === 1
                        ? "#10b981"
                        : "#999",
                label: w.toString(),
            }));
            setGraphData({ nodes, links });
        } catch (error) {
            console.error("Failed to fetch route:", error);
            setPath(["Error finding path"]);
            setCost(null);
        }
    };

    const myConfig = {
        nodeHighlightBehavior: true,
        node: {
            color: "#888",
            size: 400,
            highlightStrokeColor: "#03f",
        },
        link: {
            highlightColor: "#10b981",
        },
        directed: true,
        height: 400,
        width: 600,
        d3: {
            gravity: 100
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
                />
            </div>

            <div className="input-group">
                <label>Start Node</label>
                <input
                    placeholder="Start Node"
                    onChange={(e) => setStart(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label>End Node</label>
                <input
                    placeholder="End Node"
                    onChange={(e) => setEnd(e.target.value)}
                />
            </div>

            {/* New Algorithm Selector */}
            <div className="input-group">
                <label>Optimization Algorithm</label>
                <select onChange={(e) => setAlgorithm(e.target.value)} value={algorithm}>
                    <option value="shortest_path">Shortest Path</option>
                    <option value="with_time">With Time/Traffic</option>
                </select>
            </div>

            {/* Button */}
            <button onClick={submit}>🚀 Optimize Route</button>

            {/* Result */}
            {path && (
                <div className="result-box">
                    <div>Best Path: {Array.isArray(path) ? path.join(" → ") : path}</div>
                    <div>Total Cost: {cost !== null ? cost : "N/A"}</div>
                </div>
            )}

            {/* Graph Visualization */}
            {graphData.nodes.length > 0 && (
                <div className="graph-container">
                    <h2>Graph Visualization</h2>
                    <Graph
                        id="graph-id"
                        data={graphData}
                        config={myConfig}
                    />
                </div>
            )}
        </div>
    );
}

export default RoutePage;
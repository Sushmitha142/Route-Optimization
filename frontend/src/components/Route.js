import React, { useState } from "react";
import { Graph } from "react-d3-graph";
import "../styles/routepage.css";

function RoutePage() {
    const [edges, setEdges] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [result, setResult] = useState(null);
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });

    const submit = async () => {
        const formattedEdges = edges.split(";").map(edge => {
            const [u, v, w] = edge.split(",");
            return [u.trim(), v.trim(), parseFloat(w)];
        });

        const res = await fetch("http://localhost:8000/predict/route", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ edges: formattedEdges, start, end }),
        });

        const data = await res.json();
        const path = Array.isArray(data.result) ? data.result : [];
        setResult(path);

        // Prepare graph data for visualization
        const nodesSet = new Set();
        formattedEdges.forEach(([u, v]) => {
            nodesSet.add(u);
            nodesSet.add(v);
        });
        const nodes = Array.from(nodesSet).map(node => ({
            id: node,
            color: path.includes(node) ? "#22d3ee" : "#888",
        }));
        const links = formattedEdges.map(([u, v]) => ({
            source: u,
            target: v,
            color:
                path.includes(u) && path.includes(v) &&
                    path.indexOf(v) - path.indexOf(u) === 1
                    ? "#10b981"
                    : "#999",
        }));
        setGraphData({ nodes, links });
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

            {/* Button */}
            <button onClick={submit}>🚀 Optimize Route</button>

            {/* Result */}
            {result && (
                <div className="result-box">
                    Best Path: {Array.isArray(result) ? result.join(" → ") : result}
                </div>
            )}
        </div>
    );
}

export default RoutePage;

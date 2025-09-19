# Route Optimization and Analytics

This project is a web-based application designed to solve and visualize route optimization problems. It features a robust backend built with FastAPI and a dynamic, user-friendly frontend developed in React.

-----

### 🚀 Key Features

  * **Multiple Optimization Algorithms**: The application provides three distinct algorithms to find the most efficient path between two nodes in a network:
      * **Shortest Path**: A standard algorithm that finds the path with the minimum total weight.
      * **With Time/Traffic**: A modified algorithm that considers travel time, simulating factors like traffic.
      * **A\* (A-star)**: An advanced, heuristic-based algorithm that efficiently finds the shortest path, especially in large graphs.
  * **Case-Insensitive Input**: All node names are automatically converted to lowercase on the backend, ensuring that inputs like "A" and "a" are treated as the same node.
  * **Static Graph Visualization**: The application generates static images of both the original input graph and the optimized route using `matplotlib` and `NetworkX` on the backend, providing a clear visual comparison without frontend rendering issues.
  * **User-Friendly Interface**: The frontend includes a modern design, input validation, loading states, and error handling for a seamless user experience.
  * **Search History**: All successful searches are saved to a local history log, allowing users to view and reuse past results without re-entering data.
  * **Graph Persistence**: Graphs can be saved to and loaded from JSON files on the backend, ensuring that complex network data is not lost when the server is restarted.

-----

### 👨‍💻 Team Members

  * Sushmitha V
  * Pranav V

-----

### ⚙️ Setup and Installation

Follow these steps to set up the project locally.

#### Prerequisites

  * **Python 3.11+**: For the backend.
  * **Node.js & npm**: For the frontend.
  * **Git**: For version control.

#### Backend Setup

1.  Navigate to the `backend` directory in your terminal.
    ```bash
    cd backend
    ```
2.  Create and activate a Python virtual environment.
    ```bash
    python -m venv venv
    # On Windows
    venv\Scripts\activate
    # On macOS/Linux
    source venv/bin/activate
    ```
3.  Install the required Python packages.
    ```bash
    pip install -r requirements.txt
    ```
4.  Run the FastAPI server.
    ```bash
    uvicorn main:app --reload
    ```
    The backend server will run at `http://127.0.0.1:8000`.

#### Frontend Setup

1.  Open a new terminal and navigate to the `frontend` directory.
    ```bash
    cd frontend
    ```
2.  Install the required Node.js packages.
    ```bash
    npm install
    ```
3.  Start the React development server.
    ```bash
    npm start
    ```
    The frontend application will open in your browser at `http://localhost:3000`.

-----

### 📝 Usage

To use the application, provide the following inputs in the form on the main page:

  * **Graph Edges**: Enter the edges of your graph in the format `Source,Target,Weight;` separated by semicolons.
      * **Example**: `A,B,5; B,C,3; C,D,2`
  * **Start Node**: The starting point for the pathfinding algorithm.
  * **End Node**: The destination for the pathfinding algorithm.

Select your desired **Optimization Algorithm** and click **"Optimize Route"** to see the results and visualizations.
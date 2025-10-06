# RADARE

RADARE is a powerful data reconciliation tool designed to help you compare and synchronize data from multiple sources. It provides a user-friendly web interface for visualizing data, identifying discrepancies, and reconciling them with ease.

## Key Features

- **Data Visualization:** Visualize your datasets using interactive charts and graphs to quickly identify discrepancies.
- **Data Reconciliation:** Compare and reconcile data from different sources with a simple, intuitive workflow.
- **API-Driven:** A robust backend API allows for seamless integration with your existing data pipelines and systems.
- **Easy to Use:** The web-based interface makes it easy for anyone to use, regardless of their technical expertise.

This `README.md` provides an overview of the project, its architecture, and how to get started with the backend, frontend, and API client.

## Backend

The backend is a Go-based API that provides the core functionality for data reconciliation. It exposes a set of endpoints for interacting with the data and performing reconciliation tasks.

### API Endpoints

- `GET /api/current-values`: Retrieves the current values from the data sources.
- `POST /api/reconcile`: Reconciles the data from the different sources.
- `GET /healthz`: A health check endpoint to ensure the service is running.

### Getting Started

To run the backend server, navigate to the `backend` directory and run the following command:

```bash
cd backend
go run main.go
```

The server will start on port `8080` by default. You can change the port by setting the `PORT` environment variable.

## Frontend

The frontend is a React-based web application that provides a user-friendly interface for visualizing and reconciling data. It uses `chart.js` and `reactflow` to create interactive charts and diagrams.

### Getting Started

To run the frontend application, navigate to the `webapp` directory and run the following commands:

```bash
cd webapp
npm install
npm run dev
```

This will start the development server, and you can access the application in your browser at `http://localhost:5173` (or another port if 5173 is in use).

## API Client

The `apiclient` directory contains a [Bruno](https://www.usebruno.com/) collection for interacting with the backend API. You can use Bruno to send requests to the API endpoints and view the responses. This is a great way to test the API and understand its functionality.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.
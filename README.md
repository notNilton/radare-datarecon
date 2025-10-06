# RADARE: A Comprehensive Data Reconciliation System

RADARE is an advanced data reconciliation tool engineered to empower users to compare, analyze, and synchronize datasets from disparate sources with precision and efficiency. It features a sophisticated web-based interface for intuitive data visualization, discrepancy identification, and streamlined reconciliation workflows.

## Core Features

-   **Advanced Data Visualization**: Leverage interactive charts and graphs to conduct in-depth explorations of your datasets, facilitating the rapid identification of inconsistencies.
-   **Robust Data Reconciliation**: Seamlessly compare and reconcile data from multiple sources through a guided and intuitive workflow.
-   **API-First Architecture**: A powerful backend API enables seamless integration with your existing data pipelines, enterprise systems, and custom applications.
-   **User-Centric Design**: The web interface is meticulously crafted for ease of use, making powerful data reconciliation capabilities accessible to users of all technical backgrounds.

This `README.md` provides a comprehensive overview of the RADARE architecture, its constituent components, and detailed instructions for getting started with the backend, frontend, and API client.

## System Architecture

RADARE is designed with a modern, decoupled architecture, consisting of three primary components:

-   **Backend**: A high-performance Go-based API that serves as the core of the system, handling all data processing, reconciliation logic, and persistence.
-   **Frontend**: A responsive and interactive web application built with React, providing the user interface for data visualization and reconciliation.
-   **API Client**: A [Bruno](https://www.usebruno.com/) collection that facilitates direct interaction with the backend API for testing, development, and integration purposes.

## Getting Started

### Backend

The backend is a Go application that exposes a RESTful API for data reconciliation.

**To run the backend server:**

```bash
cd backend
go run main.go
```

The server will start on port `8080` by default. This can be configured via the `PORT` environment variable.

### Frontend

The frontend is a React application that provides a rich user interface for the RADARE system.

**To run the frontend application:**

```bash
cd webapp
npm install
npm run dev
```

This will launch the development server, and the application will be accessible at `http://localhost:5173`.

### API Client

The `apiclient` directory contains a Bruno collection for interacting with the backend API. This is an invaluable tool for developers and integrators who need to test API endpoints and understand their behavior.

## Contributing

We welcome contributions to the RADARE project. If you have ideas for new features, bug fixes, or enhancements, please open an issue or submit a pull request on our GitHub repository.
# Maketronics Operational Intelligence System

## Live System

- **Frontend Application**: [https://maketronics-system.vercel.app/](https://maketronics-system.vercel.app/)
- **Backend API**: [https://maketronics-system-production.up.railway.app/api](https://maketronics-system-production.up.railway.app/api)
- **GitHub Repository**: [https://github.com/MousamKumari13/maketronics-system](https://github.com/MousamKumari13/maketronics-system)

## Problem Interpretation

The system is designed to handle unstructured operational inputs from Maketronics, such as issues, events, logs, tasks, incidents, and notes. It processes these inputs by classifying them into categories (Issue, Task, Log, Note) based on keywords, extracts relevant tags, and stores both raw and processed data. The frontend allows users to submit inputs, view processed data with filters, and visualize analytics through charts.

## System Design

### Backend (Node.js, Express)

- **Language/Framework**: Node.js with Express
- **Storage**: JSON file for simplicity and deployment ease
- **APIs**:
  - POST /api/inputs: Accepts raw text, processes it, stores and returns the entry
  - GET /api/inputs: Retrieves inputs with optional filters (category, tag, limit)
  - GET /api/analytics: Returns counts by category and tag
- **Processing Logic**:
  - Classification: Keyword matching (e.g., 'failed' -> Issue)
  - Tagging: Extract words >2 chars, exclude common words, limit to 5

### Frontend (React, Vite)

- **Framework**: React with Vite
- **Libraries**: Axios for API calls, Chart.js for visualization
- **Features**:
  - Input form for submitting raw text
  - List of processed inputs with category and tag filters
  - Bar chart for category analytics

## Local Setup Guide

### Prerequisites
- **Node.js**: Version 18 or higher (download from https://nodejs.org)
- **Git**: For version control (download from https://git-scm.com)
- **Code Editor**: VS Code recommended

### Step-by-Step Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/MousamKumari13/maketronics-system.git
cd maketronics-system
```

#### 2. Install Backend Dependencies
```bash
npm install
```
This installs: express, cors, uuid

#### 3. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```
This installs: react, react-dom, axios, chart.js, react-chartjs-2, vite

#### 4. Start the Backend Server
```bash
node server.js
```
- Server will start on http://localhost:5000
- You'll see "Server running on port 5000"
- Data is stored in `data.json` file

#### 5. Start the Frontend Development Server
```bash
# Open a new terminal window
cd frontend
npm run dev
```
- Vite dev server starts on http://localhost:5173
- Hot reload enabled for development

#### 6. Access the Application
- Open http://localhost:5173 in your browser
- The app will connect to the backend automatically
- Try submitting inputs like:
  - "Motor overheating after 3 hours"
  - "PCB board version 2 failed QA"
  - "Delay in shipment from vendor X"

## Example Usage

The system intelligently processes various types of operational inputs:

**Issues:**
- `"Motor overheating after 3 hours"` → Issue + [motor, overheating, hours]
- `"PCB board version 2 failed QA"` → Issue + [pcb, board, version, failed]

**Tasks:**
- `"Delay in shipment from vendor X"` → Task + [delay, shipment, vendor]
- `"Schedule maintenance for machine A"` → Task + [schedule, maintenance, machine]

**Logs:**
- `"Voltage drop observed at node A"` → Log + [voltage, drop, observed, node]
- `"Temperature reading: 85°C"` → Log + [temperature, reading]

## Analytics Features

The system provides real-time analytics including:
- **Category Distribution**: Visual breakdown of input types
- **Tag Frequency**: Most common operational themes
- **Total Processing**: System-wide input metrics
- **Trend Analysis**: Pattern identification over time

## Troubleshooting

### Backend Issues
- **Port 5000 in use**: Change PORT in server.js or kill the process
- **Permission errors**: Run with `sudo` if needed (not recommended)
- **CORS errors**: Backend has CORS enabled, should work

### Frontend Issues
- **Port 5173 in use**: Vite will auto-assign another port
- **API connection failed**: Ensure backend is running on 5000
- **Build errors**: Delete node_modules and reinstall

### Common Problems
- **Node version**: Ensure Node.js ≥18
- **Dependencies**: Always run `npm install` in both directories
- **Data persistence**: `data.json` is created automatically on first input

## Development Workflow

1. Make changes to code
2. Backend changes: Restart server (`Ctrl+C` then `node server.js`)
3. Frontend changes: Auto-reload in browser
4. Test thoroughly

## Trade-offs Made

- **Storage**: Used JSON file instead of database for simplicity and no setup required. Trade-off: Not scalable for large data, but sufficient for demo.
- **Classification**: Simple keyword matching instead of ML/AI to avoid complexity.
- **UI**: Basic styling focused on functionality over aesthetics.
- **Deployment**: Railway for backend, Vercel for frontend for easy setup.

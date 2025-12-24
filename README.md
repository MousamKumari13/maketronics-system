# Maketronics Operational Intelligence System

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

## Trade-offs Made

- **Storage**: Used JSON file instead of database for simplicity and no setup required. Trade-off: Not scalable for large data, but sufficient for demo.
- **Classification**: Simple keyword matching instead of ML/AI to avoid complexity and stay true to "no AI" unless understood.
- **UI**: Basic inline styles, no fancy libraries as per guidelines.
- **Deployment**: Railway for backend (free), Vercel for frontend (free), easy to set up.

## Next Steps for Completion

To fully complete the challenge submission, follow these steps:

### 1. Create GitHub Repository
1. Go to https://github.com and sign in
2. Click "New repository"
3. Name it `maketronics-system` or similar
4. Make it public
5. Do NOT initialize with README (we have one)
6. Click "Create repository"
7. Copy the repository URL

### 2. Push Code to GitHub
```bash
# Initialize git in the project directory
cd maketronics-system
git init
git add .
git commit -m "Initial commit: Maketronics Operational Intelligence System"

# Add remote origin (replace with your repo URL)
git remote add origin https://github.com/yourusername/maketronics-system.git
git branch -M main
git push -u origin main
```

### 3. Deploy Backend to Railway
1. Go to https://railway.app and sign up/sign in
2. Click "New Project" → "Deploy from GitHub"
3. Connect your GitHub account and select the `maketronics-system` repository
4. Railway will auto-detect Node.js and deploy
5. Once deployed, copy the backend URL (something like `https://maketronics-system.up.railway.app`)

### 4. Deploy Frontend to Vercel
1. Go to https://vercel.com and sign up/sign in
2. Click "New Project" → "Import Git Repository"
3. Connect GitHub and select the repository
4. Configure:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variable: `VITE_API_BASE_URL=https://your-railway-backend-url/api`
6. Click "Deploy"
7. Once deployed, copy the frontend URL

### 5. Update API Base URL in Production
In `frontend/src/App.jsx`, change:
```javascript
const API_BASE = 'http://localhost:3000/api';
```
To:
```javascript
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
```

Then push the change to GitHub to trigger Vercel redeploy.

### 6. Submit Your Solution
Update this README with the live URLs:
- Frontend: [Your Vercel URL]
- Backend API: [Your Railway URL]

## Detailed Local Setup Guide

### Prerequisites
- **Node.js**: Version 18 or higher (download from https://nodejs.org)
- **Git**: For version control (download from https://git-scm.com)
- **Code Editor**: VS Code recommended

### Step-by-Step Local Installation

#### 1. Clone or Download the Project
```bash
git clone https://github.com/yourusername/maketronics-system.git
cd maketronics-system
```

#### 2. Install Backend Dependencies
```bash
# Make sure you're in the root directory
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
# From the root directory
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

### Troubleshooting

#### Backend Issues
- **Port 3000 in use**: Change PORT in server.js or kill the process
- **Permission errors**: Run with `sudo` if needed (not recommended)
- **CORS errors**: Backend has CORS enabled, should work

#### Frontend Issues
- **Port 5173 in use**: Vite will auto-assign another port
- **API connection failed**: Ensure backend is running on 3000
- **Build errors**: Delete node_modules and reinstall

#### Common Problems
- **Node version**: Ensure Node.js ≥18
- **Dependencies**: Always run `npm install` in both directories
- **Data persistence**: `data.json` is created automatically on first input

### Development Workflow
1. Make changes to code
2. Backend changes: Restart server (`Ctrl+C` then `node server.js`)
3. Frontend changes: Auto-reload in browser
4. Test thoroughly before deploying

## Live URLs

- **Frontend**: [https://maketronics-system.vercel.app/](https://maketronics-system.vercel.app/)
- **Backend API**: [https://maketronics-system-production.up.railway.app/api](https://maketronics-system-production.up.railway.app/api)

## GitHub Repository

[https://github.com/MousamKumari13/maketronics-system](https://github.com/MousamKumari13/maketronics-system)

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, 'data.json');

// Load data
function loadData() {
  if (fs.existsSync(dataFile)) {
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  }
  return [];
}

// Save data
function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// Classification function
function classify(text) {
  const lower = text.toLowerCase();
  
  // Check for Issues
  if (lower.includes('failed') || lower.includes('overheating') || lower.includes('broken') || lower.includes('error') || lower.includes('defect')) {
    return 'Issue';
  }
  
  // Check for Events
  else if (lower.includes('event') || lower.includes('meeting') || lower.includes('conference') || lower.includes('scheduled') || lower.includes('announcement')) {
    return 'Event';
  }
  
  // Check for Tasks
  else if (lower.includes('delay') || lower.includes('shipment') || lower.includes('schedule') || lower.includes('assign') || lower.includes('complete')) {
    return 'Task';
  }
  
  // Check for Incidents
  else if (lower.includes('incident') || lower.includes('accident') || lower.includes('emergency') || lower.includes('crash') || lower.includes('outage')) {
    return 'Incident';
  }
  
  // Check for Logs
  else if (lower.includes('observed') || lower.includes('log') || lower.includes('recorded') || lower.includes('monitored') || lower.includes('reading')) {
    return 'Log';
  }
  
  // Default to Note
  else {
    return 'Note';
  }
}

// Tagging function
function extractTags(text) {
  // Simple: split words, remove common, keep nouns-ish
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const common = ['the', 'a', 'an', 'after', 'at', 'from', 'in', 'of', 'on', 'to', 'with'];
  return words.filter(word => word.length > 2 && !common.includes(word)).slice(0, 5); // limit to 5
}

// POST /api/inputs
app.post('/api/inputs', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });
  const data = loadData();
  const entry = {
    id: uuidv4(),
    rawText: text,
    category: classify(text),
    tags: extractTags(text),
    timestamp: new Date().toISOString(),
    status: 'active'
  };
  data.push(entry);
  saveData(data);
  res.json(entry);
});

// GET /api/inputs
app.get('/api/inputs', (req, res) => {
  const { category, tag, limit } = req.query;
  let data = loadData();
  if (category) data = data.filter(d => d.category === category);
  if (tag) data = data.filter(d => d.tags.includes(tag));
  if (limit) data = data.slice(-parseInt(limit)); // recent
  res.json(data);
});

// GET /api/analytics
app.get('/api/analytics', (req, res) => {
  const data = loadData();
  const categories = {};
  const tags = {};
  data.forEach(d => {
    categories[d.category] = (categories[d.category] || 0) + 1;
    d.tags.forEach(t => tags[t] = (tags[t] || 0) + 1);
  });
  res.json({ categories, tags, total: data.length });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

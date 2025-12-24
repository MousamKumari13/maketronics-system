import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://maketronics-system-production.up.railway.app/api';

function App() {
  const [text, setText] = useState('');
  const [inputs, setInputs] = useState([]);
  const [analytics, setAnalytics] = useState({ categories: {}, tags: {}, total: 0 });
  const [filter, setFilter] = useState({ category: '', tag: '' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadInputs(), loadAnalytics()]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadInputs = async () => {
    const res = await axios.get(`${API_BASE}/inputs`);
    setInputs(res.data);
  };

  const loadAnalytics = async () => {
    const res = await axios.get(`${API_BASE}/analytics`);
    setAnalytics(res.data);
  };

  const submitInput = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await axios.post(`${API_BASE}/inputs`, { text: text.trim() });
      setText('');
      await loadData();
    } catch (err) {
      setError('Failed to submit input. Please check if backend is running.');
      console.error('Failed to submit input:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredInputs = inputs.filter(i =>
    (!filter.category || i.category === filter.category) &&
    (!filter.tag.trim() || i.tags.some(tag => tag.toLowerCase().includes(filter.tag.toLowerCase())))
  );

  const chartData = {
    labels: Object.keys(analytics.categories),
    datasets: [{
      label: 'Count',
      data: Object.values(analytics.categories),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }],
  };

  return (
    <div>
      <header>
        <div className="header-icon">⚙️</div>
        <h1>Maketronics Operational Intelligence</h1>
        <p className="subtitle">Process and analyze unstructured operational inputs</p>
      </header>

      <div className="app">
        <section className="section input-section">
        <h2>Submit New Input</h2>
        <div className="input-form">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter operational input (e.g., 'Motor overheating after 3 hours')"
            rows="4"
            disabled={submitting}
          />
          <button type="button" onClick={submitInput} disabled={submitting || !text.trim()}>
            {submitting ? 'Submitting...' : 'Submit Input'}
          </button>
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
      </section>

      <section className="section filters-section">
        <h2>Filters</h2>
        <div className="filters">
          <select value={filter.category} onChange={e => setFilter({ ...filter, category: e.target.value })}>
            <option value="">All Categories</option>
            <option value="Issue">Issue</option>
            <option value="Task">Task</option>
            <option value="Log">Log</option>
            <option value="Note">Note</option>
          </select>
          <input
            type="text"
            placeholder="Filter by tag"
            value={filter.tag}
            onChange={e => setFilter({ ...filter, tag: e.target.value })}
          />
        </div>
      </section>

      <section className="section inputs-section">
        <h2>Processed Inputs ({loading ? '...' : filteredInputs.length})</h2>
        {loading ? (
          <p>Loading inputs...</p>
        ) : (
          <ul className="inputs-list">
            {filteredInputs.length === 0 ? (
              <p>No inputs match the current filters.</p>
            ) : (
              filteredInputs.map(i => (
                <li key={i.id} className="input-item">
                  <div>
                    <span className="input-category">{i.category}</span>: {i.rawText}
                  </div>
                  <div className="input-tags">Tags: {i.tags.join(', ') || 'None'}</div>
                </li>
              ))
            )}
          </ul>
        )}
      </section>

      <section className="section analytics-section">
        <h2>Analytics Overview</h2>
        <div className="analytics-summary">
          <div className="summary-item">
            <strong>Total Inputs:</strong> {analytics.total || 0}
          </div>
          <div className="summary-item">
            <strong>Categories:</strong> {Object.keys(analytics.categories || {}).length}
          </div>
          <div className="summary-item">
            <strong>Unique Tags:</strong> {Object.keys(analytics.tags || {}).length}
          </div>
        </div>
        <div className="analytics-container">
          <h3>Inputs by Category</h3>
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
        <div className="analytics-container">
          <h3>Top Tags</h3>
          <Bar
            data={{
              labels: Object.keys(analytics.tags || {}).slice(0, 10),
              datasets: [{
                label: 'Tag Frequency',
                data: Object.values(analytics.tags || {}).slice(0, 10),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
              }],
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </section>
      </div>
    </div>
  );
}

export default App;

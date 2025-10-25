import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Row, Spinner, Alert } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import api from '../api/client';
import { useTheme } from '../context/ThemeContext'; // **** 1. IMPORT useTheme ****

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme(); // **** 2. GET THE CURRENT THEME ****

  useEffect(() => {
    // ... (useEffect remains the same)
    const fetchStats = async () => {
      try {
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center p-5"><Spinner animation="border" /> Loading Dashboard...</div>;
  }
  if (error) {
    return <Alert variant="danger" className="m-4">Error loading dashboard: {error}</Alert>;
  }

  // **** 3. DEFINE CHART TEXT COLOR BASED ON THEME ****
  const chartTextColor = theme === 'light' ? '#212529' : '#e0e0e0';

  const chartData = {
    // ... (chartData remains the same)
    labels: ['AI-Generated', 'Real'],
    datasets: [
      {
        label: '# of Analyses',
        data: [stats.deepfakeCount, stats.realCount],
        backgroundColor: [ 'rgba(255, 99, 132, 0.7)', 'rgba(75, 192, 192, 0.7)' ],
        borderColor: [ 'rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)' ],
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: chartTextColor, // **** 4. APPLY THE DYNAMIC TEXT COLOR ****
        },
      },
    },
  };

  const formatDateTime = (isoString) => new Date(isoString).toLocaleString();

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-primary fw-bold">{stats.userName}'s Dashboard</h1>

      {/* Stat Cards */}
      <Row className="g-4 mb-4">
        {/* ... (Stat Cards are unchanged and will now theme correctly) ... */}
        <Col md={4}><Card className="shadow-sm border-0 h-100"><Card.Body className="text-center"><Card.Title className="text-muted">Total Analyses</Card.Title><Card.Text className="display-4 fw-bold">{stats.totalAnalyses}</Card.Text></Card.Body></Card></Col>
        <Col md={4}><Card className="shadow-sm border-0 h-100"><Card.Body className="text-center"><Card.Title className="text-danger">AI-Generated Detected</Card.Title><Card.Text className="display-4 fw-bold">{stats.deepfakeCount}</Card.Text></Card.Body></Card></Col>
        <Col md={4}><Card className="shadow-sm border-0 h-100"><Card.Body className="text-center"><Card.Title className="text-success">Real Media Verified</Card.Title><Card.Text className="display-4 fw-bold">{stats.realCount}</Card.Text></Card.Body></Card></Col>
      </Row>

      <Row className="g-4">
        {/* Recent Activity */}
        <Col lg={7}>
          <Card className="shadow-sm border-0 h-100">
            {/* **** 5. REMOVED bg-white CLASS **** */}
            <Card.Header as="h5">Recent Activity</Card.Header>
            <Card.Body>
              {stats.recentAnalyses.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {stats.recentAnalyses.map(item => (
                    <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <span className={`fw-bold ${item.label === 'AI-generated' ? 'text-danger' : 'text-success'}`}>{item.label}</span>
                        <small className="d-block text-muted">{formatDateTime(item.timestamp)}</small>
                      </div>
                      <Link to={`/results/${item._id}`} className="btn btn-sm btn-outline-primary">View</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted text-center mt-3">No recent activity to display.</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Chart */}
        <Col lg={5}>
          <Card className="shadow-sm border-0 h-100">
            {/* **** 6. REMOVED bg-white CLASS **** */}
            <Card.Header as="h5">Analysis Breakdown</Card.Header>
            <Card.Body className="d-flex justify-content-center align-items-center" style={{ maxHeight: '400px' }}>
              {stats.totalAnalyses > 0 ? (
                <Doughnut data={chartData} options={chartOptions} />
              ) : (
                <p className="text-muted">No data to display. Run an analysis!</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
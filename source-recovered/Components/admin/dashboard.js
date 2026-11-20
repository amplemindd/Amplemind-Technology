import { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";

function Dashboard({ changePage }) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCareers: 0,
    totalServices: 0,
    totalProjects: 0,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await axios.get(
          "https://amplemindtechnologies.com/api/dashboard/stats",
        );

        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (error) {
        console.error("Dashboard Error:", error);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="admin-dashboard-container">
      {/* Top Bar Header */}
      <div className="admin-dashboard-header">
        <div className="admin-header-left">
          <h1>Dashboard</h1>
          <p>Welcome back, Admin 👋 Overviewing AmpleMind systems.</p>
        </div>

        <div className="admin-header-right">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search data, metrics, students..."
            />
          </div>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="admin-dashboard-cards">
        <div className="admin-dashboard-card border-career">
          <div className="admin-card-icon career-icon">
            <span>💼</span>
          </div>
          <div className="admin-card-info">
            <h3>Total Careers</h3>
            <h2>{stats.totalCareers}</h2>
            <p className="stat-trend positive">Active Job Posts</p>
          </div>
        </div>

        <div className="admin-dashboard-card border-service">
          <div className="admin-card-icon service-icon">
            <span>🛠️</span>
          </div>
          <div className="admin-card-info">
            <h3>Total Services</h3>
            <h2>{stats.totalServices}</h2>
            <p className="stat-trend standard">Available Services</p>
          </div>
        </div>

        <div className="admin-dashboard-card border-project">
          <div className="admin-card-icon project-icon">
            <span>🚀</span>
          </div>
          <div className="admin-card-info">
            <h3>Total Projects</h3>
            <h2>{stats.totalProjects}</h2>
            <p className="stat-trend positive">Completed Projects</p>
          </div>
        </div>

        <div className="admin-dashboard-card border-student">
          <div className="admin-card-icon student-icon">
            <span>👨‍🎓</span>
          </div>
          <div className="admin-card-info">
            <h3>Total Students</h3>
            <h2>{stats.totalStudents}</h2>
            <p className="stat-trend growth">Registered Students</p>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="admin-dashboard-content">
        {/* Left Side: Recent Activity Timeline */}
        <div className="admin-left">
          <div className="admin-card activity-card">
            <div className="card-header-inline">
              <h2>Recent System Activities</h2>
              <span className="live-indicator">
                <span className="blink-dot"></span> Live Updates
              </span>
            </div>

            <ul className="activity-list">
              <li>
                <span className="status-badge success">✓</span>
                <div className="activity-details">
                  <p className="activity-text">New Student Registered</p>
                  <span className="activity-time">Just now</span>
                </div>
              </li>

              <li>
                <span className="status-badge success">✓</span>
                <div className="activity-details">
                  <p className="activity-text">Career Added Successfully</p>
                  <span className="activity-time">10 mins ago</span>
                </div>
              </li>

              <li>
                <span className="status-badge info">⚡</span>
                <div className="activity-details">
                  <p className="activity-text">Service Information Updated</p>
                  <span className="activity-time">1 hour ago</span>
                </div>
              </li>

              <li>
                <span className="status-badge success">✓</span>
                <div className="activity-details">
                  <p className="activity-text">Payment Gateway Sync Received</p>
                  <span className="activity-time">3 hours ago</span>
                </div>
              </li>

              <li>
                <span className="status-badge info">⚡</span>
                <div className="activity-details">
                  <p className="activity-text">
                    Batch Completion Certificate Generated
                  </p>
                  <span className="activity-time">Yesterday</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Quick Action Panel */}
        <div className="admin-right">
          <div className="admin-card actions-card">
            <h2>Quick Actions</h2>
            <p className="card-subtitle">
              Manage modules and post updates instantly.
            </p>

            <div className="actions-grid">
              <button
                className="action-btn"
                onClick={() => changePage("careers")}
              >
                <span>➕</span> Add Career
              </button>

              <button
                className="action-btn"
                onClick={() => changePage("services")}
              >
                <span>🛠️</span> Add Service
              </button>

              <button
                className="action-btn"
                onClick={() => changePage("projects")}
              >
                <span>🚀</span> Add Project
              </button>

              <button
                className="action-btn"
                onClick={() => changePage("students")}
              >
                <span>👨‍🎓</span> Add Student
              </button>

              <button
                className="action-btn outline full-width"
                onClick={() => changePage("applications")}
              >
                <span>📋</span> View Applications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [studentSidebarOpen, setStudentSidebarOpen] = useState(false);
  const [studentProfile, setStudentProfile] = useState(null);

  const [dailyGoalMinutes] = useState(60);
  const [completedMinutes, setCompletedMinutes] = useState(40);

  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(1500);

  const [studentDashboardData, setStudentDashboardData] = useState({
    totalCourses: 0,
    totalTests: 0,
    completedCourses: 0,
    totalCertificates: 0,
    dueFees: 0,
    progress: 0,
    learningStreak: 7,
  });

  const [skillsProficiency, setSkillsProficiency] = useState([]);
  const [milestones, setMilestones] = useState([]);

  const loadStudentDashboard = useCallback(async () => {
    try {
      const token = localStorage.getItem("studentToken");

      if (!token) {
        navigate("/student-login");
        return;
      }

      const response = await axios.get(
        "https://amplemindtechnologies.com/api/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const studentData = response.data.student;
      setStudentProfile(studentData);

      setStudentDashboardData({
        totalCourses: 4,
        totalTests: 12,
        completedCourses: 2,
        totalCertificates: 1,
        dueFees: studentData.dueAmount || 0,
        progress: studentData.dueAmount === 0 ? 85 : 60,
        learningStreak: 7,
      });

      setSkillsProficiency([
        { skill: "Java Programming", level: 80, color: "#02af48" },
        { skill: "SQL & Databases", level: 85, color: "#f59e0b" },
        { skill: "Frontend Development", level: 70, color: "#0ea5e9" },
        { skill: "Backend REST APIs", level: 65, color: "#8b5cf6" },
      ]);

      setMilestones([
        {
          id: 1,
          title: "Course Registration",
          status: "completed",
          date: "Verified",
        },
        {
          id: 2,
          title: "Database & Backend Fundamentals",
          status: "completed",
          date: "Passed",
        },
        {
          id: 3,
          title: "Full Stack Mini Project",
          status: "in-progress",
          date: "In Review",
        },
        {
          id: 4,
          title: "Final Placement Drive Eligibility",
          status: "pending",
          date: "Upcoming",
        },
      ]);
    } catch (error) {
      console.error(error);
      localStorage.removeItem("student");
      localStorage.removeItem("studentToken");
      navigate("/student-login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadStudentDashboard();
  }, [loadStudentDashboard]);

  useEffect(() => {
    let interval = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const toggleTimer = () => setTimerRunning(!timerRunning);
  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(1500);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${remSecs < 10 ? "0" : ""}${remSecs}`;
  };

  const studentLogout = () => {
    localStorage.removeItem("student");
    localStorage.removeItem("studentToken");
    navigate("/student-login");
  };

  if (loading) {
    return (
      <div className="amb-std-dashboard-loader">
        <div className="amb-std-loader"></div>
        <h2>Loading Student Portal...</h2>
      </div>
    );
  }

  return (
    <div className="amb-std-dashboard-container">
      {studentSidebarOpen && (
        <div
          className="amb-std-dashboard-overlay"
          onClick={() => setStudentSidebarOpen(false)}
        ></div>
      )}

      <aside
        className={`amb-std-dashboard-sidebar ${
          studentSidebarOpen ? "active" : ""
        }`}
      >
        <div className="amb-std-sidebar-header">
          <div className="amb-std-logo-section">
            <h2>AmpleMind</h2>
            <span>Student Hub</span>
          </div>

          {studentSidebarOpen && (
            <button
              className="amb-std-close-sidebar"
              onClick={() => setStudentSidebarOpen(false)}
            >
              ✕
            </button>
          )}
        </div>

        <div className="amb-std-sidebar-profile">
          {studentProfile?.profileImage ? (
            <img
              className="amb-std-sidebar-profile-image"
              src={
                "https://amplemindtechnologies.com" +
                studentProfile.profileImage
              }
              alt="Student"
            />
          ) : (
            <div className="amb-std-sidebar-avatar">
              {studentProfile?.name
                ? studentProfile.name.charAt(0).toUpperCase()
                : "S"}
            </div>
          )}

          <h3>{studentProfile?.name}</h3>
          <p>{studentProfile?.email}</p>
        </div>

        <ul className="amb-std-sidebar-menu">
          <li className="active">
            <span>🏠</span>
            Dashboard
          </li>

          <li onClick={() => navigate("/my-courses")}>
            <span>📚</span>
            My Courses
          </li>

          <li onClick={() => navigate("/my-tests")}>
            <span>📝</span>
            My Tests
          </li>

          <li onClick={() => navigate("/results")}>
            <span>📊</span>
            Results
          </li>

          <li onClick={() => navigate("/certificates")}>
            <span>🏆</span>
            Certificates
          </li>

          <li onClick={() => navigate("/payments")}>
            <span>💳</span>
            Payments
          </li>

          <li onClick={() => navigate("/profile")}>
            <span>👤</span>
            My Profile
          </li>

          <li onClick={studentLogout}>
            <span>🚪</span>
            Logout
          </li>
        </ul>
      </aside>

      <main className="amb-std-dashboard-main">
        <div className="amb-std-dashboard-navbar">
          <div className="amb-std-navbar-left">
            <button
              className="amb-std-menu-btn"
              onClick={() => setStudentSidebarOpen(true)}
            >
              ☰
            </button>

            <div className="amb-std-navbar-title">
              <h2>Student Overview</h2>
              <p>
                Welcome back,
                <strong> {studentProfile?.name}</strong>
              </p>
            </div>
          </div>

          <div className="amb-std-navbar-search">
            <input type="text" placeholder="Search modules, notes, topics..." />
          </div>

          <div className="amb-std-navbar-right">
            <div className="amb-std-streak-pill">
              🔥 {studentDashboardData.learningStreak} Day Streak
            </div>

            <div
              className="amb-std-navbar-profile"
              onClick={() => navigate("/profile")}
            >
              {studentProfile?.profileImage ? (
                <img
                  className="amb-std-navbar-profile-image"
                  src={
                    "https://amplemindtechnologies.com" +
                    studentProfile.profileImage
                  }
                  alt="Student"
                />
              ) : (
                <div className="amb-std-navbar-avatar">
                  {studentProfile?.name
                    ? studentProfile.name.charAt(0).toUpperCase()
                    : "S"}
                </div>
              )}

              <div>
                <h4>{studentProfile?.name}</h4>
                <span>{studentProfile?.studentId || "Student"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="amb-std-dashboard-body">
          {/* Identity & Profile Overview Card */}
          <section className="amb-std-welcome-section">
            <div className="amb-std-welcome-left">
              <span className="amb-std-welcome-badge">
                Verified Academic Account ✓
              </span>

              <h1>
                Hello,
                <span> {studentProfile?.name}</span>
              </h1>

              <p>
                Track your active course metrics, view attendance, complete
                assessments and manage your learning milestones.
              </p>

              <div className="amb-std-details">
                <div className="amb-std-detail-card">
                  <h5>Student ID</h5>
                  <span>{studentProfile?.studentId || "N/A"}</span>
                </div>

                <div className="amb-std-detail-card">
                  <h5>Roll Number</h5>
                  <span>{studentProfile?.rollNumber || "N/A"}</span>
                </div>

                <div className="amb-std-detail-card">
                  <h5>Enrolled Course</h5>
                  <span>
                    {studentProfile?.course || "Full Stack Engineering"}
                  </span>
                </div>

                <div className="amb-std-detail-card">
                  <h5>Batch</h5>
                  <span>{studentProfile?.batch || "Active Batch"}</span>
                </div>
              </div>
            </div>

            <div className="amb-std-welcome-right">
              {studentProfile?.profileImage ? (
                <img
                  className="amb-std-welcome-profile-image"
                  src={
                    "https://amplemindtechnologies.com" +
                    studentProfile.profileImage
                  }
                  alt="Student Profile"
                />
              ) : (
                <div className="amb-std-welcome-avatar">
                  {studentProfile?.name
                    ? studentProfile.name.charAt(0).toUpperCase()
                    : "S"}
                </div>
              )}
            </div>
          </section>

          {/* Interactive Widgets Row */}
          <section className="amb-std-unique-row">
            <div className="amb-std-card-widget">
              <div className="amb-std-widget-header">
                <h3>Daily Study Goal 🎯</h3>
                <span>
                  {completedMinutes} / {dailyGoalMinutes} Mins
                </span>
              </div>
              <div className="amb-std-progress-bar">
                <div
                  className="amb-std-progress-fill"
                  style={{
                    width: `${(completedMinutes / dailyGoalMinutes) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="amb-std-widget-subtext">
                20 minutes left to achieve today's learning target!
              </p>
            </div>

            <div className="amb-std-card-widget amb-std-timer-widget">
              <div className="amb-std-widget-header">
                <h3>Focus Study Mode ⏱️</h3>
              </div>
              <div className="amb-std-timer-display">
                {formatTime(timerSeconds)}
              </div>
              <div className="amb-std-timer-controls">
                <button
                  className="amb-std-timer-btn amb-std-primary"
                  onClick={toggleTimer}
                >
                  {timerRunning ? "Pause" : "Start Session"}
                </button>

                <button
                  className="amb-std-timer-btn amb-std-secondary"
                  onClick={resetTimer}
                >
                  Reset
                </button>
              </div>
            </div>
          </section>

          {/* Stat Cards Grid */}
          <section className="amb-std-dashboard-stats">
            <div className="amb-std-stat-card">
              <div className="amb-std-stat-icon">📚</div>
              <div className="amb-std-stat-content">
                <h2>{studentDashboardData.totalCourses}</h2>
                <p>Enrolled Courses</p>
              </div>
            </div>

            <div className="amb-std-stat-card">
              <div className="amb-std-stat-icon">📝</div>
              <div className="amb-std-stat-content">
                <h2>{studentDashboardData.totalTests}</h2>
                <p>Total Tests</p>
              </div>
            </div>

            <div className="amb-std-stat-card">
              <div className="amb-std-stat-icon">🎓</div>
              <div className="amb-std-stat-content">
                <h2>{studentDashboardData.completedCourses}</h2>
                <p>Completed Modules</p>
              </div>
            </div>

            <div className="amb-std-stat-card">
              <div className="amb-std-stat-icon">🏆</div>
              <div className="amb-std-stat-content">
                <h2>{studentDashboardData.totalCertificates}</h2>
                <p>Certificates Earned</p>
              </div>
            </div>
          </section>

          {/* Skill Breakdown & Roadmap */}
          <section className="amb-std-interactive-grid">
            <div className="amb-std-skills-card">
              <h3>Technical Proficiency ⚡</h3>
              <div className="amb-std-skills-list">
                {skillsProficiency.map((item, index) => (
                  <div key={index} className="amb-std-skill-item">
                    <div className="amb-std-skill-header">
                      <span>{item.skill}</span>
                      <span>{item.level}%</span>
                    </div>
                    <div className="amb-std-skill-bar-track">
                      <div
                        className="amb-std-skill-bar-fill"
                        style={{
                          width: `${item.level}%`,
                          backgroundColor: item.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="amb-std-timeline-card">
              <h3>Learning Roadmap 🚀</h3>
              <div className="amb-std-roadmap-timeline">
                {milestones.map((m) => (
                  <div
                    key={m.id}
                    className={`amb-std-timeline-node ${m.status}`}
                  >
                    <div className="amb-std-node-icon"></div>
                    <div className="amb-std-node-content">
                      <h4>{m.title}</h4>
                      <span>{m.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Progress & Financial Overview */}
          <section className="amb-std-dashboard-bottom">
            <div className="amb-std-progress-card">
              <div className="amb-std-card-header">
                <h3>Overall Course Completion</h3>
                <span>{studentDashboardData.progress}%</span>
              </div>

              <div className="amb-std-progress-bar">
                <div
                  className="amb-std-progress-fill"
                  style={{
                    width: `${studentDashboardData.progress}%`,
                  }}
                ></div>
              </div>

              <p>
                Keep completing assignments to boost your overall completion
                percentage.
              </p>
            </div>

            <div className="amb-std-fees-card">
              <div className="amb-std-card-header">
                <h3>Pending Due Amount</h3>
              </div>

              <h2>₹{studentDashboardData.dueFees}</h2>

              <button
                className="amb-std-pay-now-btn"
                onClick={() => navigate("/payments")}
              >
                Pay Outstanding Fees
              </button>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="amb-std-quick-actions">
            <h2>Portal Quick Actions</h2>

            <div className="amb-std-action-grid">
              <div
                className="amb-std-action-card"
                onClick={() => navigate("/my-courses")}
              >
                <span>📚</span>
                <h4>My Courses</h4>
              </div>

              <div
                className="amb-std-action-card"
                onClick={() => navigate("/my-tests")}
              >
                <span>📝</span>
                <h4>My Tests</h4>
              </div>

              <div
                className="amb-std-action-card"
                onClick={() => navigate("/results")}
              >
                <span>📊</span>
                <h4>Results</h4>
              </div>

              <div
                className="amb-std-action-card"
                onClick={() => navigate("/profile")}
              >
                <span>👤</span>
                <h4>Edit Profile</h4>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;

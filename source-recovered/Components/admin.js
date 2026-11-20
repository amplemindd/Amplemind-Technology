import { useEffect, useState } from "react";
import axios from "axios";

import Dashboard from "./admin/dashboard";
import Students from "./admin/students";
import StudentDetails from "./admin/StudentDetails";
import Results from "./admin/results";
import Certificates from "./admin/certificates";
import Courses from "./admin/courses";
import Careers from "./admin/careers";
import Services from "./admin/services";
import Projects from "./admin/projects";
import Users from "./admin/users";
import Applications from "./admin/applications";
import Blogs from "./admin/blogs";
import Settings from "./admin/settings";

import "./admin/admin.css";

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoggingIn(true);

    try {
      const res = await axios.post(
        "https://amplemindtechnologies.com/api/admin/login",
        {
          email,
          password,
        },
      );

      if (res.data.success) {
        setTimeout(() => {
          localStorage.setItem("adminToken", res.data.token);

          localStorage.setItem("admin", JSON.stringify(res.data.admin));

          setIsLoggedIn(true);
          setIsLoggingIn(false);
        }, 2000);
      } else {
        setIsLoggingIn(false);

        alert(res.data.message);
      }
    } catch (error) {
      setIsLoggingIn(false);

      console.log(error);

      alert(error.response?.data?.message || "Login Failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    setIsLoggedIn(false);
  };

  const changePage = (page) => {
    setActivePage(page);

    setSidebarOpen(false);
  };

  const openStudentDetails = (student) => {
    setSelectedStudent(student);

    setActivePage("student-details");

    setSidebarOpen(false);
  };

  const backToStudents = () => {
    setSelectedStudent(null);

    setActivePage("students");
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div className="login-logo">
            <img src="/AmpleMind.jpeg" alt="AmpleMind" />

            <h2>Admin Login</h2>

            <p>AmpleMind Technologies</p>
          </div>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input"
              required
              disabled={isLoggingIn}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              required
              disabled={isLoggingIn}
            />

            <button
              type="submit"
              className={`admin-login-btn ${
                isLoggingIn ? "loading-active" : ""
              }`}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? <div className="spinner"></div> : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {!sidebarOpen && (
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
      )}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>
          ✕
        </button>

        <h2 className="admin-logo">AMPLEMIND</h2>

        <ul className="admin-menu">
          {/* Dashboard */}

          <li
            className={activePage === "dashboard" ? "active" : ""}
            onClick={() => changePage("dashboard")}
          >
            📊 Dashboard
          </li>

          {/* Students */}

          <li
            className={activePage === "students" ? "active" : ""}
            onClick={() => changePage("students")}
          >
            👨‍🎓 Students
          </li>

          {/* Analytics */}

          <li
            className={activePage === "analytics" ? "active" : ""}
            onClick={() => changePage("analytics")}
          >
            📈 Analytics
          </li>

          {/* Results */}

          <li
            className={activePage === "results" ? "active" : ""}
            onClick={() => changePage("results")}
          >
            📊 Results
          </li>

          {/* Certificates */}

          <li
            className={activePage === "certificates" ? "active" : ""}
            onClick={() => changePage("certificates")}
          >
            🏆 Certificates
          </li>

          {/* Courses */}

          <li
            className={activePage === "courses" ? "active" : ""}
            onClick={() => changePage("courses")}
          >
            📚 Courses
          </li>

          {/* Careers */}

          <li
            className={activePage === "careers" ? "active" : ""}
            onClick={() => changePage("careers")}
          >
            💼 Careers
          </li>

          {/* Services */}

          <li
            className={activePage === "services" ? "active" : ""}
            onClick={() => changePage("services")}
          >
            🛠 Services
          </li>

          {/* Projects */}

          <li
            className={activePage === "projects" ? "active" : ""}
            onClick={() => changePage("projects")}
          >
            🚀 Projects
          </li>

          {/* Applications */}

          <li
            className={activePage === "applications" ? "active" : ""}
            onClick={() => changePage("applications")}
          >
            📄 Applications
          </li>

          {/* Blogs */}

          <li
            className={activePage === "blogs" ? "active" : ""}
            onClick={() => changePage("blogs")}
          >
            📰 Blogs
          </li>

          {/* Users */}

          <li
            className={activePage === "users" ? "active" : ""}
            onClick={() => changePage("users")}
          >
            👥 Users
          </li>

          {/* Settings */}

          <li
            className={activePage === "settings" ? "active" : ""}
            onClick={() => changePage("settings")}
          >
            ⚙ Settings
          </li>
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* ==================================================
          ADMIN CONTENT
      ================================================== */}

      <div className="admin-content">
        {activePage === "dashboard" && <Dashboard changePage={changePage} />}

        {activePage === "students" && (
          <Students openStudentDetails={openStudentDetails} />
        )}

        {activePage === "analytics" && (
          <div id="student-analytics-mount" className="student-analytics-page" />
        )}

        {activePage === "results" && <Results />}

        {activePage === "certificates" && <Certificates />}

        {activePage === "student-details" && (
          <StudentDetails student={selectedStudent} goBack={backToStudents} />
        )}

        {activePage === "courses" && <Courses />}

        {activePage === "careers" && <Careers />}

        {activePage === "services" && <Services />}

        {activePage === "projects" && <Projects />}

        {activePage === "applications" && <Applications />}

        {activePage === "blogs" && <Blogs />}

        {activePage === "users" && <Users />}

        {activePage === "settings" && <Settings />}
      </div>
    </div>
  );
}

export default Admin;

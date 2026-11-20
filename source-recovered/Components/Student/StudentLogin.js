import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentLogin.css";

const StudentLogin = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setMessage("");

    try {
      const res = await axios.post(
        "https://amplemindtechnologies.com/api/auth/student-login",
        formData,
      );

      console.log("✅ Status:", res.status);
      console.log("✅ Response:", res.data);

      localStorage.setItem("studentToken", res.data.token);

      localStorage.setItem("student", JSON.stringify(res.data.student));

      console.log("✅ Saved Token:", localStorage.getItem("studentToken"));

      console.log("✅ Saved Student:", localStorage.getItem("student"));

      setMessage("Login Successful! Redirecting...");

      setTimeout(() => {
        navigate("/student-dashboard");
      }, 3000);
    } catch (error) {
      console.log("❌ Error:", error);

      console.log("❌ Status:", error.response?.status);

      console.log("❌ Response:", error.response?.data);

      alert(error.response?.data?.message || "Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-login-container">
      <div className="student-login-wrapper">
        <div className="student-login-left">
          <div className="student-login-overlay">
            <h1>
              Welcome to
              <span> AmpleMind</span>
            </h1>

            <p>
              Learn. Build. Grow. Start your learning journey with India's
              modern LMS platform.
            </p>

            <div className="student-login-features">
              <div>✔ Live Classes</div>

              <div>✔ Online Tests</div>

              <div>✔ Certificates</div>

              <div>✔ Placement Support</div>
            </div>
          </div>
        </div>

        <div className="student-login-right">
          <div className="student-login-card">
            <h2>Student Login</h2>

            <p>Login to continue your learning journey.</p>

            {message && (
              <div className="student-success-message">{message}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="student-input-group">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="student-input-group">
                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="student-login-links">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

              <button
                type="submit"
                className="student-login-btn"
                disabled={loading}
              >
                {loading ? "Logging In..." : "Login"}
              </button>

              <div className="student-register-text">
                Don't have an account?
                <Link to="/student-register">Register</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;

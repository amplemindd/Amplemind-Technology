import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentRegister.css";
const StudentRegister = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",

    email: "",

    phone: "",

    course: "",

    password: "",

    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match");
    }

    setLoading(true);

    try {
      const {
        confirmPassword,

        ...studentData
      } = formData;

      const res = await axios.post(
        "https://amplemindtechnologies.com/api/auth/student-register",

        studentData,
      );

      alert(res.data.message || "Registration Successful");

      navigate("/student-login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-register-container">
      <div className="student-register-wrapper">
        <div className="student-register-left">
          <div className="student-register-overlay">
            <h1>
              Join
              <span> AmpleMind</span>
            </h1>

            <p>
              Register today and start learning with live classes, projects,
              assignments, tests and placement support.
            </p>

            <div className="student-register-features">
              <div>📚 Industry Ready Courses</div>

              <div>💻 Live Coding Classes</div>

              <div>📝 Online Tests</div>

              <div>🏆 Certificates & Placements</div>
            </div>
          </div>
        </div>

        <div className="student-register-right">
          <div className="student-register-card">
            <h2>Student Registration</h2>

            <p>Create your student account.</p>

            <form onSubmit={handleSubmit}>
              <div className="student-register-input-group">
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="student-register-input-group">
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

              <div className="student-register-input-group">
                <label>Mobile Number</label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter mobile number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="student-register-input-group">
                <label>Select Course</label>

                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Course</option>

                  <option value="Java Full Stack">Java Full Stack</option>

                  <option value="Python Full Stack">Python Full Stack</option>

                  <option value="React Development">React Development</option>

                  <option value="MERN Stack">MERN Stack</option>

                  <option value="Data Analytics">Data Analytics</option>

                  <option value="UI/UX Design">UI / UX Design</option>
                </select>
              </div>
              <div className="student-register-input-group">
                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="student-register-input-group">
                <label>Confirm Password</label>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="student-register-btn"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Register Now"}
              </button>

              <div className="student-register-login-text">
                Already have an account?
                <Link to="/student-login">Login</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;

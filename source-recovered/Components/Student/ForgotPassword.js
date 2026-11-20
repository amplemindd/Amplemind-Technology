import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Student.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your registered email.");

      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://amplemindtechnologies.com/api/auth/forgot-password",

        {
          email: email,
        },
      );

      if (res.data.success) {
        alert(res.data.message);

        navigate("/verify-otp", {
          state: {
            email: email,
          },
        });
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Unable to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-container">
      <div className="student-card">
        <h2>Forgot Password</h2>

        <p>Enter your registered email address to receive OTP.</p>

        <form onSubmit={handleSubmit}>
          <div className="student-input-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter Registered Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="student-btn" disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <div className="student-register-link">
          <Link to="/student-login">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Student.css";

const ResetPassword = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email || "";

  const otp = location.state?.otp || "";

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    newPassword: "",

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

    if (!formData.newPassword) {
      alert("Please enter new password.");

      return;
    }

    if (!formData.confirmPassword) {
      alert("Please confirm your password.");

      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match.");

      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://amplemindtechnologies.com/api/auth/reset-password",

        {
          email,

          otp,

          newPassword: formData.newPassword,

          confirmPassword: formData.confirmPassword,
        },
      );

      if (res.data.success) {
        alert(res.data.message);

        navigate("/student-login");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-container">
      <div className="student-card">
        <h2>Reset Password</h2>

        <p>Create your new password.</p>

        <form onSubmit={handleSubmit}>
          <div className="student-input-group">
            <label>New Password</label>

            <input
              type="password"
              name="newPassword"
              placeholder="Enter New Password"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="student-input-group">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="student-btn" disabled={loading}>
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        <div className="student-register-link">
          <Link to="/student-login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

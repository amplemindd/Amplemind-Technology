import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Student.css";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      return alert("New Password and Confirm Password do not match.");
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("studentToken");

      const res = await axios.put(
        "https://amplemindtechnologies.com/api/student/change-password",
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(res.data.message || "Password changed successfully.");

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      navigate("/profile");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-page">
      <div className="page-header">
        <h2>Change Password</h2>

        <button className="student-btn" onClick={() => navigate("/profile")}>
          Back
        </button>
      </div>

      <div className="student-card">
        <form onSubmit={handleSubmit}>
          <div className="student-input-group">
            <label>Current Password</label>

            <input
              type="password"
              name="currentPassword"
              placeholder="Enter Current Password"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
          </div>

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
            <label>Confirm New Password</label>

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
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

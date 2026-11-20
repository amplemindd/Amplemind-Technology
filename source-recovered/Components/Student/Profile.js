import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [message, setMessage] = useState({ text: "", type: "" });

  const [profile, setProfile] = useState({
    profileImage: "",
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    studentId: "",
    rollNumber: "",
    course: "",
    batch: "",
    qualification: "",
    college: "",
    totalFees: 0,
    paidAmount: 0,
    dueAmount: 0,
    paymentStatus: "",
    certificateStatus: "",
    status: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("studentToken");
      const res = await axios.get(
        "https://amplemindtechnologies.com/api/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const student = res.data.student;
      setProfile({
        ...student,
        dob: student.dob ? student.dob.substring(0, 10) : "",
      });

      if (student.profileImage) {
        setPreviewImage(
          "https://amplemindtechnologies.com" + student.profileImage,
        );
      }
    } catch (error) {
      console.error(error);
      setMessage({
        text: error.response?.data?.message || "Unable to load profile.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage({ text: "", type: "" });
      const token = localStorage.getItem("studentToken");
      const formData = new FormData();

      if (profile.phone?.trim()) formData.append("phone", profile.phone.trim());
      if (profile.dob && profile.dob !== "null")
        formData.append("dob", profile.dob);
      if (profile.gender) formData.append("gender", profile.gender);
      if (profile.address?.trim())
        formData.append("address", profile.address.trim());
      if (profile.city?.trim()) formData.append("city", profile.city.trim());
      if (profile.state?.trim()) formData.append("state", profile.state.trim());
      if (profile.country?.trim())
        formData.append("country", profile.country.trim());

      if (selectedImage) {
        formData.append("profileImage", selectedImage);
      }

      const res = await axios.put(
        "https://amplemindtechnologies.com/api/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setMessage({
        text: res.data.message || "Profile Updated Successfully!",
        type: "success",
      });

      setTimeout(() => {
        navigate("/student-dashboard");
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage({
        text: error.response?.data?.message || "Profile Update Failed",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading Profile Details...</p>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      {message.text && (
        <div className={`toast-message toast-${message.type}`}>
          <span>{message.type === "success" ? "✓" : "✕"}</span>
          <span>{message.text}</span>
        </div>
      )}

      <div className="profile-container">
        {/* Top Identity Hero Card */}
        <div className="profile-hero-card">
          <div className="avatar-upload-group">
            <div className="avatar-preview">
              {previewImage ? (
                <img src={previewImage} alt="Profile Avatar" />
              ) : (
                <div className="avatar-placeholder">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : "S"}
                </div>
              )}
              <label
                htmlFor="avatar-file-input"
                className="avatar-edit-overlay"
                title="Change Photo"
              >
                📷
              </label>
            </div>
            <input
              id="avatar-file-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden-file-input"
            />
          </div>

          <div className="profile-hero-info">
            <span className="hero-badge">Student Portal</span>
            <h2>{profile.name || "Student Name"}</h2>
            <p className="hero-email">{profile.email}</p>
            <div className="hero-meta-row">
              <span className="meta-pill">
                ID: {profile.studentId || "N/A"}
              </span>
              <span className="meta-pill">
                Roll: {profile.rollNumber || "N/A"}
              </span>
              <span className="meta-pill course-pill">
                {profile.course || "General"}
              </span>
            </div>
          </div>

          <div className="hero-status-container">
            <span
              className={`status-pill pill-${(profile.status || "active").toLowerCase()}`}
            >
              <span className="status-dot"></span>
              {profile.status || "Active"}
            </span>
          </div>
        </div>

        {/* Financial Overview Grid */}
        <div className="stats-summary-grid">
          <div className="stat-card">
            <span className="stat-label">Total Fees</span>
            <span className="stat-value">₹{profile.totalFees || 0}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Paid Amount</span>
            <span className="stat-value text-success">
              ₹{profile.paidAmount || 0}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Due Amount</span>
            <span className="stat-value text-danger">
              ₹{profile.dueAmount || 0}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Payment Status</span>
            <span
              className={`status-badge badge-${(profile.paymentStatus || "pending").toLowerCase()}`}
            >
              {profile.paymentStatus || "Pending"}
            </span>
          </div>
        </div>

        {/* Edit & Details Form Layout */}
        <form onSubmit={handleSubmit} className="profile-form-layout">
          {/* Form Card 1: Editable Personal Info */}
          <div className="form-card">
            <div className="card-header">
              <h3>Personal Information</h3>
              <p>Update your editable contact details and location</p>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  disabled
                  className="readonly-input"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="readonly-input"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="+91 00000 00000"
                  value={profile.phone || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={profile.dob || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={profile.gender || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  placeholder="e.g. India"
                  value={profile.country || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="e.g. Maharashtra"
                  value={profile.state || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Mumbai"
                  value={profile.city || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Permanent Address</label>
                <textarea
                  rows="3"
                  name="address"
                  placeholder="Enter complete address"
                  value={profile.address || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Form Card 2: Read-Only Academic Records */}
          <div className="form-card">
            <div className="card-header">
              <h3>Academic & Institutional Details</h3>
              <p>Managed directly by institute administration</p>
            </div>

            <div className="info-display-grid">
              <div className="info-item">
                <span className="info-label">Student ID</span>
                <span className="info-value">
                  {profile.studentId || "Not Assigned"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Roll Number</span>
                <span className="info-value">
                  {profile.rollNumber || "Not Assigned"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Course</span>
                <span className="info-value">
                  {profile.course || "Not Assigned"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Batch</span>
                <span className="info-value">
                  {profile.batch || "Not Assigned"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Qualification</span>
                <span className="info-value">
                  {profile.qualification || "Not Assigned"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">College</span>
                <span className="info-value">
                  {profile.college || "Not Assigned"}
                </span>
              </div>
              <div className="info-item highlight-box">
                <span className="info-label">Certificate Status</span>
                <span className="info-value text-accent">
                  {profile.certificateStatus || "Not Eligible"}
                </span>
              </div>
            </div>
          </div>

          {/* Save Action Button */}
          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? "Saving Changes..." : "Save Profile Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

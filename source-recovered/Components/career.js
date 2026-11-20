import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/career.css";

function Careers() {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    qualification: "",
    experience: "",
    address: "",
    message: "",
    resume: null,
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        "https://amplemindtechnologies.com/api/jobs/",
      );
      if (response.data.success) {
        setJobs(response.data.jobs);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error(error);
      setJobs([]);
    }
  };

  const handleChange = (e) => {
    setApplicationData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleResume = (e) => {
    if (e.target.files && e.target.files[0]) {
      setApplicationData((prev) => ({
        ...prev,
        resume: e.target.files[0],
      }));
    }
  };

  const submitApplication = async () => {
    setMessage({ type: "", text: "" });

    if (
      !applicationData.name ||
      !applicationData.email ||
      !applicationData.phone
    ) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields marked with *.",
      });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", applicationData.name);
      formData.append("email", applicationData.email);
      formData.append("phone", applicationData.phone);
      formData.append("course", applicationData.course);
      formData.append("qualification", applicationData.qualification);
      formData.append("experience", applicationData.experience);
      formData.append("address", applicationData.address);
      formData.append("message", applicationData.message);

      if (applicationData.resume) {
        formData.append("resume", applicationData.resume);
      }

      const response = await axios.post(
        "https://amplemindtechnologies.com/api/applications/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text:
            response.data.message ||
            "Application submitted successfully! We'll get back to you soon.",
        });

        setApplicationData({
          name: "",
          email: "",
          phone: "",
          course: "",
          qualification: "",
          experience: "",
          address: "",
          message: "",
          resume: null,
        });

        setTimeout(() => {
          setShowForm(false);
          setMessage({ type: "", text: "" });
        }, 2200);
      } else {
        setMessage({
          type: "error",
          text: response.data.message || "Application submission failed.",
        });
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Server connection failed. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="amp-career-wrapper">
      <div className="amp-career-container">
        {/* HERO SECTION */}
        <header className="amp-career-header">
          <span className="amp-career-badge">WE'RE HIRING</span>
          <h1>Build Your Future With Us</h1>
          <p>
            Explore exciting career opportunities, work with cutting-edge tech,
            and grow in a highly dynamic and collaborative environment.
          </p>
        </header>

        {/* MODAL APPLICATION FORM */}
        {showForm && (
          <div className="amp-application-overlay">
            <div className="amp-application-form">
              <button
                className="amp-form-close"
                onClick={() => {
                  setShowForm(false);
                  setMessage({ type: "", text: "" });
                }}
                aria-label="Close form"
              >
                ✕
              </button>

              <div className="amp-form-header">
                <div>
                  <h2>Apply for Position</h2>
                  <p className="amp-form-subtitle">
                    Fill in your details below
                  </p>
                </div>
                {applicationData.course && (
                  <span className="amp-job-tag">{applicationData.course}</span>
                )}
              </div>

              {message.text && (
                <div
                  className={
                    message.type === "success"
                      ? "amp-success-message"
                      : "amp-error-message"
                  }
                >
                  {message.type === "success" ? "✓ " : "⚠️ "}
                  {message.text}
                </div>
              )}

              <div className="amp-form-inputs">
                <div className="amp-input-row">
                  <div className="amp-input-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. John Doe"
                      value={applicationData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="amp-input-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={applicationData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="amp-input-row">
                  <div className="amp-input-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={applicationData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="amp-input-group">
                    <label>Highest Qualification</label>
                    <input
                      type="text"
                      name="qualification"
                      placeholder="e.g. B.Tech / B.E / BCA"
                      value={applicationData.qualification}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="amp-input-group">
                  <label>Experience Level</label>
                  <input
                    type="text"
                    name="experience"
                    placeholder="e.g. 2+ Years / Fresher"
                    value={applicationData.experience}
                    onChange={handleChange}
                  />
                </div>

                <div className="amp-input-group">
                  <label>Current Address</label>
                  <textarea
                    name="address"
                    rows="2"
                    placeholder="City, State, Country"
                    value={applicationData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="amp-input-group">
                  <label>Cover Note / Intro</label>
                  <textarea
                    name="message"
                    rows="3"
                    placeholder="Tell us briefly why you're a great fit..."
                    value={applicationData.message}
                    onChange={handleChange}
                  />
                </div>

                {/* UPLOAD RESUME */}
                <div className="amp-file-upload">
                  <label>Upload Resume (PDF, DOC, DOCX)</label>
                  <div className="amp-dropzone">
                    <input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResume}
                    />
                    <div className="amp-dropzone-content">
                      <span className="amp-upload-icon">📄</span>
                      <span>
                        {applicationData.resume
                          ? applicationData.resume.name
                          : "Click to browse or drag & drop resume"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="amp-application-buttons">
                <button
                  className="amp-submit-btn"
                  onClick={submitApplication}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="amp-btn-loading">Submitting...</span>
                  ) : (
                    "Submit Application"
                  )}
                </button>

                <button
                  className="amp-cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setMessage({ type: "", text: "" });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* JOBS LIST GRID */}
        <section className="amp-career-jobs">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div className="amp-job-card" key={job._id || job.id}>
                <div className="amp-job-card-top">
                  <h2>{job.title}</h2>
                  <span className="amp-status-badge">
                    {job.status || "Open"}
                  </span>
                </div>

                <div className="amp-job-info">
                  <div className="amp-info-row">
                    <span className="amp-info-label">📍 Location</span>
                    <span className="amp-info-value">
                      {job.location || "Remote / On-site"}
                    </span>
                  </div>

                  <div className="amp-info-row">
                    <span className="amp-info-label">💼 Experience</span>
                    <span className="amp-info-value">
                      {job.experience || "Not Specified"}
                    </span>
                  </div>

                  <div className="amp-info-row">
                    <span className="amp-info-label">💰 Salary</span>
                    <span className="amp-info-value">
                      {job.salary || "Best in Industry"}
                    </span>
                  </div>
                </div>

                <button
                  className="amp-apply-btn"
                  onClick={() => {
                    setApplicationData({
                      name: "",
                      email: "",
                      phone: "",
                      course: job.title,
                      qualification: "",
                      experience: "",
                      address: "",
                      message: "",
                      resume: null,
                    });
                    setMessage({ type: "", text: "" });
                    setShowForm(true);
                  }}
                >
                  Apply Now <span>→</span>
                </button>
              </div>
            ))
          ) : (
            <div className="amp-no-job">
              <div className="amp-no-job-icon">💼</div>
              <h2>No Current Openings</h2>
              <p>
                There are no job openings matching your criteria right now.
                Check back soon or follow us for future opportunities.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Careers;

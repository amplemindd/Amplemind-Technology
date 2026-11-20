import { useEffect, useState } from "react";
import axios from "axios";
import "./applications.css";

function Applications() {
  // ==========================================
  // States
  // ==========================================

  const [applications, setApplications] = useState([]);

  const [statistics, setStatistics] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
  });

  const [search, setSearch] = useState("");

  const [selectedApplication, setSelectedApplication] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [loading, setLoading] = useState(false);

  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {
    fetchApplications();
    fetchStatistics();
  }, []);

  // ==========================================
  // Fetch Applications
  // ==========================================

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://amplemindtechnologies.com/api/applications/",
      );

      if (res.data.success) {
        setApplications(res.data.applications || []);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error("Applications Error :", error);

      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Fetch Statistics
  // ==========================================

  const fetchStatistics = async () => {
    try {
      const res = await axios.get(
        "https://amplemindtechnologies.com/api/applications/statistics",
      );

      if (res.data.success) {
        setStatistics(res.data.statistics);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================================
  // Delete Application
  // ==========================================

  const deleteApplication = async (id) => {
    const confirmDelete = window.confirm("Delete this application?");

    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `https://amplemindtechnologies.com/api/applications/${id}`,
      );

      if (res.data.success) {
        fetchApplications();

        fetchStatistics();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================================
  // Update Application
  // ==========================================

  const updateApplication = async () => {
    try {
      const formData = new FormData();

      formData.append("name", selectedApplication.name);

      formData.append("email", selectedApplication.email);

      formData.append("phone", selectedApplication.phone);

      formData.append("course", selectedApplication.course);

      formData.append("qualification", selectedApplication.qualification || "");

      formData.append("experience", selectedApplication.experience || "");

      formData.append("address", selectedApplication.address || "");

      formData.append("message", selectedApplication.message || "");

      formData.append("status", selectedApplication.status || "Pending");

      const res = await axios.put(
        `https://amplemindtechnologies.com/api/applications/${selectedApplication._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.success) {
        fetchApplications();

        fetchStatistics();

        setShowEditModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================================
  // Search
  // ==========================================

  const filteredApplications = applications.filter((application) => {
    const keyword = search.toLowerCase();

    return (
      application.name?.toLowerCase().includes(keyword) ||
      application.email?.toLowerCase().includes(keyword) ||
      application.phone?.toLowerCase().includes(keyword) ||
      application.course?.toLowerCase().includes(keyword) ||
      application.status?.toLowerCase().includes(keyword)
    );
  });

  // ==========================================
  // View
  // ==========================================

  const handleView = (application) => {
    setSelectedApplication(application);

    setShowViewModal(true);
  };

  // ==========================================
  // Edit
  // ==========================================

  const handleEdit = (application) => {
    setSelectedApplication(application);

    setShowEditModal(true);
  };

  return (
    <div className="amp-app-wrapper">
      <div className="amp-app-container">
        {/* ===========================
            Header
        ============================ */}

        <header className="amp-app-header">
          <div className="amp-header-title">
            <span className="amp-app-badge">ADMIN DASHBOARD</span>

            <h1>Applications Management</h1>

            <p>
              Review, manage and update candidate applications from one place.
            </p>
          </div>

          <div className="amp-search-box">
            <span className="amp-search-icon">🔍</span>

            <input
              type="text"
              placeholder="Search by Name, Email, Phone, Course or Status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* ===========================
            Statistics
        ============================ */}

        <section className="amp-app-cards">
          <div className="amp-stat-card total">
            <div className="amp-stat-icon">📑</div>

            <div className="amp-stat-content">
              <h2>{statistics.totalApplications}</h2>

              <p>Total Applications</p>
            </div>
          </div>

          <div className="amp-stat-card pending">
            <div className="amp-stat-icon">⏳</div>

            <div className="amp-stat-content">
              <h2>{statistics.pendingApplications}</h2>

              <p>Pending Review</p>
            </div>
          </div>

          <div className="amp-stat-card approved">
            <div className="amp-stat-icon">✅</div>

            <div className="amp-stat-content">
              <h2>{statistics.approvedApplications}</h2>

              <p>Approved</p>
            </div>
          </div>

          <div className="amp-stat-card rejected">
            <div className="amp-stat-icon">❌</div>

            <div className="amp-stat-content">
              <h2>{statistics.rejectedApplications}</h2>

              <p>Rejected</p>
            </div>
          </div>
        </section>

        {/* ===========================
            Desktop Table
        ============================ */}

        <section className="amp-table-wrapper">
          <table className="amp-app-table">
            <thead>
              <tr>
                <th>Candidate</th>

                <th>Email</th>

                <th>Phone</th>

                <th>Course</th>

                <th>Status</th>

                <th>Resume</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="amp-no-data-td">
                    Loading Applications...
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="amp-no-data-td">
                    <div className="amp-no-data-inner">
                      <span>📂</span>

                      <p>No Applications Found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <strong className="amp-candidate-name">{app.name}</strong>
                    </td>

                    <td>{app.email}</td>

                    <td>{app.phone}</td>

                    <td>
                      <span className="amp-course-tag">{app.course}</span>
                    </td>

                    <td>
                      <span
                        className={`amp-status ${(
                          app.status || "Pending"
                        ).toLowerCase()}`}
                      >
                        {app.status || "Pending"}
                      </span>
                    </td>

                    <td>
                      {app.resume ? (
                        <a
                          href={`https://amplemindtechnologies.com${app.resume}`}
                          target="_blank"
                          rel="noreferrer"
                          className="amp-resume-btn"
                        >
                          📄 Resume
                        </a>
                      ) : (
                        <span className="amp-no-resume">No Resume</span>
                      )}
                    </td>

                    <td>
                      <div className="amp-action-buttons">
                        <button
                          className="amp-btn view"
                          onClick={() => handleView(app)}
                        >
                          View
                        </button>

                        <button
                          className="amp-btn edit"
                          onClick={() => handleEdit(app)}
                        >
                          Edit
                        </button>

                        <button
                          className="amp-btn delete"
                          onClick={() => deleteApplication(app._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* ===========================
            Mobile Cards
        ============================ */}

        <section className="amp-app-mobile">
          {filteredApplications.length === 0 ? (
            <div className="amp-no-data">No Applications Found</div>
          ) : (
            filteredApplications.map((app) => (
              <div className="amp-mobile-card" key={app._id}>
                <div className="amp-mobile-card-header">
                  <h3>{app.name}</h3>

                  <span
                    className={`amp-status ${(
                      app.status || "Pending"
                    ).toLowerCase()}`}
                  >
                    {app.status || "Pending"}
                  </span>
                </div>

                <div className="amp-mobile-details">
                  <p>
                    <strong>Email :</strong> {app.email}
                  </p>

                  <p>
                    <strong>Phone :</strong> {app.phone}
                  </p>

                  <p>
                    <strong>Course :</strong> {app.course}
                  </p>
                </div>

                <div className="amp-mobile-actions">
                  {app.resume && (
                    <a
                      href={`https://amplemindtechnologies.com${app.resume}`}
                      target="_blank"
                      rel="noreferrer"
                      className="amp-resume-btn"
                    >
                      📄 Resume
                    </a>
                  )}

                  <button
                    className="amp-btn view"
                    onClick={() => handleView(app)}
                  >
                    View
                  </button>

                  <button
                    className="amp-btn edit"
                    onClick={() => handleEdit(app)}
                  >
                    Edit
                  </button>

                  <button
                    className="amp-btn delete"
                    onClick={() => deleteApplication(app._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
        {/* ===========================
            View Application Modal
        ============================ */}

        {showViewModal && selectedApplication && (
          <div className="amp-modal-overlay">
            <div className="amp-modal-box">
              <div className="amp-modal-header">
                <h2>Application Details</h2>

                <button
                  className="amp-close-icon"
                  onClick={() => setShowViewModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="amp-modal-body">
                <div className="amp-detail-row">
                  <span className="amp-detail-label">Name</span>
                  <span className="amp-detail-val">
                    {selectedApplication.name}
                  </span>
                </div>

                <div className="amp-detail-row">
                  <span className="amp-detail-label">Email</span>
                  <span className="amp-detail-val">
                    {selectedApplication.email}
                  </span>
                </div>

                <div className="amp-detail-row">
                  <span className="amp-detail-label">Phone</span>
                  <span className="amp-detail-val">
                    {selectedApplication.phone}
                  </span>
                </div>

                <div className="amp-detail-row">
                  <span className="amp-detail-label">Course</span>
                  <span className="amp-detail-val">
                    {selectedApplication.course}
                  </span>
                </div>

                <div className="amp-detail-row">
                  <span className="amp-detail-label">Qualification</span>
                  <span className="amp-detail-val">
                    {selectedApplication.qualification || "N/A"}
                  </span>
                </div>

                <div className="amp-detail-row">
                  <span className="amp-detail-label">Experience</span>
                  <span className="amp-detail-val">
                    {selectedApplication.experience || "N/A"}
                  </span>
                </div>

                <div className="amp-detail-row">
                  <span className="amp-detail-label">Address</span>
                  <span className="amp-detail-val">
                    {selectedApplication.address || "N/A"}
                  </span>
                </div>

                <div className="amp-detail-row block">
                  <span className="amp-detail-label">Message</span>

                  <p className="amp-detail-msg">
                    {selectedApplication.message || "No Message"}
                  </p>
                </div>

                <div className="amp-detail-row">
                  <span className="amp-detail-label">Status</span>

                  <span
                    className={`amp-status ${(
                      selectedApplication.status || "Pending"
                    ).toLowerCase()}`}
                  >
                    {selectedApplication.status || "Pending"}
                  </span>
                </div>

                {selectedApplication.resume && (
                  <div className="amp-modal-resume-wrap">
                    <a
                      href={`https://amplemindtechnologies.com${selectedApplication.resume}`}
                      target="_blank"
                      rel="noreferrer"
                      className="amp-resume-btn full"
                    >
                      📄 View Resume
                    </a>
                  </div>
                )}
              </div>

              <div className="amp-modal-footer">
                <button
                  className="amp-cancel-btn"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===========================
            Edit Modal
        ============================ */}

        {showEditModal && selectedApplication && (
          <div className="amp-modal-overlay">
            <div className="amp-modal-box">
              <div className="amp-modal-header">
                <h2>Edit Application</h2>

                <button
                  className="amp-close-icon"
                  onClick={() => setShowEditModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="amp-modal-body edit-grid">
                <div className="amp-form-group">
                  <label>Name</label>
                  <input
                    value={selectedApplication.name}
                    onChange={(e) =>
                      setSelectedApplication({
                        ...selectedApplication,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="amp-form-group">
                  <label>Email</label>
                  <input
                    value={selectedApplication.email}
                    onChange={(e) =>
                      setSelectedApplication({
                        ...selectedApplication,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="amp-form-group">
                  <label>Phone</label>
                  <input
                    value={selectedApplication.phone}
                    onChange={(e) =>
                      setSelectedApplication({
                        ...selectedApplication,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="amp-form-group">
                  <label>Course</label>
                  <input
                    value={selectedApplication.course}
                    onChange={(e) =>
                      setSelectedApplication({
                        ...selectedApplication,
                        course: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="amp-form-group full-width">
                  <label>Status</label>

                  <select
                    value={selectedApplication.status || "Pending"}
                    onChange={(e) =>
                      setSelectedApplication({
                        ...selectedApplication,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="Pending">Pending</option>

                    <option value="Approved">Approved</option>

                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="amp-modal-footer">
                <button className="amp-save-btn" onClick={updateApplication}>
                  Save Changes
                </button>

                <button
                  className="amp-cancel-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Applications;

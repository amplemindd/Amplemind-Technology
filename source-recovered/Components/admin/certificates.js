import { useEffect, useState } from "react";
import "./certificates.css";

const API_BASE_URL = "https://amplemindtechnologies.com";

const Certificates = () => {
  const [students, setStudents] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [course, setCourse] = useState("");
  const [certificateName, setCertificateName] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents();
    fetchCertificates();
  }, []);

  // Fetch Students
  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/students`);
      const data = await response.json();
      if (response.ok) {
        setStudents(data.students || data.data || []);
      }
    } catch (err) {
      console.error("Students API Error:", err);
    }
  };

  // Fetch Certificates
  const fetchCertificates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/student/certificates`);
      const data = await response.json();
      if (response.ok) {
        setCertificates(data.certificates || []);
      }
    } catch (err) {
      console.error("Certificates API Error:", err);
    }
  };

  // Handle Student Selection
  const handleStudentChange = (e) => {
    const selectedId = e.target.value;
    setStudentId(selectedId);

    const selectedStudent = students.find(
      (student) => String(student._id) === String(selectedId),
    );

    if (selectedStudent) {
      setStudentName(selectedStudent.name || "");
      setCourse(selectedStudent.course || "");
    } else {
      setStudentName("");
      setCourse("");
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!studentId) return setError("Please select a student.");
    if (!certificateName) return setError("Please enter certificate name.");
    if (!certificateUrl) return setError("Please enter certificate URL.");

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/student/certificate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          student_name: studentName,
          certificate_name: certificateName,
          course: course,
          certificate_url: certificateUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || data.message || "Certificate creation failed.");
        return;
      }

      setMessage("Certificate added successfully!");
      setStudentId("");
      setStudentName("");
      setCourse("");
      setCertificateName("");
      setCertificateUrl("");

      fetchCertificates();
    } catch (err) {
      console.error("Certificate Error:", err);
      setError("Unable to connect to backend service.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this certificate?",
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/student/certificate/${id}`,
        { method: "DELETE" },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || data.message || "Delete failed.");
        return;
      }

      setMessage("Certificate deleted successfully.");
      fetchCertificates();
    } catch (err) {
      console.error("Delete Error:", err);
      setError("Unable to delete certificate.");
    }
  };

  return (
    <div className="admin-certificates-page">
      {/* Header */}
      <div className="admin-certificates-header">
        <h1>Certificate Management</h1>
        <p>Issue, track, and manage official student completion credentials.</p>
      </div>

      {/* Global Alerts */}
      {message && (
        <div className="certificate-success-message">
          <span>✓</span> {message}
        </div>
      )}

      {error && (
        <div className="certificate-error-message">
          <span>✕</span> {error}
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="admin-certificates-layout">
        {/* Left Form Card */}
        <div className="certificate-form-card">
          <h2>Issue New Certificate</h2>
          <form onSubmit={handleSubmit}>
            <div className="certificate-form-group">
              <label>
                Select Student <span>*</span>
              </label>
              <select value={studentId} onChange={handleStudentChange}>
                <option value="">-- Choose Student --</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="certificate-form-group">
              <label>Student Name</label>
              <input
                type="text"
                value={studentName}
                readOnly
                placeholder="Auto-filled student name"
                className="input-readonly"
              />
            </div>

            <div className="certificate-form-group">
              <label>Course Title</label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. Java Full Stack Web Development"
              />
            </div>

            <div className="certificate-form-group">
              <label>
                Certificate Title <span>*</span>
              </label>
              <input
                type="text"
                value={certificateName}
                onChange={(e) => setCertificateName(e.target.value)}
                placeholder="e.g. Certificate of Excellence"
              />
            </div>

            <div className="certificate-form-group">
              <label>
                Certificate URL / File Link <span>*</span>
              </label>
              <input
                type="text"
                value={certificateUrl}
                onChange={(e) => setCertificateUrl(e.target.value)}
                placeholder="/uploads/certificates/cert-101.pdf"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="add-certificate-btn"
            >
              {loading ? "Processing..." : "+ Issue Certificate"}
            </button>
          </form>
        </div>

        {/* Right Information Card */}
        <div className="certificate-info-card">
          <h2>Overview & Quick Guidelines</h2>
          <p>
            Ensure student information matches official records before
            submitting.
          </p>

          <div className="certificate-info-item">
            <div className="certificate-info-icon">🎓</div>
            <div>
              <strong>Total Issued</strong>
              <span>{certificates.length} Certificates Live</span>
            </div>
          </div>

          <div className="certificate-info-item">
            <div className="certificate-info-icon">⚡</div>
            <div>
              <strong>Auto-filling Enabled</strong>
              <span>
                Selecting a student auto-completes name & registered course.
              </span>
            </div>
          </div>

          <div className="certificate-info-item">
            <div className="certificate-info-icon">🔒</div>
            <div>
              <strong>Instant Verification</strong>
              <span>
                Uploaded URL links are immediately available to student portals.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Certificates List Section */}
      <div className="admin-certificate-list">
        <div className="certificate-list-header">
          <h2>All Issued Certificates ({certificates.length})</h2>
        </div>

        {certificates.length === 0 ? (
          <div className="certificate-empty-state">
            <p>
              No certificates issued yet. Select a student above to issue one.
            </p>
          </div>
        ) : (
          <div className="certificate-cards-grid">
            {certificates.map((cert) => (
              <div key={cert._id} className="admin-certificate-item">
                <div className="admin-certificate-student">
                  <div className="admin-certificate-top-bar">
                    <span className="admin-certificate-status">ISSUED</span>
                    <span className="admin-certificate-id">
                      ID: {cert.student_id ? cert.student_id.slice(-6) : "N/A"}
                    </span>
                  </div>
                  <h3>{cert.certificate_name}</h3>
                  <p className="student-name">
                    👤 <strong>{cert.student_name || "N/A"}</strong>
                  </p>
                  <p className="course-name">📚 {cert.course || "N/A"}</p>
                </div>

                <div className="admin-certificate-actions">
                  <a
                    href={cert.certificate_url}
                    target="_blank"
                    rel="noreferrer"
                    className="view-cert-btn"
                  >
                    View Document
                  </a>
                  <button
                    onClick={() => handleDelete(cert._id)}
                    className="delete-cert-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;

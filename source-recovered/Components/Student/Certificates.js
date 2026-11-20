import React, { useEffect, useState } from "react";

const API_BASE_URL = "https://amplemindtechnologies.com";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("studentToken");

      if (!token) {
        setError("Please login as a student first.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/student/my-certificates`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.detail || data?.message || "Unable to load certificates.",
        );
        return;
      }

      if (data.success) {
        setCertificates(data.certificates || []);
      } else {
        setError(data?.message || "Unable to load certificates.");
      }
    } catch (error) {
      console.error("Certificate API Error:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const getCertificateUrl = (url) => {
    if (!url) {
      return "#";
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    return `${API_BASE_URL}${url}`;
  };

  if (loading) {
    return (
      <div className="certificates-page">
        <div className="certificates-loading">Loading certificates...</div>
      </div>
    );
  }

  return (
    <div className="certificates-page">
      {/* Header */}
      <div className="certificates-header">
        <div>
          <h1>My Certificates</h1>
          <p>View and download your certificates.</p>
        </div>

        <button
          type="button"
          onClick={fetchCertificates}
          className="certificate-refresh-btn"
        >
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && <div className="certificate-error">{error}</div>}

      {/* No Certificates */}
      {!error && certificates.length === 0 && (
        <div className="no-certificates">
          <h2>No Certificates Available</h2>

          <p>
            Your certificates will appear here once they are issued by the
            admin.
          </p>
        </div>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <div className="certificates-grid">
          {certificates.map((certificate) => {
            const certificateUrl = getCertificateUrl(
              certificate.certificate_url,
            );

            return (
              <div className="certificate-card" key={certificate._id}>
                {/* Certificate Icon */}
                <div className="certificate-icon">🏆</div>

                {/* Certificate Details */}
                <div className="certificate-content">
                  <h2>{certificate.certificate_name || "Certificate"}</h2>

                  <div className="certificate-detail">
                    <span>Student Name</span>
                    <strong>{certificate.student_name || "-"}</strong>
                  </div>

                  <div className="certificate-detail">
                    <span>Course</span>
                    <strong>{certificate.course || "-"}</strong>
                  </div>

                  {certificate.issue_date && (
                    <div className="certificate-detail">
                      <span>Issue Date</span>
                      <strong>{certificate.issue_date}</strong>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="certificate-actions">
                    <a
                      href={certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-certificate-btn"
                    >
                      View Certificate
                    </a>

                    <a
                      href={certificateUrl}
                      download
                      className="download-certificate-btn"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Certificates;

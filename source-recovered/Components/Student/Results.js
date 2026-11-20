import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Results.css";

const Results = () => {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL"); // ALL | PASSED | FAILED | ABSENT

  // Fetch results from backend
  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("studentToken");

      if (!token) {
        navigate("/student-login");
        return;
      }

      const student = JSON.parse(localStorage.getItem("student") || "{}");

      const res = await axios.get(
        "https://amplemindtechnologies.com/api/results/my-results",
        {
          params: { email: student.email },
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.success) {
        setResults(res.data.results || []);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Fetch Results Error:", error);
      alert(
        error.response?.data?.message || "Failed to load examination results.",
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Memoized Filtered Results
  const filteredResults = useMemo(() => {
    return results.filter((item) => {
      // Search matching logic
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        item.testName?.toLowerCase().includes(term) ||
        item.subject?.toLowerCase().includes(term) ||
        item.course?.toLowerCase().includes(term) ||
        item.grade?.toLowerCase().includes(term);

      // Status Filter logic
      let matchesFilter = true;
      if (activeFilter === "PASSED") {
        matchesFilter = !item.isAbsent && item.percentage >= 40;
      } else if (activeFilter === "FAILED") {
        matchesFilter = !item.isAbsent && item.percentage < 40;
      } else if (activeFilter === "ABSENT") {
        matchesFilter = item.isAbsent;
      }

      return matchesSearch && matchesFilter;
    });
  }, [results, searchTerm, activeFilter]);

  // Metric Calculations
  const totalTests = results.length;
  const passedTests = results.filter(
    (r) => !r.isAbsent && r.percentage >= 40,
  ).length;
  const avgPercentage = totalTests
    ? (
        results.reduce((acc, curr) => acc + (curr.percentage || 0), 0) /
        totalTests
      ).toFixed(1)
    : 0;

  // Print/PDF Handler for individual report card with AmpleMind Branding
  const handlePrintResult = (result) => {
    const printWindow = window.open("", "_blank");
    const isPassed = !result.isAbsent && result.percentage >= 40;
    const statusText = result.isAbsent
      ? "ABSENT"
      : isPassed
        ? "PASSED"
        : "FAILED";
    const statusClass = result.isAbsent
      ? "status-absent"
      : isPassed
        ? "status-pass"
        : "status-fail";

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Academic Report Card - ${result.testName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
            
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }

            body {
              font-family: 'Plus Jakarta Sans', sans-serif;
              padding: 40px;
              background-color: #f8fafc;
              color: #0f172a;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .report-card {
              max-width: 800px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 16px;
              border: 1px solid #e2e8f0;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
              overflow: hidden;
            }

            /* Top AmpleMind Branding Bar */
            .brand-bar {
              background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
              padding: 28px 40px;
              color: #ffffff;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .brand-info h1 {
              font-size: 26px;
              font-weight: 800;
              letter-spacing: -0.5px;
              line-height: 1.2;
            }

            .brand-info p {
              font-size: 13px;
              color: #e0e7ff;
              font-weight: 500;
              margin-top: 4px;
              letter-spacing: 0.5px;
            }

            .badge-official {
              background: rgba(255, 255, 255, 0.18);
              backdrop-filter: blur(8px);
              border: 1px solid rgba(255, 255, 255, 0.3);
              padding: 6px 14px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 1px;
              text-transform: uppercase;
            }

            /* Report Title Header */
            .document-header {
              padding: 24px 40px 16px;
              border-bottom: 1px solid #f1f5f9;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .doc-title h2 {
              font-size: 18px;
              font-weight: 700;
              color: #1e293b;
            }

            .doc-title p {
              font-size: 12px;
              color: #64748b;
              margin-top: 2px;
            }

            .status-badge {
              padding: 6px 16px;
              border-radius: 30px;
              font-size: 12px;
              font-weight: 800;
              letter-spacing: 0.5px;
              text-transform: uppercase;
            }

            .status-pass { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
            .status-fail { background: #ffe4e6; color: #be123c; border: 1px solid #fecdd3; }
            .status-absent { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }

            /* Key Score Summary Cards */
            .score-summary-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 16px;
              padding: 24px 40px;
              background: #fafafa;
            }

            .score-card {
              background: #ffffff;
              padding: 16px;
              border-radius: 12px;
              border: 1px solid #e2e8f0;
              text-align: center;
            }

            .score-card span {
              font-size: 11px;
              font-weight: 600;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              display: block;
              margin-bottom: 6px;
            }

            .score-card h3 {
              font-size: 22px;
              font-weight: 800;
              color: #0f172a;
            }

            .score-card h3 small {
              font-size: 13px;
              color: #94a3b8;
              font-weight: 500;
            }

            /* Main Data Table */
            .content-body {
              padding: 8px 40px 32px;
            }

            .details-table {
              width: 100%;
              border-collapse: separate;
              border-spacing: 0;
              margin-top: 12px;
            }

            .details-table tr:nth-child(even) {
              background-color: #f8fafc;
            }

            .details-table th, .details-table td {
              padding: 14px 18px;
              font-size: 13.5px;
              border-bottom: 1px solid #e2e8f0;
            }

            .details-table th {
              width: 35%;
              text-align: left;
              color: #475569;
              font-weight: 600;
              background-color: #ffffff;
            }

            .details-table td {
              color: #0f172a;
              font-weight: 600;
            }

            /* Verification Footer */
            .report-footer {
              padding: 24px 40px 32px;
              background: #ffffff;
              border-top: 1px dashed #cbd5e1;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }

            .footer-meta {
              font-size: 11px;
              color: #94a3b8;
              line-height: 1.6;
            }

            .signature-box {
              text-align: center;
              width: 180px;
            }

            .signature-line {
              border-top: 1.5px solid #0f172a;
              margin-top: 40px;
              padding-top: 6px;
              font-size: 11px;
              font-weight: 700;
              color: #334155;
              text-transform: uppercase;
            }

            @media print {
              body { padding: 0; background: #fff; }
              .report-card { border: none; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="report-card">
            <div class="brand-bar">
              <div class="brand-info">
                <h1>AmpleMind</h1>
                <p>ACADEMIC EVALUATION & ASSESSMENT HUB</p>
              </div>
              <span class="badge-official">Official Transcript</span>
            </div>

            <div class="document-header">
              <div class="doc-title">
                <h2>Examination Performance Report</h2>
                <p>Issued by AmpleMind Educational Assessment System</p>
              </div>
              <span class="status-badge ${statusClass}">${statusText}</span>
            </div>

            <div class="score-summary-grid">
              <div class="score-card">
                <span>Marks Obtained</span>
                <h3>${result.obtainedMarks} <small>/ ${result.maxMarks || result.totalMarks || 100}</small></h3>
              </div>
              <div class="score-card">
                <span>Percentage</span>
                <h3 style="color: #4f46e5;">${result.percentage}%</h3>
              </div>
              <div class="score-card">
                <span>Final Grade</span>
                <h3 style="color: #10b981;">${result.grade || "N/A"}</h3>
              </div>
            </div>

            <div class="content-body">
              <table class="details-table">
                <tr>
                  <th>Test Name</th>
                  <td>${result.testName}</td>
                </tr>
                <tr>
                  <th>Subject</th>
                  <td>${result.subject || "N/A"}</td>
                </tr>
                <tr>
                  <th>Course / Program</th>
                  <td>${result.course || "N/A"}</td>
                </tr>
                <tr>
                  <th>Date of Examination</th>
                  <td>${new Date(result.examDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>
                </tr>
                <tr>
                  <th>Attendance Status</th>
                  <td>${result.isAbsent ? "Absent" : "Present"}</td>
                </tr>
                <tr>
                  <th>Evaluator Remarks</th>
                  <td>${result.remarks || "Satisfactory Performance"}</td>
                </tr>
              </table>
            </div>

            <div class="report-footer">
              <div class="footer-meta">
                <p><strong>AmpleMind Learning Technologies</strong></p>
                <p>Report Generated On: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                <p>Document ID: ${result._id || "AMP-" + Math.floor(100000 + Math.random() * 900000)}</p>
              </div>

              <div class="signature-box">
                <div class="signature-line">Authorized Signatory</div>
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  };

  return (
    <div className="res-page-container">
      {/* Top Header Controls */}
      <header className="res-page-header">
        <div className="res-header-left">
          <button
            className="res-back-btn"
            onClick={() => navigate("/student-dashboard")}
          >
            ← Back to Dashboard
          </button>
          <h1>Academic Results 📊</h1>
          <p>
            Review completed assessments, performance grades, and download
            report cards.
          </p>
        </div>

        <div className="res-search-wrapper">
          <span className="res-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search test, subject or grade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* Overview Metric Banner */}
      {!loading && results.length > 0 && (
        <section className="res-summary-banner">
          <div className="res-summary-card">
            <span className="res-card-label">Total Examinations</span>
            <h3>{totalTests}</h3>
          </div>
          <div className="res-summary-card">
            <span className="res-card-label">Tests Passed</span>
            <h3 style={{ color: "var(--accent-teal)" }}>{passedTests}</h3>
          </div>
          <div className="res-summary-card">
            <span className="res-card-label">Average Percentage</span>
            <h3>{avgPercentage}%</h3>
          </div>
        </section>
      )}

      {/* Interactive Filter Pills */}
      {!loading && results.length > 0 && (
        <div className="res-filter-bar">
          <span className="res-filter-title">Filter By Status:</span>
          <div className="res-filter-pills">
            <button
              className={`res-pill-btn ${activeFilter === "ALL" ? "active" : ""}`}
              onClick={() => setActiveFilter("ALL")}
            >
              All Tests ({totalTests})
            </button>
            <button
              className={`res-pill-btn ${activeFilter === "PASSED" ? "active" : ""}`}
              onClick={() => setActiveFilter("PASSED")}
            >
              Passed ✅
            </button>
            <button
              className={`res-pill-btn ${activeFilter === "FAILED" ? "active" : ""}`}
              onClick={() => setActiveFilter("FAILED")}
            >
              Failed ⚠️
            </button>
            <button
              className={`res-pill-btn ${activeFilter === "ABSENT" ? "active" : ""}`}
              onClick={() => setActiveFilter("ABSENT")}
            >
              Absent ❌
            </button>
          </div>
        </div>
      )}

      {/* Results View Area */}
      {loading ? (
        <div className="res-loader-container">
          <div className="res-spinner"></div>
          <p>Fetching your academic records...</p>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="res-empty-box">
          <div className="res-empty-icon">📜</div>
          <h3>No Academic Records Found</h3>
          <p>
            {results.length === 0
              ? "No examination results have been published to your account yet."
              : "No records match your search or filter parameters."}
          </p>
          {searchTerm && (
            <button
              className="res-reset-filter-btn"
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("ALL");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="res-results-grid">
          {filteredResults.map((result) => (
            <div className="res-card" key={result._id}>
              {/* Header Badges */}
              <div className="res-card-top">
                <span
                  className={`res-status-badge ${result.isAbsent ? "absent" : "present"}`}
                >
                  {result.isAbsent ? "Absent ❌" : "Present ✅"}
                </span>
                <span className="res-grade-badge">
                  Grade: {result.grade || "N/A"}
                </span>
              </div>

              <h3 className="res-test-title">{result.testName}</h3>

              <div className="res-meta-tags">
                <span className="res-chip">
                  📖 {result.subject || "General"}
                </span>
                <span className="res-chip">🎓 {result.course || "Module"}</span>
              </div>

              {/* Score Highlight Box */}
              <div className="res-score-box">
                <div className="res-score-main">
                  <span>Marks Obtained</span>
                  <h2>
                    {result.obtainedMarks}{" "}
                    <span>/ {result.maxMarks || result.totalMarks || 100}</span>
                  </h2>
                </div>
                <div className="res-score-percent">
                  <span>Score</span>
                  <h3>{result.percentage}%</h3>
                </div>
              </div>

              {/* Graphical Progress Bar */}
              <div className="res-progress-track">
                <div
                  className="res-progress-bar"
                  style={{
                    width: `${Math.min(Math.max(result.percentage, 0), 100)}%`,
                    backgroundColor:
                      result.percentage >= 75
                        ? "#10b981"
                        : result.percentage >= 50
                          ? "#f59e0b"
                          : "#f43f5e",
                  }}
                ></div>
              </div>

              {/* Metadata Footer */}
              <div className="res-card-footer">
                <div className="res-date-row">
                  <span>
                    <strong>Date:</strong>{" "}
                    {new Date(result.examDate).toLocaleDateString()}
                  </span>
                  <button
                    className="res-print-btn"
                    onClick={() => handlePrintResult(result)}
                    title="Print Report Card"
                  >
                    📄 Report Card
                  </button>
                </div>
                {result.remarks && (
                  <p className="res-remarks">
                    <strong>Remarks:</strong> {result.remarks}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Results;

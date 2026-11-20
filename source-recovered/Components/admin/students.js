import "./students.css";
import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";

function Students() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const initialFormState = useMemo(
    () => ({
      name: "",
      email: "",
      phone: "",
      studentId: "",
      course: "",
      batch: "",
      rollNumber: "",
      qualification: "",
      college: "",
      gender: "",
      dob: "",
      address: "",
      city: "",
      state: "",
      country: "",
      admissionDate: "",
      attendance: 0,
      presentDays: 0,
      absentDays: 0,
      totalTests: 0,
      completedTests: 0,
      averageScore: 0,
      progress: 0,
      paymentStatus: "Pending",
      totalFees: 0,
      paidAmount: 0,
      dueAmount: 0,
      certificateStatus: "Not Eligible",
      certificates: 0,
      status: "Active",
      profileImage: null,
    }),
    [],
  );

  const [studentData, setStudentData] = useState(initialFormState);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(
        "https://amplemindtechnologies.com/api/admin/students",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.success) {
        setStudents(res.data.students || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://amplemindtechnologies.com/api/courses/",
      );
      if (res.data.success) {
        setCourses(res.data.courses || []);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, [fetchStudents, fetchCourses]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      setStudentData((prev) => ({ ...prev, profileImage: files[0] }));
      return;
    }
    setStudentData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = useCallback(() => {
    setEditingId(null);
    setShowForm(false);
    setStudentData(initialFormState);
  }, [initialFormState]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const keyword = search.toLowerCase().trim();
      const searchMatch =
        !keyword ||
        student.name?.toLowerCase().includes(keyword) ||
        student.email?.toLowerCase().includes(keyword) ||
        student.phone?.includes(keyword) ||
        student.studentId?.toLowerCase().includes(keyword) ||
        student.rollNumber?.toLowerCase().includes(keyword);

      const courseMatch =
        courseFilter === "All" ? true : student.course === courseFilter;
      const statusMatch =
        statusFilter === "All" ? true : student.status === statusFilter;

      return searchMatch && courseMatch && statusMatch;
    });
  }, [students, search, courseFilter, statusFilter]);

  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "Active").length;
  const inactiveStudents = students.filter(
    (s) => s.status === "Inactive",
  ).length;

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const editStudent = (student) => {
    setEditingId(student._id);
    setStudentData({
      ...initialFormState,
      ...student,
      course: student.course || "",
      batch: student.batch || "",
      rollNumber: student.rollNumber || "",
      profileImage: null,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveStudent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();

      Object.keys(studentData).forEach((key) => {
        if (
          key === "profileImage" &&
          studentData.profileImage instanceof File
        ) {
          formData.append("profileImage", studentData.profileImage);
        } else if (
          key !== "profileImage" &&
          studentData[key] !== null &&
          studentData[key] !== undefined
        ) {
          formData.append(key, studentData[key]);
        }
      });

      const url = editingId
        ? `https://amplemindtechnologies.com/api/admin/students/${editingId}`
        : "https://amplemindtechnologies.com/api/admin/students";

      const method = editingId ? axios.put : axios.post;

      const res = await method(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        alert(
          editingId
            ? "Student Updated Successfully"
            : "Student Added Successfully",
        );
        fetchStudents();
        resetForm();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to save student.");
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.delete(
        `https://amplemindtechnologies.com/api/admin/students/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.success) fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const previewImage = () => {
    if (!studentData.profileImage) return null;
    if (studentData.profileImage instanceof File) {
      return URL.createObjectURL(studentData.profileImage);
    }
    return `https://amplemindtechnologies.com${studentData.profileImage}`;
  };

  // Predefined options list combined with API courses & student records
  const uniqueCourses = useMemo(() => {
    const defaultCourses = [
      "Java Full Stack",
      "Python Full Stack",
      "MERN Stack",
      "React Development",
      "Data Analytics",
      "UI/UX Design",
    ];
    const apiCourses = courses.map((c) => c.title || c.name).filter(Boolean);
    const studentCourses = students.map((s) => s.course).filter(Boolean);

    const merged = Array.from(
      new Set([...defaultCourses, ...apiCourses, ...studentCourses]),
    );
    return ["All", ...merged];
  }, [courses, students]);

  return (
    <div className="st-root">
      {/* Header */}
      <header className="st-header">
        <div className="st-header-meta">
          <span className="st-badge">ADMINISTRATION PORTAL</span>
          <h1 className="st-title">Student Directory</h1>
          <p className="st-subtitle">
            Manage, track, and edit enrolled students easily.
          </p>
        </div>
        <button
          className="st-btn st-btn-primary"
          onClick={() => {
            if (showForm) resetForm();
            else {
              resetForm();
              setShowForm(true);
            }
          }}
        >
          <span>{showForm ? "✕ Cancel" : "+ Add Student"}</span>
        </button>
      </header>

      {/* KPI Stats */}
      <div className="st-stats-grid">
        <div className="st-stat-card st-stat-total">
          <div className="st-stat-icon">🎓</div>
          <div className="st-stat-data">
            <h3>{totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className="st-stat-card st-stat-active">
          <div className="st-stat-icon">✅</div>
          <div className="st-stat-data">
            <h3>{activeStudents}</h3>
            <p>Active Enrolments</p>
          </div>
        </div>
        <div className="st-stat-card st-stat-inactive">
          <div className="st-stat-icon">⛔</div>
          <div className="st-stat-data">
            <h3>{inactiveStudents}</h3>
            <p>Inactive Enrolments</p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="st-filter-bar">
        <div className="st-search-wrapper">
          <span className="st-search-icon">🔍</span>
          <input
            type="text"
            className="st-input st-search-input"
            placeholder="Search by name, ID, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="st-dropdown-group">
          <select
            className="st-select"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            {uniqueCourses.map((course) => (
              <option key={course} value={course}>
                {course === "All" ? "All Courses" : course}
              </option>
            ))}
          </select>
          <select
            className="st-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Dynamic Form */}
      {showForm && (
        <div className="st-form-card">
          <div className="st-form-header">
            <h2>
              {editingId ? "Edit Student Details" : "Register New Student"}
            </h2>
            <button className="st-close-icon" onClick={resetForm}>
              ✕
            </button>
          </div>

          <form onSubmit={saveStudent}>
            <div className="st-form-grid">
              <div className="st-field">
                <label>Student Name *</label>
                <input
                  type="text"
                  name="name"
                  className="st-input"
                  value={studentData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="st-field">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="st-input"
                  value={studentData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="st-field">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  className="st-input"
                  value={studentData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field">
                <label>Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  className="st-input"
                  value={studentData.studentId}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field">
                <label>Course</label>
                <select
                  name="course"
                  className="st-select"
                  value={studentData.course}
                  onChange={handleChange}
                >
                  <option value="">Select Course</option>
                  <option value="Java Full Stack">Java Full Stack</option>
                  <option value="Python Full Stack">Python Full Stack</option>
                  <option value="MERN Stack">MERN Stack</option>
                  <option value="React Development">React Development</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                </select>
              </div>

              <div className="st-field">
                <label>Batch</label>
                <input
                  type="text"
                  name="batch"
                  className="st-input"
                  value={studentData.batch}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field">
                <label>Roll Number</label>
                <input
                  type="text"
                  name="rollNumber"
                  className="st-input"
                  value={studentData.rollNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field">
                <label>Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  className="st-input"
                  placeholder="e.g. B.Tech, MCA"
                  value={studentData.qualification}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field">
                <label>College</label>
                <input
                  type="text"
                  name="college"
                  className="st-input"
                  placeholder="College Name"
                  value={studentData.college}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field">
                <label>Gender</label>
                <select
                  name="gender"
                  className="st-select"
                  value={studentData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="st-field">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  className="st-input"
                  value={studentData.dob}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field">
                <label>Admission Date</label>
                <input
                  type="date"
                  name="admissionDate"
                  className="st-input"
                  value={studentData.admissionDate}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field">
                <label>Status</label>
                <select
                  name="status"
                  className="st-select"
                  value={studentData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="st-field st-field-full">
                <label>Address</label>
                <textarea
                  name="address"
                  className="st-textarea"
                  rows="2"
                  value={studentData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  className="st-input"
                  value={studentData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  className="st-input"
                  value={studentData.state}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  className="st-input"
                  value={studentData.country}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field">
                <label>Total Fees (₹)</label>
                <input
                  type="number"
                  name="totalFees"
                  className="st-input"
                  value={studentData.totalFees}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field">
                <label>Paid Amount (₹)</label>
                <input
                  type="number"
                  name="paidAmount"
                  className="st-input"
                  value={studentData.paidAmount}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field">
                <label>Due Amount (₹)</label>
                <input
                  type="number"
                  name="dueAmount"
                  className="st-input"
                  value={studentData.dueAmount}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field">
                <label>Payment Status</label>
                <select
                  name="paymentStatus"
                  className="st-select"
                  value={studentData.paymentStatus}
                  onChange={handleChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="Partial">Partial</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <div className="st-field">
                <label>Certificate Status</label>
                <select
                  name="certificateStatus"
                  className="st-select"
                  value={studentData.certificateStatus}
                  onChange={handleChange}
                >
                  <option value="Not Eligible">Not Eligible</option>
                  <option value="Eligible">Eligible</option>
                  <option value="Issued">Issued</option>
                </select>
              </div>

              <div className="st-field">
                <label>Attendance (%)</label>
                <input
                  type="number"
                  name="attendance"
                  className="st-input"
                  value={studentData.attendance}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field">
                <label>Present Days</label>
                <input
                  type="number"
                  name="presentDays"
                  className="st-input"
                  value={studentData.presentDays}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field">
                <label>Absent Days</label>
                <input
                  type="number"
                  name="absentDays"
                  className="st-input"
                  value={studentData.absentDays}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field">
                <label>Total Tests</label>
                <input
                  type="number"
                  name="totalTests"
                  className="st-input"
                  value={studentData.totalTests}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field">
                <label>Completed Tests</label>
                <input
                  type="number"
                  name="completedTests"
                  className="st-input"
                  value={studentData.completedTests}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field">
                <label>Average Score (%)</label>
                <input
                  type="number"
                  name="averageScore"
                  className="st-input"
                  value={studentData.averageScore}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field">
                <label>Course Progress (%)</label>
                <input
                  type="number"
                  name="progress"
                  className="st-input"
                  value={studentData.progress}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field st-field-full">
                <label>Profile Image</label>
                <div className="st-file-upload-container">
                  <input
                    type="file"
                    name="profileImage"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  <label
                    htmlFor="profileImage"
                    className="st-file-upload-label"
                  >
                    📁 Choose Photo...
                  </label>
                  {previewImage() && (
                    <img
                      src={previewImage()}
                      alt="Preview"
                      className="st-image-preview"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="st-form-actions">
              <button
                type="button"
                className="st-btn st-btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
              <button type="submit" className="st-btn st-btn-primary">
                {editingId ? "Update Student" : "Save Student"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Table */}
      <div className="st-table-container">
        <table className="st-table">
          <thead>
            <tr>
              <th className="col-roll">Roll No</th>
              <th className="col-student">Student</th>
              <th className="col-email">Email</th>
              <th className="col-phone">Phone</th>
              <th className="col-course">Course</th>
              <th className="col-batch">Batch</th>
              <th className="col-status">Status</th>
              <th className="col-actions text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="st-empty-cell">
                  Loading Students...
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="8" className="st-empty-cell">
                  No Students Found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td className="col-roll">
                    <span className="st-roll-tag">
                      {student.rollNumber || "N/A"}
                    </span>
                  </td>
                  <td className="col-student">
                    <div className="st-user-cell">
                      {student.profileImage ? (
                        <img
                          src={`https://amplemindtechnologies.com${student.profileImage}`}
                          alt=""
                          className="st-user-avatar"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="st-user-avatar-fallback"
                        style={{
                          display: student.profileImage ? "none" : "flex",
                        }}
                      >
                        {student.name?.charAt(0).toUpperCase() || "S"}
                      </div>
                      <div className="st-user-info">
                        <span className="st-user-name">{student.name}</span>
                        <small className="st-user-id">
                          ID: {student.studentId || "-"}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td className="col-email">
                    <span className="st-truncate-text" title={student.email}>
                      {student.email}
                    </span>
                  </td>
                  <td className="col-phone">{student.phone || "-"}</td>
                  <td className="col-course">
                    <span className="st-course-chip">
                      {student.course || "-"}
                    </span>
                  </td>
                  <td className="col-batch">{student.batch || "-"}</td>
                  <td className="col-status">
                    <span
                      className={`st-status-pill ${
                        student.status === "Active"
                          ? "st-status-active"
                          : "st-status-inactive"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="col-actions text-right">
                    <div className="st-action-row">
                      <button
                        className="st-btn-action st-btn-view"
                        onClick={() => handleViewStudent(student)}
                      >
                        View
                      </button>
                      <button
                        className="st-btn-action st-btn-edit"
                        onClick={() => editStudent(student)}
                      >
                        Edit
                      </button>
                      <button
                        className="st-btn-action st-btn-delete"
                        onClick={() => deleteStudent(student._id)}
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
      </div>

      {/* Details View Modal */}
      {showViewModal && selectedStudent && (
        <div className="st-modal-overlay">
          <div className="st-modal">
            <div className="st-modal-header">
              <h2>Student Detailed Profile</h2>
              <button
                className="st-close-icon"
                onClick={() => setShowViewModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="st-modal-body">
              <div className="st-profile-banner">
                {selectedStudent.profileImage ? (
                  <img
                    src={`https://amplemindtechnologies.com${selectedStudent.profileImage}`}
                    alt=""
                    className="st-profile-img"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="st-profile-img-fallback"
                  style={{
                    display: selectedStudent.profileImage ? "none" : "flex",
                  }}
                >
                  {selectedStudent.name?.charAt(0).toUpperCase() || "S"}
                </div>
                <div className="st-profile-meta">
                  <h3>{selectedStudent.name}</h3>
                  <p>{selectedStudent.course || "No Course Enrolled"}</p>
                  <div className="st-meta-tags">
                    <span className="st-chip">
                      Roll: {selectedStudent.rollNumber || "N/A"}
                    </span>
                    <span className="st-chip">
                      Batch: {selectedStudent.batch || "N/A"}
                    </span>
                    <span
                      className={`st-status-pill ${
                        selectedStudent.status === "Active"
                          ? "st-status-active"
                          : "st-status-inactive"
                      }`}
                    >
                      {selectedStudent.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="st-grid-details">
                <div className="st-detail-box">
                  <h4>Contact Info</h4>
                  <div className="st-kv-list">
                    <div>
                      <span>Email:</span>{" "}
                      <strong>{selectedStudent.email}</strong>
                    </div>
                    <div>
                      <span>Phone:</span>{" "}
                      <strong>{selectedStudent.phone || "-"}</strong>
                    </div>
                    <div>
                      <span>Student ID:</span>{" "}
                      <strong>{selectedStudent.studentId || "-"}</strong>
                    </div>
                    <div>
                      <span>Gender:</span>{" "}
                      <strong>{selectedStudent.gender || "-"}</strong>
                    </div>
                    <div>
                      <span>DOB:</span>{" "}
                      <strong>{selectedStudent.dob || "-"}</strong>
                    </div>
                  </div>
                </div>

                <div className="st-detail-box">
                  <h4>Academic Details</h4>
                  <div className="st-kv-list">
                    <div>
                      <span>Qualification:</span>{" "}
                      <strong>{selectedStudent.qualification || "-"}</strong>
                    </div>
                    <div>
                      <span>College:</span>{" "}
                      <strong>{selectedStudent.college || "-"}</strong>
                    </div>
                    <div>
                      <span>Admission:</span>{" "}
                      <strong>{selectedStudent.admissionDate || "-"}</strong>
                    </div>
                    <div>
                      <span>Certificate:</span>{" "}
                      <strong>{selectedStudent.certificateStatus}</strong>
                    </div>
                  </div>
                </div>

                <div className="st-detail-box">
                  <h4>Performance & Attendance</h4>
                  <div className="st-kv-list">
                    <div>
                      <span>Attendance:</span>{" "}
                      <strong>{selectedStudent.attendance || 0}%</strong>
                    </div>
                    <div>
                      <span>Present / Absent:</span>{" "}
                      <strong>
                        {selectedStudent.presentDays || 0} /{" "}
                        {selectedStudent.absentDays || 0} Days
                      </strong>
                    </div>
                    <div>
                      <span>Avg Test Score:</span>{" "}
                      <strong>{selectedStudent.averageScore || 0}%</strong>
                    </div>
                    <div>
                      <span>Tests Completed:</span>{" "}
                      <strong>
                        {selectedStudent.completedTests || 0} /{" "}
                        {selectedStudent.totalTests || 0}
                      </strong>
                    </div>
                    <div>
                      <span>Course Progress:</span>{" "}
                      <strong>{selectedStudent.progress || 0}%</strong>
                    </div>
                  </div>
                </div>

                <div className="st-detail-box">
                  <h4>Fees & Billing</h4>
                  <div className="st-kv-list">
                    <div>
                      <span>Total Fees:</span>{" "}
                      <strong>₹ {selectedStudent.totalFees || 0}</strong>
                    </div>
                    <div>
                      <span>Paid Amount:</span>{" "}
                      <strong>₹ {selectedStudent.paidAmount || 0}</strong>
                    </div>
                    <div>
                      <span>Due Amount:</span>{" "}
                      <strong>₹ {selectedStudent.dueAmount || 0}</strong>
                    </div>
                    <div>
                      <span>Payment Status:</span>{" "}
                      <strong>{selectedStudent.paymentStatus}</strong>
                    </div>
                  </div>
                </div>

                <div className="st-detail-box st-field-full">
                  <h4>Address Information</h4>
                  <p className="st-address-text">
                    {selectedStudent.address
                      ? `${selectedStudent.address}, `
                      : ""}
                    {selectedStudent.city ? `${selectedStudent.city}, ` : ""}
                    {selectedStudent.state ? `${selectedStudent.state}, ` : ""}
                    {selectedStudent.country || ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="st-modal-footer">
              <button
                className="st-btn st-btn-secondary"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;

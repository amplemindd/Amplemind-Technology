import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import "./courses.css";

const BASE_URL = "https://amplemindtechnologies.com";
const API_PREFIX = "/api/courses";

function Courses() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [courses, setCourses] = useState([]);
  const [statistics, setStatistics] = useState({
    totalCourses: 0,
    activeCourses: 0,
    inactiveCourses: 0,
    totalRevenue: 0,
  });

  // Filters & Sorting
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;

  // Form & Modals
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const emptyCourse = useMemo(
    () => ({
      title: "",
      category: "",
      instructor: "",
      shortDescription: "",
      description: "",
      duration: "",
      level: "Beginner",
      language: "English",
      price: "",
      discountPrice: "",
      status: "Active",
      thumbnail: null,
      totalStudents: 0,
      rating: 0,
    }),
    [],
  );

  const [courseData, setCourseData] = useState(emptyCourse);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${BASE_URL}${API_PREFIX}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCourses(response.data.courses || []);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error("Fetch Courses Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStatistics = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${BASE_URL}${API_PREFIX}/statistics`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setStatistics(response.data.statistics);
      }
    } catch (error) {
      console.error("Fetch Stats Error:", error);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchStatistics();
  }, [fetchCourses, fetchStatistics]);

  const resetForm = useCallback(() => {
    setEditingId(null);
    setShowForm(false);
    setCourseData(emptyCourse);
  }, [emptyCourse]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      setCourseData((prev) => ({
        ...prev,
        thumbnail: files && files.length > 0 ? files[0] : prev.thumbnail,
      }));
      return;
    }

    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getThumbnailUrl = (thumbnail) => {
    if (!thumbnail) return null;
    if (typeof thumbnail === "string") {
      if (thumbnail.startsWith("http")) return thumbnail;
      return `${BASE_URL}${thumbnail}`;
    }
    return null;
  };

  const previewThumbnail = () => {
    if (!courseData.thumbnail) return null;
    if (typeof courseData.thumbnail === "string") {
      return getThumbnailUrl(courseData.thumbnail);
    }
    if (courseData.thumbnail instanceof File) {
      return URL.createObjectURL(courseData.thumbnail);
    }
    return null;
  };

  const editCourse = (course) => {
    setEditingId(course._id);
    setCourseData({
      title: course.title || "",
      category: course.category || "",
      instructor: course.instructor || "",
      shortDescription: course.shortDescription || "",
      description: course.description || "",
      duration: course.duration || "",
      level: course.level || "Beginner",
      language: course.language || "English",
      price: course.price || "",
      discountPrice: course.discountPrice || "",
      status: course.status || "Active",
      thumbnail: course.thumbnail || null,
      totalStudents: course.totalStudents || 0,
      rating: course.rating || 0,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveCourse = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();

      Object.keys(courseData).forEach((key) => {
        if (key === "thumbnail" && courseData.thumbnail instanceof File) {
          formData.append("thumbnail", courseData.thumbnail);
        } else if (key !== "thumbnail" && courseData[key] !== null) {
          formData.append(key, courseData[key]);
        }
      });

      let response;
      if (editingId) {
        response = await axios.put(
          `${BASE_URL}${API_PREFIX}/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } else {
        response = await axios.post(`${BASE_URL}${API_PREFIX}/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.data.success) {
        alert(
          editingId
            ? "Course updated successfully!"
            : "Course published successfully!",
        );
        resetForm();
        await fetchCourses();
        await fetchStatistics();
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert(error.response?.data?.message || "Failed to save course.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async (courseId) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this course?",
      )
    )
      return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.delete(
        `${BASE_URL}${API_PREFIX}/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        await fetchCourses();
        await fetchStatistics();
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert(error.response?.data?.message || "Unable to delete course.");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(price || 0));
  };

  const filteredCourses = useMemo(() => {
    let data = [...courses];

    if (search.trim()) {
      const keyword = search.toLowerCase();
      data = data.filter(
        (course) =>
          course.title?.toLowerCase().includes(keyword) ||
          course.category?.toLowerCase().includes(keyword) ||
          course.instructor?.toLowerCase().includes(keyword),
      );
    }

    if (categoryFilter !== "All") {
      data = data.filter((course) => course.category === categoryFilter);
    }
    if (statusFilter !== "All") {
      data = data.filter((course) => course.status === statusFilter);
    }
    if (levelFilter !== "All") {
      data = data.filter((course) => course.level === levelFilter);
    }

    switch (sortBy) {
      case "title-asc":
        data.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "title-desc":
        data.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
        break;
      case "price-low":
        data.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        break;
      case "price-high":
        data.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        break;
      case "latest":
      default:
        data.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );
        break;
    }

    return data;
  }, [courses, search, categoryFilter, statusFilter, levelFilter, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, statusFilter, levelFilter, sortBy]);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse,
  );
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <div className="crs-container">
      {/* Header Bar */}
      <header className="crs-header">
        <div className="crs-title-meta">
          <span className="crs-portal-badge">ADMINISTRATION PORTAL</span>
          <h1>Courses & Catalog Management</h1>
          <p>
            Schedule courses, track active enrolments, and organize academic
            content.
          </p>
        </div>

        <button
          className="crs-btn crs-btn-primary"
          onClick={() => {
            if (showForm) resetForm();
            else {
              resetForm();
              setShowForm(true);
            }
          }}
        >
          {showForm ? "✕ Close Form" : "+ Create Course"}
        </button>
      </header>

      {/* KPI Stats Grid */}
      <div className="crs-stats-grid">
        <div className="crs-stat-card crs-stat-blue">
          <div className="crs-stat-icon">📚</div>
          <div className="crs-stat-info">
            <h3>{statistics.totalCourses}</h3>
            <p>Total Courses</p>
          </div>
        </div>

        <div className="crs-stat-card crs-stat-green">
          <div className="crs-stat-icon">✅</div>
          <div className="crs-stat-info">
            <h3>{statistics.activeCourses}</h3>
            <p>Active Enrolments</p>
          </div>
        </div>

        <div className="crs-stat-card crs-stat-red">
          <div className="crs-stat-icon">⚠️</div>
          <div className="crs-stat-info">
            <h3>{statistics.inactiveCourses}</h3>
            <p>Inactive Courses</p>
          </div>
        </div>

        <div className="crs-stat-card crs-stat-amber">
          <div className="crs-stat-icon">💰</div>
          <div className="crs-stat-info">
            <h3>{formatPrice(statistics.totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="crs-toolbar">
        <div className="crs-search-wrapper">
          <span className="crs-search-icon">🔍</span>
          <input
            type="text"
            className="crs-input crs-search-input"
            placeholder="Search by title, category, or instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="crs-filters-group">
          <select
            className="crs-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Programming">Programming</option>
            <option value="Web Development">Web Development</option>
            <option value="App Development">App Development</option>
            <option value="Data Science">Data Science</option>
            <option value="AI">AI & Machine Learning</option>
          </select>

          <select
            className="crs-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            className="crs-select"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            className="crs-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Sort: Latest</option>
            <option value="title-asc">Title: A-Z</option>
            <option value="title-desc">Title: Z-A</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Course Form Drawer */}
      {showForm && (
        <form className="crs-card crs-form-card" onSubmit={saveCourse}>
          <div className="crs-card-header">
            <div>
              <h2>
                {editingId
                  ? "Edit Course Specification"
                  : "Add New Course Record"}
              </h2>
              <p className="crs-card-subtitle">
                Fill in details to list the course on the platform
              </p>
            </div>
            <button
              type="button"
              className="crs-close-icon"
              onClick={resetForm}
            >
              ✕
            </button>
          </div>

          <div className="crs-form-grid">
            <div className="crs-field">
              <label>Course Title *</label>
              <input
                type="text"
                name="title"
                className="crs-input"
                placeholder="e.g. Master Full Stack Java"
                value={courseData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="crs-field">
              <label>Category *</label>
              <input
                type="text"
                name="category"
                className="crs-input"
                placeholder="e.g. Web Development"
                value={courseData.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="crs-field">
              <label>Instructor Name *</label>
              <input
                type="text"
                name="instructor"
                className="crs-input"
                placeholder="e.g. Gaurav Rajput"
                value={courseData.instructor}
                onChange={handleChange}
                required
              />
            </div>

            <div className="crs-field">
              <label>Duration</label>
              <input
                type="text"
                name="duration"
                className="crs-input"
                placeholder="e.g. 40 Hours / 8 Weeks"
                value={courseData.duration}
                onChange={handleChange}
              />
            </div>

            <div className="crs-field">
              <label>Difficulty Level</label>
              <select
                name="level"
                className="crs-select"
                value={courseData.level}
                onChange={handleChange}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="crs-field">
              <label>Language</label>
              <input
                type="text"
                name="language"
                className="crs-input"
                placeholder="e.g. English / Hindi"
                value={courseData.language}
                onChange={handleChange}
              />
            </div>

            <div className="crs-field">
              <label>Standard Price (₹) *</label>
              <input
                type="number"
                name="price"
                className="crs-input"
                placeholder="e.g. 4999"
                value={courseData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="crs-field">
              <label>Discount Price (₹)</label>
              <input
                type="number"
                name="discountPrice"
                className="crs-input"
                placeholder="e.g. 2999"
                value={courseData.discountPrice}
                onChange={handleChange}
              />
            </div>

            <div className="crs-field">
              <label>Status</label>
              <select
                name="status"
                className="crs-select"
                value={courseData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="crs-field crs-field-full">
              <label>Course Thumbnail Banner</label>
              <div className="crs-file-upload">
                <input
                  type="file"
                  id="crs-file-input"
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleChange}
                />
                <label htmlFor="crs-file-input" className="crs-file-btn">
                  📁 Choose Banner Image...
                </label>
                {previewThumbnail() && (
                  <img
                    src={previewThumbnail()}
                    alt="Preview"
                    className="crs-thumb-preview"
                  />
                )}
              </div>
            </div>

            <div className="crs-field crs-field-full">
              <label>Short Brief Description</label>
              <textarea
                rows="2"
                name="shortDescription"
                className="crs-textarea"
                placeholder="Summary for course cards..."
                value={courseData.shortDescription}
                onChange={handleChange}
              />
            </div>

            <div className="crs-field crs-field-full">
              <label>Full Curriculum Overview</label>
              <textarea
                rows="4"
                name="description"
                className="crs-textarea"
                placeholder="Detailed information on course modules..."
                value={courseData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="crs-form-actions">
            <button
              type="button"
              className="crs-btn crs-btn-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="crs-btn crs-btn-success"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Course"
                  : "Save Course"}
            </button>
          </div>
        </form>
      )}

      {/* Main Table */}
      {loading ? (
        <div className="crs-loading-box">
          <div className="crs-spinner"></div>
          <p>Loading course directory...</p>
        </div>
      ) : (
        <div className="crs-card crs-table-card">
          <div className="crs-table-wrapper">
            <table className="crs-table">
              <thead>
                <tr>
                  <th>Course Details</th>
                  <th>Category</th>
                  <th>Instructor</th>
                  <th>Duration</th>
                  <th>Level</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Students</th>
                  <th>Rating</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCourses.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="crs-empty-td">
                      No matching courses found in catalog.
                    </td>
                  </tr>
                ) : (
                  currentCourses.map((course) => (
                    <tr key={course._id}>
                      <td>
                        <div className="crs-item-cell">
                          {course.thumbnail ? (
                            <img
                              src={getThumbnailUrl(course.thumbnail)}
                              alt={course.title}
                              className="crs-table-thumb"
                            />
                          ) : (
                            <div className="crs-thumb-avatar">
                              {course.title?.charAt(0).toUpperCase() || "C"}
                            </div>
                          )}
                          <div>
                            <strong className="crs-course-name">
                              {course.title}
                            </strong>
                            <div className="crs-subtext">
                              {course.language || "English"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="crs-cat-badge">
                          {course.category || "General"}
                        </span>
                      </td>
                      <td>{course.instructor || "N/A"}</td>
                      <td>{course.duration || "Self-Paced"}</td>
                      <td>
                        <span className="crs-level-chip">
                          {course.level || "Beginner"}
                        </span>
                      </td>
                      <td>
                        <div className="crs-price-cell">
                          <strong>{formatPrice(course.price)}</strong>
                          {course.discountPrice > 0 && (
                            <span className="crs-discount-text">
                              {formatPrice(course.discountPrice)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`crs-status-pill ${course.status?.toLowerCase() === "active" ? "active" : "inactive"}`}
                        >
                          {course.status || "Active"}
                        </span>
                      </td>
                      <td>
                        <strong>{course.totalStudents || 0}</strong>
                      </td>
                      <td>
                        <span className="crs-rating-badge">
                          ⭐ {course.rating || "4.8"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className="crs-btn-group">
                          <button
                            className="crs-btn crs-btn-sm crs-btn-view"
                            onClick={() => {
                              setSelectedCourse(course);
                              setShowDetails(true);
                            }}
                          >
                            View
                          </button>
                          <button
                            className="crs-btn crs-btn-sm crs-btn-edit"
                            onClick={() => editCourse(course)}
                          >
                            Edit
                          </button>
                          <button
                            className="crs-btn crs-btn-sm crs-btn-danger"
                            onClick={() => deleteCourse(course._id)}
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
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="crs-pagination">
          <div className="crs-pagination-info">
            Showing <strong>{indexOfFirstCourse + 1}</strong> –{" "}
            <strong>
              {Math.min(indexOfLastCourse, filteredCourses.length)}
            </strong>{" "}
            of <strong>{filteredCourses.length}</strong> Courses
          </div>

          <div className="crs-pagination-buttons">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetails && selectedCourse && (
        <div
          className="crs-modal-overlay"
          onClick={() => setShowDetails(false)}
        >
          <div className="crs-modal" onClick={(e) => e.stopPropagation()}>
            <div className="crs-modal-header">
              <h2>Course Overview Dossier</h2>
              <button
                className="crs-close-icon"
                onClick={() => setShowDetails(false)}
              >
                ✕
              </button>
            </div>

            <div className="crs-modal-body">
              {selectedCourse.thumbnail && (
                <img
                  src={getThumbnailUrl(selectedCourse.thumbnail)}
                  alt={selectedCourse.title}
                  className="crs-modal-banner"
                />
              )}

              <div className="crs-kv-grid">
                <div>
                  <span>Title:</span> <strong>{selectedCourse.title}</strong>
                </div>
                <div>
                  <span>Category:</span>{" "}
                  <strong>{selectedCourse.category}</strong>
                </div>
                <div>
                  <span>Instructor:</span>{" "}
                  <strong>{selectedCourse.instructor}</strong>
                </div>
                <div>
                  <span>Duration / Level:</span>{" "}
                  <strong>
                    {selectedCourse.duration} ({selectedCourse.level})
                  </strong>
                </div>
                <div>
                  <span>Price:</span>{" "}
                  <strong>{formatPrice(selectedCourse.price)}</strong>
                </div>
                <div>
                  <span>Enrolled Students:</span>{" "}
                  <strong>{selectedCourse.totalStudents || 0}</strong>
                </div>
              </div>

              <div className="crs-modal-section">
                <h4>Short Brief</h4>
                <p>
                  {selectedCourse.shortDescription ||
                    "No short description provided."}
                </p>
              </div>

              <div className="crs-modal-section">
                <h4>Curriculum Overview</h4>
                <p>
                  {selectedCourse.description ||
                    "No full description provided."}
                </p>
              </div>
            </div>

            <div className="crs-modal-footer">
              <button
                className="crs-btn crs-btn-primary"
                onClick={() => setShowDetails(false)}
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;

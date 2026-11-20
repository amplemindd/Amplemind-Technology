import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Student.css";

const MyCourses = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("studentToken");

        if (!token) {
          navigate("/student-login");
          return;
        }

        const res = await axios.get(
          "https://amplemindtechnologies.com/api/student/my-courses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setCourses(res.data);
      } catch (error) {
        alert(error.response?.data?.message || "Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate]);

  return (
    <div className="student-page">
      <div className="page-header">
        <h2>My Courses</h2>

        <button
          className="student-btn"
          onClick={() => navigate("/student-dashboard")}
        >
          Back
        </button>
      </div>

      {loading ? (
        <h3>Loading...</h3>
      ) : courses.length === 0 ? (
        <div className="empty-box">
          <h3>No Courses Enrolled</h3>
          <p>You haven't enrolled in any course yet.</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {courses.map((course) => (
            <div className="dashboard-card" key={course._id}>
              <h3>{course.title}</h3>

              <p>
                <strong>Instructor:</strong> {course.instructor}
              </p>

              <p>
                <strong>Duration:</strong> {course.duration}
              </p>

              <p>
                <strong>Level:</strong> {course.level}
              </p>

              <button
                className="student-btn"
                onClick={() => navigate(`/course-details/${course._id}`)}
              >
                View Course
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;

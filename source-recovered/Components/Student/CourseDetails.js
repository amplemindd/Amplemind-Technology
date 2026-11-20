import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Student.css";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("studentToken");

        if (!token) {
          navigate("/student-login");
          return;
        }

        const res = await axios.get(
          `https://amplemindtechnologies.com/api/student/course/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setCourse(res.data);
      } catch (error) {
        alert(
          error.response?.data?.message || "Failed to load course details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="student-page">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="student-page">
        <h2>Course Not Found</h2>

        <button className="student-btn" onClick={() => navigate("/my-courses")}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="student-page">
      <div className="page-header">
        <h2>{course.title}</h2>

        <button className="student-btn" onClick={() => navigate("/my-courses")}>
          Back
        </button>
      </div>

      <div className="dashboard-card">
        <p>
          <strong>Instructor:</strong> {course.instructor}
        </p>

        <p>
          <strong>Duration:</strong> {course.duration}
        </p>

        <p>
          <strong>Level:</strong> {course.level}
        </p>

        <p>
          <strong>Description:</strong>
        </p>

        <p>{course.description}</p>

        <hr />

        <h3>Course Modules</h3>

        {course.modules && course.modules.length > 0 ? (
          <ul className="course-module-list">
            {course.modules.map((module, index) => (
              <li key={index}>{module}</li>
            ))}
          </ul>
        ) : (
          <p>No modules available.</p>
        )}

        <button
          className="student-btn"
          onClick={() => navigate(`/course-learning/${course._id}`)}
        >
          Continue Learning
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;

import { useNavigate } from "react-router-dom";
import "./Student.css";

const MyTests = () => {
  const navigate = useNavigate();

  return (
    <div className="student-page">
      <div className="page-header">
        <h2>My Tests</h2>

        <button
          className="student-btn"
          onClick={() => navigate("/student-dashboard")}
        >
          Back
        </button>
      </div>

      <div className="empty-box">
        <h3>No Tests Available</h3>
        <p>Tests will appear here after they are published by the admin.</p>
      </div>
    </div>
  );
};

export default MyTests;
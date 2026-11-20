import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Student.css";

const Notifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("studentToken");

        if (!token) {
          navigate("/student-login");
          return;
        }

        const res = await axios.get(
          "https://amplemindtechnologies.com/api/student/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setNotifications(res.data);
      } catch (error) {
        alert(error.response?.data?.message || "Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [navigate]);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("studentToken");

      await axios.put(
        `https://amplemindtechnologies.com/api/student/notifications/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isRead: true } : item,
        ),
      );
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update notification.");
    }
  };

  return (
    <div className="student-page">
      <div className="page-header">
        <h2>Notifications</h2>

        <button
          className="student-btn"
          onClick={() => navigate("/student-dashboard")}
        >
          Back
        </button>
      </div>

      {loading ? (
        <h3>Loading...</h3>
      ) : notifications.length === 0 ? (
        <div className="empty-box">
          <h3>No Notifications</h3>
          <p>You don't have any notifications.</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-card ${
                notification.isRead ? "read" : "unread"
              }`}
            >
              <h4>{notification.title}</h4>

              <p>{notification.message}</p>

              <small>{new Date(notification.createdAt).toLocaleString()}</small>

              {!notification.isRead && (
                <button
                  className="student-btn"
                  onClick={() => markAsRead(notification._id)}
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;

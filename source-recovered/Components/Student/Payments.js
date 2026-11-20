import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Student.css";

const Payments = () => {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("studentToken");

        const student = JSON.parse(localStorage.getItem("student"));

        if (!token || !student) {
          navigate("/student-login");
          return;
        }

        const res = await axios.get(
          "https://amplemindtechnologies.com/api/payments/my-payments",
          {
            params: {
              email: student.email,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.data.success) {
          setPayments(res.data.payments || []);
        } else {
          setPayments([]);
        }
      } catch (error) {
        console.log(error);

        alert(
          error.response?.data?.message || "Failed to load payment history.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [navigate]);

  return (
    <div className="student-page">
      <div className="page-header">
        <h2>Payment History</h2>

        <button
          className="student-btn"
          onClick={() => navigate("/student-dashboard")}
        >
          Back
        </button>
      </div>

      {loading ? (
        <h3>Loading...</h3>
      ) : payments.length === 0 ? (
        <div className="empty-box">
          <h3>No Payment Records Found</h3>

          <p>You haven't made any payments yet.</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {payments.map((payment) => (
            <div className="dashboard-card" key={payment._id}>
              <h3>{payment.course}</h3>

              <p>
                <strong>Amount:</strong> ₹{payment.amount}
              </p>

              <p>
                <strong>Transaction ID:</strong> {payment.transactionId}
              </p>

              <p>
                <strong>Payment Mode:</strong> {payment.paymentMode}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      payment.status === "Paid"
                        ? "green"
                        : payment.status === "Pending"
                          ? "orange"
                          : "red",
                    fontWeight: "bold",
                  }}
                >
                  {payment.status}
                </span>
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {payment.paymentDate
                  ? new Date(payment.paymentDate).toLocaleDateString()
                  : "-"}
              </p>

              {payment.remarks && (
                <p>
                  <strong>Remarks:</strong> {payment.remarks}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payments;

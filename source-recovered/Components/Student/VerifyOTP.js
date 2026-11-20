import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Student.css";

const VerifyOTP = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp) {
      alert("Please enter OTP.");

      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://amplemindtechnologies.com/api/auth/verify-otp",

        {
          email,

          otp,
        },
      );

      if (res.data.success) {
        alert(res.data.message);

        navigate("/reset-password", {
          state: {
            email,

            otp,
          },
        });
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "OTP Verification Failed.");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      const res = await axios.post(
        "https://amplemindtechnologies.com/api/auth/forgot-password",

        {
          email,
        },
      );

      alert(res.data.message);
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Unable to resend OTP.");
    }
  };

  return (
    <div className="student-container">
      <div className="student-card">
        <h2>Verify OTP</h2>

        <p>
          Enter the 6-digit OTP sent to
          <br />
          <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify}>
          <div className="student-input-group">
            <label>OTP</label>

            <input
              type="text"
              placeholder="Enter 6 Digit OTP"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="student-btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div
          style={{
            marginTop: "15px",
            textAlign: "center",
          }}
        >
          <button className="student-btn" type="button" onClick={resendOTP}>
            Resend OTP
          </button>
        </div>

        <div className="student-register-link">
          <Link to="/student-login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;

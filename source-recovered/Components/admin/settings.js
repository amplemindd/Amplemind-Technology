import "./settings.css";
import { useEffect, useState } from "react";
import axios from "axios";

const ADMIN_API = "https://amplemindtechnologies.com/api/admin";
const SETTINGS_API = "https://amplemindtechnologies.com/api/settings";

function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",

    smtpPort: 587,

    senderName: "AmpleMind Technologies",

    senderEmail: "",

    appPassword: "",

    emailEnabled: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadProfile();

    loadEmailSettings();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await axios.get(`${ADMIN_API}/profile`);

      if (res.data.success) {
        setAdmin(res.data.admin);
      }
    } catch (err) {
      console.log(err);

      alert("Unable to load admin profile.");
    } finally {
      setLoading(false);
    }
  };

  const loadEmailSettings = async () => {
    try {
      const res = await axios.get(`${SETTINGS_API}/email`);

      if (res.data.success) {
        setEmailSettings(res.data.email);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmailChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEmailSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updatePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      alert("Please fill all fields.");

      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New Password and Confirm Password do not match.");

      return;
    }

    try {
      setSaving(true);

      const res = await axios.put(`${ADMIN_API}/change-password`, passwordData);

      if (res.data.success) {
        alert(res.data.message);

        setPasswordData({
          currentPassword: "",

          newPassword: "",

          confirmPassword: "",
        });
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);

      alert("Unable to change password.");
    } finally {
      setSaving(false);
    }
  };

  const saveEmailSettings = async () => {
    try {
      setSaving(true);

      const res = await axios.put(
        `${SETTINGS_API}/email`,

        emailSettings,
      );

      if (res.data.success) {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);

      alert("Unable to save email settings.");
    } finally {
      setSaving(false);
    }
  };

  const sendTestEmail = async () => {
    try {
      const res = await axios.post(`${SETTINGS_API}/test-email`);

      alert(res.data.message);
    } catch (err) {
      console.log(err);

      alert("Unable to send test email.");
    }
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <div className="loader"></div>

        <p>Loading Admin Profile...</p>
      </div>
    );
  }
  return (
    <div className="settings-container">
      {/* ===========================
            Header
        =========================== */}

      <div className="settings-header">
        <div>
          <h2>⚙️ Admin Settings</h2>

          <p>Manage your account, password and email configuration.</p>
        </div>
      </div>

      {/* ===========================
            Admin Profile
        =========================== */}

      <div className="settings-card">
        <h3>👤 Admin Profile</h3>

        <div className="settings-grid">
          <div className="form-group">
            <label>Admin Name</label>

            <input type="text" value={admin.name || ""} readOnly />
          </div>

          <div className="form-group">
            <label>Email Address</label>

            <input type="email" value={admin.email || ""} readOnly />
          </div>

          <div className="form-group">
            <label>Role</label>

            <input type="text" value={admin.role || ""} readOnly />
          </div>
        </div>
      </div>

      {/* ===========================
            Change Password
        =========================== */}

      <div className="settings-card">
        <h3>🔒 Change Password</h3>

        <div className="settings-grid">
          <div className="form-group">
            <label>Current Password</label>

            <input
              type={showPassword ? "text" : "password"}
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
            />
          </div>

          <div className="form-group">
            <label>New Password</label>

            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />
          </div>
        </div>

        <div className="show-password">
          <label>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />

            <span> Show Password</span>
          </label>
        </div>

        <div className="form-actions">
          <button
            className="save-btn"
            onClick={updatePassword}
            disabled={saving}
          >
            {saving ? "Updating..." : "🔒 Update Password"}
          </button>
        </div>
      </div>

      {/* ===========================
            Email Settings
        =========================== */}

      <div className="settings-card">
        <h3>📧 Email Settings</h3>

        <div className="settings-grid">
          <div className="form-group">
            <label>SMTP Host</label>

            <input
              type="text"
              name="smtpHost"
              value={emailSettings.smtpHost}
              onChange={handleEmailChange}
            />
          </div>

          <div className="form-group">
            <label>SMTP Port</label>

            <input
              type="number"
              name="smtpPort"
              value={emailSettings.smtpPort}
              onChange={handleEmailChange}
            />
          </div>

          <div className="form-group">
            <label>Sender Name</label>

            <input
              type="text"
              name="senderName"
              value={emailSettings.senderName}
              onChange={handleEmailChange}
              placeholder="AmpleMind Technologies"
            />
          </div>

          <div className="form-group">
            <label>Sender Email</label>

            <input
              type="email"
              name="senderEmail"
              value={emailSettings.senderEmail}
              onChange={handleEmailChange}
              placeholder="example@gmail.com"
            />
          </div>

          <div className="form-group">
            <label>App Password</label>

            <input
              type="password"
              name="appPassword"
              value={emailSettings.appPassword}
              onChange={handleEmailChange}
              placeholder="16 Character Google App Password"
            />
          </div>

          <div className="form-group">
            <label>Email Service</label>

            <div className="show-password">
              <label>
                <input
                  type="checkbox"
                  name="emailEnabled"
                  checked={emailSettings.emailEnabled}
                  onChange={handleEmailChange}
                />

                <span> Enable Email Service</span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            className="save-btn"
            onClick={saveEmailSettings}
            disabled={saving}
          >
            {saving ? "Saving..." : "💾 Save Email Settings"}
          </button>

          <button
            className="save-btn"
            type="button"
            onClick={sendTestEmail}
            style={{
              marginLeft: "10px",
              background: "#16a34a",
            }}
          >
            📧 Send Test Email
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;

import { useEffect, useState } from "react";
import { put } from "../api";
import { useAuth } from "../AuthContext";

export default function Profile() {
  const { user, reloadUser } = useAuth();
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [credentials, setCredentials] = useState({ oldPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleProfileChange = (event) => {
    setProfile({ ...profile, [event.target.name]: event.target.value });
  };

  const handlePasswordChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await put(`/api/profile/${user._id}`, profile);
      setMessage("Profile updated successfully.");
      await reloadUser();
    } catch (err) {
      setError(err.message || "Unable to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setError("");
    setPasswordMessage("");
    setLoading(true);

    try {
      await put(`/api/profile/${user._id}/change-password`, credentials);
      setPasswordMessage("Password changed successfully.");
      setCredentials({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setError(err.message || "Unable to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section">
      <div className="section-header">
        <div>
          <h1>Profile</h1>
          <p>Update your account information and password.</p>
        </div>
      </div>

      <div className="profile-grid">
        <form className="card form-card" onSubmit={saveProfile}>
          <h2>Account</h2>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            Save Profile
          </button>
          {message && <p className="success">{message}</p>}
        </form>

        <form className="card form-card" onSubmit={changePassword}>
          <h2>Change Password</h2>
          <label>
            Current Password
            <input
              type="password"
              name="oldPassword"
              value={credentials.oldPassword}
              onChange={handlePasswordChange}
              required
            />
          </label>
          <label>
            New Password
            <input
              type="password"
              name="newPassword"
              value={credentials.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            Change Password
          </button>
          {passwordMessage && <p className="success">{passwordMessage}</p>}
        </form>
      </div>

      {error && <p className="error">{error}</p>}
    </section>
  );
}

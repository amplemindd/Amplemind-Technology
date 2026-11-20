import { useState, useEffect } from "react";
import axios from "axios";
import "./users.css";

function Users() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "User",
    status: "Active",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==========================================
  // Fetch Users
  // ==========================================

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://amplemindtechnologies.com/api/users",
      );

      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================================
  // Add / Update User
  // ==========================================

  const saveUser = async () => {
    try {
      if (!userData.name || !userData.email) {
        alert("Please fill all fields");
        return;
      }

      let res;

      if (editingId) {
        res = await axios.put(
          `https://amplemindtechnologies.com/api/users/${editingId}`,
          userData,
        );
      } else {
        res = await axios.post(
          "https://amplemindtechnologies.com/api/users",
          userData,
        );
      }

      if (res.data.success) {
        fetchUsers();

        setUserData({
          name: "",
          email: "",
          role: "User",
          status: "Active",
        });

        setEditingId(null);
        setShowForm(false);

        alert(
          editingId ? "User Updated Successfully" : "User Added Successfully",
        );
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  // ==========================================
  // Delete User
  // ==========================================

  const deleteUser = async (id) => {
    if (window.confirm("Delete this user?")) {
      try {
        const res = await axios.delete(
          `https://amplemindtechnologies.com/api/users/${id}`,
        );

        if (res.data.success) {
          fetchUsers();
        } else {
          alert(res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // ==========================================
  // Filter Users
  // ==========================================

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const activeUsers = users.filter((user) => user.status === "Active").length;

  const inactiveUsers = users.filter(
    (user) => user.status === "Inactive",
  ).length;

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>Users Management</h1>

        <button
          className="add-user-btn"
          onClick={() => {
            setEditingId(null);

            setUserData({
              name: "",
              email: "",
              role: "User",
              status: "Active",
            });

            setShowForm(true);
          }}
        >
          + Add User
        </button>
      </div>

      {/* Stats */}

      <div className="users-cards">
        <div className="user-card">
          <h3>Total Users</h3>
          <h2>{users.length}</h2>
        </div>

        <div className="user-card">
          <h3>Active Users</h3>
          <h2>{activeUsers}</h2>
        </div>

        <div className="user-card">
          <h3>Inactive Users</h3>
          <h2>{inactiveUsers}</h2>
        </div>
      </div>

      {/* Add / Edit Form */}

      {showForm && (
        <div className="user-form">
          <input
            type="text"
            placeholder="Full Name"
            value={userData.name}
            onChange={(e) =>
              setUserData({
                ...userData,
                name: e.target.value,
              })
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={userData.email}
            onChange={(e) =>
              setUserData({
                ...userData,
                email: e.target.value,
              })
            }
          />

          <select
            value={userData.role}
            onChange={(e) =>
              setUserData({
                ...userData,
                role: e.target.value,
              })
            }
          >
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>

          <select
            value={userData.status}
            onChange={(e) =>
              setUserData({
                ...userData,
                status: e.target.value,
              })
            }
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <div className="user-form-btns">
            <button className="save-btn" onClick={saveUser}>
              {editingId ? "Update User" : "Save User"}
            </button>

            <button
              className="cancel-btn"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);

                setUserData({
                  name: "",
                  email: "",
                  role: "User",
                  status: "Active",
                });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search */}

      <div className="search-box">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Desktop Table */}

      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="user-profile">
                    <div className="avatar">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>

                    <span className="user-name">{user.name}</span>
                  </div>
                </td>

                <td>{user.email}</td>

                <td>{user.role}</td>

                <td>
                  <span
                    className={
                      user.status === "Active"
                        ? "status-active"
                        : "status-inactive"
                    }
                  >
                    {user.status}
                  </span>
                </td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingId(user._id);

                      setUserData({
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        status: user.status,
                      });

                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}

      <div className="users-mobile">
        {filteredUsers.map((user) => (
          <div className="user-mobile-card" key={user._id}>
            <div className="user-profile">
              <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>

              <div>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>
            </div>

            <div className="mobile-info">
              <p>
                <strong>Role:</strong> {user.role}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    user.status === "Active"
                      ? "status-active"
                      : "status-inactive"
                  }
                >
                  {user.status}
                </span>
              </p>
            </div>

            <div className="mobile-actions">
              <button
                className="edit-btn"
                onClick={() => {
                  setEditingId(user._id);

                  setUserData({
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                  });

                  setShowForm(true);
                }}
              >
                Edit
              </button>

              <button
                className="delete-btn mobile-delete"
                onClick={() => deleteUser(user._id)}
              >
                Delete User
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;

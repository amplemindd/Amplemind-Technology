import { useState, useEffect } from "react";
import axios from "axios";
import "./projects.css";

function Projects() {
  /* ==========================================
      STATES
  ========================================== */

  const [projects, setProjects] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editId, setEditId] = useState(null);

  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    technology: "",
    status: "Active",
  });

  /* ==========================================
      FETCH PROJECTS
  ========================================== */

  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        "https://amplemindtechnologies.com/api/projects",
      );

      if (res.data.success) {
        setProjects(res.data.projects);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  /* ==========================================
      HANDLE INPUT CHANGE
  ========================================== */

  const handleChange = (e) => {
    setProjectData({
      ...projectData,

      [e.target.name]: e.target.value,
    });
  };

  /* ==========================================
      EDIT PROJECT
  ========================================== */

  const editProject = (project) => {
    setEditId(project._id);

    setProjectData({
      title: project.title,

      description: project.description,

      technology: project.technology,

      status: project.status,
    });

    setShowForm(true);
  };

  /* ==========================================
      RESET FORM
  ========================================== */

  const resetForm = () => {
    setProjectData({
      title: "",

      description: "",

      technology: "",

      status: "Active",
    });

    setEditId(null);

    setShowForm(false);
  };
  /* ==========================================
      ADD / UPDATE PROJECT
  ========================================== */

  const saveProject = async () => {
    if (!projectData.title.trim()) {
      alert("Project Title is required");
      return;
    }

    if (!projectData.technology.trim()) {
      alert("Technology is required");
      return;
    }

    try {
      if (editId) {
        await axios.put(
          `https://amplemindtechnologies.com/api/projects/${editId}`,
          projectData,
        );

        alert("Project Updated Successfully");
      } else {
        await axios.post(
          "https://amplemindtechnologies.com/api/projects",
          projectData,
        );

        alert("Project Added Successfully");
      }

      fetchProjects();

      resetForm();
    } catch (error) {
      console.log(error);

      alert("Something went wrong");
    }
  };

  /* ==========================================
      DELETE PROJECT
  ========================================== */

  const deleteProject = async (id) => {
    const confirmDelete = window.confirm("Delete this project?");

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://amplemindtechnologies.com/api/projects/${id}`,
      );

      fetchProjects();

      alert("Project Deleted Successfully");
    } catch (error) {
      console.log(error);

      alert("Unable to delete project");
    }
  };

  return (
    <div className="admin-projects-container">
      {/* ===========================
        Total Projects Card
    =========================== */}

      <div className="admin-project-stats-card">
        <h2>Total Projects</h2>
        <h1>{projects.length}</h1>
      </div>

      {/* ===========================
        Header
    =========================== */}

      <div className="admin-projects-header">
        <h1>Projects Management</h1>

        <button
          className="admin-add-project-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Project
        </button>
      </div>

      {/* ===========================
        Project Form
    =========================== */}

      {showForm && (
        <div className="admin-project-form">
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={projectData.title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Project Description"
            value={projectData.description}
            onChange={handleChange}
          />

          <input
            type="text"
            name="technology"
            placeholder="Technology"
            value={projectData.technology}
            onChange={handleChange}
          />

          <select
            name="status"
            value={projectData.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>

          <div className="admin-project-btns">
            <button className="admin-save-btn" onClick={saveProject}>
              {editId ? "Update Project" : "Save Project"}
            </button>

            <button className="admin-cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ===========================
        Projects Table
    =========================== */}

      <div className="admin-projects-table-wrapper">
        <table className="admin-projects-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Technology</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {projects.length > 0 ? (
              projects.map((project) => (
                <tr key={project._id}>
                  <td>{project.title}</td>

                  <td>{project.description}</td>

                  <td>{project.technology}</td>

                  <td>
                    <span
                      className={
                        project.status === "Completed"
                          ? "admin-status-completed"
                          : project.status === "Pending"
                            ? "admin-status-pending"
                            : "admin-status-active"
                      }
                    >
                      {project.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="admin-edit-btn"
                      onClick={() => editProject(project)}
                    >
                      Edit
                    </button>

                    <button
                      className="admin-delete-btn"
                      onClick={() => deleteProject(project._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No Projects Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Projects;

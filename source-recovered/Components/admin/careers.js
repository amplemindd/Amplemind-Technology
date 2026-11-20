import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./careers.css";

const API_URL = "https://amplemindtechnologies.com/api/jobs";

function Careers() {
  const [jobs, setJobs] = useState([]);
  const [statistics, setStatistics] = useState({
    totalJobs: 0,
    activeJobs: 0,
    inactiveJobs: 0,
  });

  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [sortBy, setSortBy] = useState("Newest");

  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 10;

  const emptyJob = {
    title: "",
    location: "",
    experience: "",
    salary: "",
    status: "Active",
  };

  const [jobData, setJobData] = useState(emptyJob);

  useEffect(() => {
    fetchJobs();
    fetchStatistics();
  }, []);
  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_URL);

      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const res = await axios.get(`${API_URL}/statistics`);

      if (res.data.success) {
        setStatistics(res.data.statistics);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setJobData(emptyJob);
    setEditId(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value,
    });
  };
  const saveJob = async () => {
    try {
      if (
        !jobData.title.trim() ||
        !jobData.location.trim() ||
        !jobData.experience.trim() ||
        !jobData.salary.trim()
      ) {
        alert("Please fill all required fields.");
        return;
      }

      setLoading(true);

      if (editId) {
        const res = await axios.put(`${API_URL}/${editId}`, jobData);

        if (res.data.success) {
          setJobs(jobs.map((job) => (job._id === editId ? res.data.job : job)));

          fetchStatistics();

          alert("Job Updated Successfully");
        }
      } else {
        const res = await axios.post(API_URL, jobData);

        if (res.data.success) {
          setJobs([res.data.job, ...jobs]);

          fetchStatistics();

          alert("Job Added Successfully");
        }
      }

      resetForm();
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const editJob = (job) => {
    setJobData({
      title: job.title,
      location: job.location,
      experience: job.experience,
      salary: job.salary,
      status: job.status,
    });

    setEditId(job._id);

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteJob = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?",
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      const res = await axios.delete(`${API_URL}/${id}`);

      if (res.data.success) {
        setJobs(jobs.filter((job) => job._id !== id));

        fetchStatistics();

        alert("Job Deleted Successfully");
      }
    } catch (error) {
      console.log(error);
      alert("Unable to delete job.");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    resetForm();
  };

  const filteredJobs = useMemo(() => {
    let data = [...jobs];

    if (search.trim()) {
      data = data.filter(
        (job) =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.location.toLowerCase().includes(search.toLowerCase()) ||
          job.experience.toLowerCase().includes(search.toLowerCase()) ||
          job.salary.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (statusFilter !== "All") {
      data = data.filter((job) => job.status === statusFilter);
    }

    switch (sortBy) {
      case "A-Z":
        data.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case "Z-A":
        data.sort((a, b) => b.title.localeCompare(a.title));
        break;

      case "Active":
        data.sort((a, b) => a.status.localeCompare(b.status));
        break;

      case "Newest":
      default:
        data.reverse();
        break;
    }

    return data;
  }, [jobs, search, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const indexOfLastJob = currentPage * jobsPerPage;

  const indexOfFirstJob = indexOfLastJob - jobsPerPage;

  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sortBy]);

  const formatSalary = (salary) => {
    return salary || "Not Disclosed";
  };

  const getStatusClass = (status) => {
    return status === "Active"
      ? "status-badge-active"
      : "status-badge-inactive";
  };
  return (
    <div className="careers-container">
      <div className="careers-header">
        <div>
          <h1>Careers Management</h1>
          <p>Create, manage and monitor all job openings from one place.</p>
        </div>

        <button
          className="add-job-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Job
        </button>
      </div>

      <div className="career-cards">
        <div className="career-card">
          <h3>Total Jobs</h3>
          <h2>{statistics.totalJobs}</h2>
        </div>

        <div className="career-card active-track">
          <h3>Active Jobs</h3>
          <h2>{statistics.activeJobs}</h2>
        </div>

        <div className="career-card inactive-track">
          <h3>Inactive Jobs</h3>
          <h2>{statistics.inactiveJobs}</h2>
        </div>
      </div>

      <div className="career-toolbar">
        <div className="career-search">
          <input
            type="text"
            placeholder="Search by Title, Location, Experience or Salary..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="career-filter">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>

            <option value="Active">Active</option>

            <option value="Inactive">Inactive</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="Newest">Newest</option>

            <option value="A-Z">A - Z</option>

            <option value="Z-A">Z - A</option>

            <option value="Active">Status</option>
          </select>
        </div>
      </div>

      {showForm && (
        <div className="job-form-container">
          <h2>{editId ? "Update Job" : "Create New Job"}</h2>

          <div className="job-form-grid">
            <div className="job-input-group">
              <label>Job Title</label>

              <input
                type="text"
                name="title"
                value={jobData.title}
                placeholder="Frontend Developer"
                onChange={handleChange}
              />
            </div>

            <div className="job-input-group">
              <label>Location</label>

              <input
                type="text"
                name="location"
                value={jobData.location}
                placeholder="Nagpur"
                onChange={handleChange}
              />
            </div>

            <div className="job-input-group">
              <label>Experience</label>

              <input
                type="text"
                name="experience"
                value={jobData.experience}
                placeholder="2-4 Years"
                onChange={handleChange}
              />
            </div>

            <div className="job-input-group">
              <label>Salary</label>

              <input
                type="text"
                name="salary"
                value={jobData.salary}
                placeholder="6 LPA"
                onChange={handleChange}
              />
            </div>

            <div className="job-input-group">
              <label>Status</label>

              <select
                name="status"
                value={jobData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>

                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="job-form-buttons">
            <button className="save-btn" onClick={saveJob}>
              {editId ? "Update Job" : "Add Job"}
            </button>

            <button className="cancel-btn" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="careers-table-wrapper">
        <table className="careers-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Job Title</th>
              <th>Location</th>
              <th>Experience</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="careers-empty-state">
                  Loading Jobs...
                </td>
              </tr>
            ) : currentJobs.length === 0 ? (
              <tr>
                <td colSpan="7" className="careers-empty-state">
                  No Jobs Found
                </td>
              </tr>
            ) : (
              currentJobs.map((job, index) => (
                <tr key={job._id}>
                  <td>{indexOfFirstJob + index + 1}</td>

                  <td className="job-title-bold">{job.title}</td>

                  <td>{job.location}</td>

                  <td>{job.experience}</td>

                  <td className="job-salary-accent">
                    {formatSalary(job.salary)}
                  </td>

                  <td>
                    <span className={getStatusClass(job.status)}>
                      {job.status}
                    </span>
                  </td>

                  <td>
                    <div className="career-actions-flex">
                      <button className="edit-btn" onClick={() => editJob(job)}>
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteJob(job._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="careers-mobile">
        {loading ? (
          <div className="careers-empty-state">Loading Jobs...</div>
        ) : currentJobs.length === 0 ? (
          <div className="careers-empty-state">No Jobs Found</div>
        ) : (
          currentJobs.map((job) => (
            <div className="career-mobile-card" key={job._id}>
              <h3>{job.title}</h3>

              <p>
                <strong>Location :</strong> {job.location}
              </p>

              <p>
                <strong>Experience :</strong> {job.experience}
              </p>

              <p>
                <strong>Salary :</strong> {formatSalary(job.salary)}
              </p>

              <p>
                <strong>Status :</strong>

                <span
                  className={getStatusClass(job.status)}
                  style={{ marginLeft: "10px" }}
                >
                  {job.status}
                </span>
              </p>

              <div className="mobile-btns">
                <button className="edit-btn" onClick={() => editJob(job)}>
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteJob(job._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredJobs.length > jobsPerPage && (
        <div className="pagination">
          <button onClick={previousPage} disabled={currentPage === 1}>
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button onClick={nextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Careers;

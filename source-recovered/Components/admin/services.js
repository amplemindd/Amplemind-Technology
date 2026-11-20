import { useEffect, useState } from "react";
import axios from "axios";
import "./services.css";

function Services() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [serviceData, setServiceData] = useState({
    name: "",
    category: "",
    status: "Active",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  // ==========================
  // Fetch Services
  // ==========================
  const fetchServices = async () => {
    try {
      const res = await axios.get(
        "https://amplemindtechnologies.com/api/services",
      );

      if (res.data.success) {
        setServices(Array.isArray(res.data.services) ? res.data.services : []);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.log(error);
      setServices([]);
    }
  };

  // ==========================
  // Add / Update Service
  // ==========================
  const saveService = async () => {
    try {
      if (!serviceData.name || !serviceData.category) {
        alert("Please fill all fields");
        return;
      }

      if (editingId) {
        await axios.put(
          `https://amplemindtechnologies.com/api/services/${editingId}`,
          serviceData,
        );

        alert("Service Updated Successfully");
      } else {
        await axios.post(
          "https://amplemindtechnologies.com/api/services",
          serviceData,
        );

        alert("Service Added Successfully");
      }

      fetchServices();

      setServiceData({
        name: "",
        category: "",
        status: "Active",
      });

      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  // ==========================
  // Edit Service
  // ==========================
  const editService = (service) => {
    setEditingId(service._id);

    setServiceData({
      name: service.name,
      category: service.category,
      status: service.status,
    });

    setShowForm(true);
  };

  // ==========================
  // Delete Service
  // ==========================
  const deleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      await axios.delete(
        `https://amplemindtechnologies.com/api/services/${id}`,
      );

      fetchServices();
    } catch (error) {
      console.log(error);
      alert("Unable to delete service");
    }
  };

  // ==========================
  // Search
  // ==========================
  const filteredServices = (Array.isArray(services) ? services : []).filter(
    (service) =>
      service.name?.toLowerCase().includes(search.toLowerCase()) ||
      service.category?.toLowerCase().includes(search.toLowerCase()),
  );

  const activeServices = filteredServices.filter(
    (service) => service.status === "Active",
  ).length;

  const inactiveServices = filteredServices.filter(
    (service) => service.status === "Inactive",
  ).length;

  return (
    <div className="services-container">
      <div className="services-header">
        <div>
          <h1>Services Management</h1>
          <p>
            Publish corporate services, monitor visibility, and manage technical
            solutions
          </p>
        </div>

        <button
          className="add-service-btn"
          onClick={() => {
            setEditingId(null);

            setServiceData({
              name: "",
              category: "",
              status: "Active",
            });

            setShowForm(true);
          }}
        >
          + Add Service
        </button>
      </div>

      <div className="service-cards">
        <div className="service-card">
          <h3>Total Services</h3>
          <h2>{services.length}</h2>
        </div>

        <div className="service-card active-track">
          <h3>Active Services</h3>
          <h2>{activeServices}</h2>
        </div>

        <div className="service-card inactive-track">
          <h3>Inactive Services</h3>
          <h2>{inactiveServices}</h2>
        </div>
      </div>

      {showForm && (
        <div className="service-form-container">
          <h2>{editingId ? "✏ Edit Service" : "✨ Configure New Service"}</h2>

          <div className="service-form-grid">
            <div className="service-input-group">
              <label>Service Name</label>

              <input
                type="text"
                placeholder="Service Name"
                value={serviceData.name}
                onChange={(e) =>
                  setServiceData({
                    ...serviceData,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="service-input-group">
              <label>Category</label>

              <input
                type="text"
                placeholder="Category"
                value={serviceData.category}
                onChange={(e) =>
                  setServiceData({
                    ...serviceData,
                    category: e.target.value,
                  })
                }
              />
            </div>

            <div className="service-input-group">
              <label>Status</label>

              <select
                value={serviceData.status}
                onChange={(e) =>
                  setServiceData({
                    ...serviceData,
                    status: e.target.value,
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="service-form-buttons">
            <button className="save-btn" onClick={saveService}>
              {editingId ? "Update Service" : "Save Service"}
            </button>

            <button
              className="cancel-btn"
              onClick={() => {
                setShowForm(false);

                setEditingId(null);

                setServiceData({
                  name: "",
                  category: "",
                  status: "Active",
                });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="service-search">
        <div className="search-wrapper-box">
          <span className="search-box-icon">🔍</span>

          <input
            type="text"
            placeholder="Search Services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="services-table-wrapper">
        <table className="services-table">
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan="4" className="services-empty-state">
                  No Services Found
                </td>
              </tr>
            ) : (
              filteredServices.map((service) => (
                <tr key={service._id}>
                  <td className="service-name-bold">{service.name}</td>

                  <td>{service.category}</td>

                  <td>
                    <span
                      className={
                        service.status === "Active"
                          ? "status-badge-active"
                          : "status-badge-inactive"
                      }
                    >
                      <span className="status-dot"></span>
                      {service.status}
                    </span>
                  </td>

                  <td>
                    <div className="service-actions-flex">
                      <button
                        className="edit-btn"
                        onClick={() => editService(service)}
                      >
                        ✏ Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteService(service._id)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="services-mobile">
        {filteredServices.length === 0 ? (
          <div className="services-empty-state">No Services Found</div>
        ) : (
          filteredServices.map((service) => (
            <div className="service-mobile-card" key={service._id}>
              <h3>{service.name}</h3>

              <div className="mobile-meta-rows">
                <p>
                  <strong>Category:</strong> {service.category}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      service.status === "Active"
                        ? "status-badge-active"
                        : "status-badge-inactive"
                    }
                  >
                    <span className="status-dot"></span>
                    {service.status}
                  </span>
                </p>
              </div>

              <div className="mobile-btns">
                <button
                  className="edit-btn"
                  onClick={() => editService(service)}
                >
                  ✏ Edit
                </button>

                <button
                  className="delete-btn mobile-delete"
                  onClick={() => deleteService(service._id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Services;

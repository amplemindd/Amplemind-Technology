import { useState, useEffect } from "react";
import axios from "axios";
import "./blogs.css";

const API_URL = "https://amplemindtechnologies.com/api/blogs";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedBlog, setExpandedBlog] = useState(null);
  const [loading, setLoading] = useState(false);

  const [blogData, setBlogData] = useState({
    title: "",
    image: null,
    studentName: "",
    company: "",
    package: "",
    author: "Amplemind Placement Cell",
    category: "",
    description: "",
    status: "Published",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);

      if (res.data.success) {
        const sortedBlogs = [...res.data.blogs].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );
        setBlogs(sortedBlogs);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error(error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setBlogData({
      ...blogData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setBlogData({
      title: "",
      image: null,
      studentName: "",
      company: "",
      package: "",
      author: "Amplemind Placement Cell",
      category: "",
      description: "",
      status: "Published",
    });
    setEditId(null);
  };

  const editBlog = (blog) => {
    setBlogData({
      title: blog.title || "",
      image: null,
      studentName: blog.studentName || "",
      company: blog.company || "",
      package: blog.package || "",
      author: blog.author || "Amplemind Placement Cell",
      category: blog.category || "",
      description: blog.description || "",
      status: blog.status || "Published",
    });

    setEditId(blog._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const addBlog = async () => {
    try {
      if (!blogData.title || !blogData.description || !blogData.category) {
        alert("Please fill all required fields marked with *");
        return;
      }

      const formData = new FormData();
      formData.append("title", blogData.title);
      formData.append("description", blogData.description);
      formData.append("category", blogData.category);
      formData.append("author", blogData.author);
      formData.append("company", blogData.company);
      formData.append("package", blogData.package);
      formData.append("studentName", blogData.studentName);
      formData.append("status", blogData.status);

      if (blogData.image) {
        formData.append("image", blogData.image);
      }

      if (editId) {
        await axios.put(`${API_URL}/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Blog Updated Successfully!");
      } else {
        if (!blogData.image) {
          alert("Please select a cover image for the blog.");
          return;
        }

        await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Blog Added Successfully!");
      }

      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error(error);
      alert("Error Saving Blog");
    }
  };

  const deleteBlog = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog post?",
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("Blog Deleted Successfully!");
      fetchBlogs();
    } catch (error) {
      console.error(error);
      alert("Error Deleting Blog");
    }
  };

  const categories = [
    "All",
    ...new Set(blogs.map((blog) => blog.category).filter(Boolean)),
  ];

  const filteredBlogs = blogs.filter((blog) => {
    const matchCategory =
      selectedCategory === "All" || blog.category === selectedCategory;

    const matchSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      blog.company?.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="blogs-wrapper">
      <div className="blogs-container">
        {/* Header Section */}
        <header className="blogs-header">
          <span className="blogs-badge">ADMIN CONTROL PANEL</span>
          <h1>Blogs & Article Management</h1>
          <p>
            Publish student achievements, placement drives, and official
            announcements.
          </p>
        </header>

        {/* Blog Creation Form Card */}
        <div className="blog-form-card">
          <div className="form-card-header">
            <h2>
              {editId ? "✏️ Edit Article / Story" : "➕ Post New Article"}
            </h2>
            {editId && (
              <button className="cancel-edit-btn" onClick={resetForm}>
                ✕ Cancel Editing
              </button>
            )}
          </div>

          <div className="blog-form-grid">
            <div className="form-group span-2">
              <label>Article Title *</label>
              <input
                type="text"
                name="title"
                placeholder="e.g., How Rahul Sharma Cracked 12 LPA Offer at Tech Corp"
                value={blogData.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={blogData.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                <option value="Placement">Placement</option>
                <option value="Internship">Internship</option>
                <option value="Technology">Technology</option>
                <option value="News">News</option>
                <option value="Events">Events</option>
                <option value="Success Story">Success Story</option>
              </select>
            </div>

            <div className="form-group">
              <label>Student Name</label>
              <input
                type="text"
                name="studentName"
                placeholder="e.g., Rahul Sharma"
                value={blogData.studentName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="company"
                placeholder="e.g., Infosys / TCS"
                value={blogData.company}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Salary Package</label>
              <input
                type="text"
                name="package"
                placeholder="e.g., 8 LPA"
                value={blogData.package}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Publisher / Author</label>
              <input
                type="text"
                name="author"
                placeholder="e.g., Placement Cell"
                value={blogData.author}
                onChange={handleChange}
              />
            </div>

            <div className="form-group span-2">
              <label>Featured Image {editId ? "(Optional)" : "*"}</label>
              <div className="custom-file-input">
                <input
                  type="file"
                  id="blog-image"
                  accept="image/*"
                  onChange={(e) =>
                    setBlogData({
                      ...blogData,
                      image: e.target.files[0],
                    })
                  }
                />
                <label htmlFor="blog-image">
                  🖼️{" "}
                  {blogData.image
                    ? blogData.image.name
                    : "Select Image File (PNG, JPG)"}
                </label>
              </div>
            </div>

            <div className="form-group span-full">
              <label>Article Content / Description *</label>
              <textarea
                name="description"
                rows="4"
                placeholder="Describe candidate experience, interview tips or news details here..."
                value={blogData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-action">
            <button className="submit-blog-btn" onClick={addBlog}>
              {editId ? "Update Article" : "Publish Article"}
            </button>
          </div>
        </div>

        {/* Search & Category Filter Section */}
        <div className="admin-tools-card">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by Title, Student Name or Company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="category-filter">
            {categories.map((cat) => (
              <button
                key={cat}
                className={
                  selectedCategory === cat
                    ? "filter-pill active"
                    : "filter-pill"
                }
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blogs List Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <h2>Loading Published Articles...</h2>
          </div>
        ) : (
          <div className="blogs-grid">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <div className="blog-card" key={blog._id}>
                  <div className="blog-image-wrapper">
                    {blog.image ? (
                      <img src={blog.image} alt={blog.title} />
                    ) : (
                      <div className="no-img-placeholder">
                        🖼️ No Cover Image
                      </div>
                    )}
                    <span className="blog-category-badge">
                      {blog.category || "General"}
                    </span>
                  </div>

                  <div className="blog-content">
                    <h3>{blog.title}</h3>

                    <div className="blog-meta-tags">
                      {blog.studentName && (
                        <span className="meta-tag student">
                          👨‍🎓 {blog.studentName}
                        </span>
                      )}
                      {blog.company && (
                        <span className="meta-tag company">
                          🏢 {blog.company}
                        </span>
                      )}
                      {blog.package && (
                        <span className="meta-tag package">
                          💰 {blog.package}
                        </span>
                      )}
                    </div>

                    <p className="blog-description">
                      {expandedBlog === blog._id
                        ? blog.description
                        : blog.description?.slice(0, 110) +
                          (blog.description?.length > 110 ? "..." : "")}
                    </p>

                    {blog.description?.length > 110 && (
                      <button
                        className="see-more-btn"
                        onClick={() =>
                          setExpandedBlog(
                            expandedBlog === blog._id ? null : blog._id,
                          )
                        }
                      >
                        {expandedBlog === blog._id
                          ? "Show Less ▲"
                          : "Read More ▼"}
                      </button>
                    )}

                    <div className="blog-card-footer">
                      <span className="blog-author">✍️ {blog.author}</span>
                      <div className="blog-actions">
                        <button
                          className="action-btn edit"
                          onClick={() => editBlog(blog)}
                        >
                          Edit
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => deleteBlog(blog._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-blogs">
                <span className="empty-icon">📁</span>
                <h2>No Articles Found</h2>
                <p>No posts match your search or filter criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Blogs;

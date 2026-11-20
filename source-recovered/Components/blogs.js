import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/blogs.css";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedBlog, setExpandedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("https://amplemindtechnologies.com/api/blogs");

      if (res.data.success) {
        const sortedBlogs = res.data.blogs.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setBlogs(sortedBlogs);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.log(error);
      setBlogs([]);
    }
  };

  const categories = [
    "All",
    ...new Set(blogs.map((blog) => blog.category).filter(Boolean)),
  ];

  const filteredBlogs =
    selectedCategory === "All"
      ? blogs
      : blogs.filter((blog) => blog.category === selectedCategory);

  return (
    <div className="amp-blog-wrapper">
      <div className="amp-blog-container">
        {/* Header */}
        <header className="amp-blog-header">
          <span className="amp-blog-badge">UPDATES & STORIES</span>
          <h1>Latest News & Success Stories</h1>
          <p>
            Stay updated with placements, achievements, company news, and
            technology insights.
          </p>
        </header>

        {/* Category Filter Pills */}
        <nav className="amp-blog-category-filter">
          {categories.map((cat) => (
            <button
              key={cat}
              className={selectedCategory === cat ? "active" : ""}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Blog Grid */}
        <main className="amp-blog-grid">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <article className="amp-blog-card" key={blog._id}>
                {/* Image & Floating Tag */}
                <div className="amp-blog-image-wrapper">
                  <img src={blog.image} alt={blog.title} loading="lazy" />
                  {blog.category && (
                    <span className="amp-blog-category-tag">{blog.category}</span>
                  )}
                </div>

                {/* Body Content */}
                <div className="amp-blog-content">
                  <h2>{blog.title}</h2>

                  <p
                    className={`amp-blog-desc ${
                      expandedBlog === blog._id ? "expanded" : ""
                    }`}
                  >
                    {blog.description}
                  </p>

                  {blog.description && blog.description.length > 120 && (
                    <button
                      className="amp-see-more-btn"
                      onClick={() =>
                        setExpandedBlog(
                          expandedBlog === blog._id ? null : blog._id
                        )
                      }
                    >
                      {expandedBlog === blog._id ? "Show Less ↑" : "Read More →"}
                    </button>
                  )}

                  {/* Metadata Badges */}
                  {(blog.studentName || blog.company || blog.package) && (
                    <div className="amp-blog-meta">
                      {blog.studentName && (
                        <span className="amp-meta-badge student">
                          👤 {blog.studentName}
                        </span>
                      )}
                      {blog.company && (
                        <span className="amp-meta-badge company">
                          🏢 {blog.company}
                        </span>
                      )}
                      {blog.package && (
                        <span className="amp-meta-badge package">
                          💰 {blog.package}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))
          ) : (
            <div className="amp-no-blogs">
              <div className="amp-no-blogs-icon">📁</div>
              <h2>No Blogs Available</h2>
              <p>Check back later or try selecting another category.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Blogs;
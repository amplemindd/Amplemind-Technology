import "../CSS/nav.css";
import { Link } from "react-router-dom";
import { useState } from "react";

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="nav-wrapper">
        <div className="nav-logo-left"></div>

        <div className={menuOpen ? "nav-links active" : "nav-links"}>
          <nav>

            <Link to={"/home"} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to={"/about-us"} onClick={() => setMenuOpen(false)}>About</Link>
            <Link to={"/services"} onClick={() => setMenuOpen(false)}>Services</Link>
            <Link to={"/contact-us"} onClick={() => setMenuOpen(false)}>Contact</Link>
            <Link to={"/careers"} onClick={() => setMenuOpen(false)}>Careers</Link>
            <Link to={"/blogs"} onClick={() => setMenuOpen(false)}>Blogs</Link>
            <Link to={"/faqs"} onClick={() => setMenuOpen(false)}>FAQs</Link>

          </nav>
        </div>

        <div
          className={menuOpen ? "menu-toggle active" : "menu-toggle"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </div>
      </div>
    </>
  );
}

export default Nav;

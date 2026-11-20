import "../CSS/home.css";
import aboutImg from "../Images/home-image.jpg";
import starr from "../Images/star.png";

function Home() {
  return (
    <>
      <div className="hero-section">
        <div className="hero-leftt">
          <h5>[ AMPLEMIND TECHNOLOGIES ]</h5>

          <h1>
            Innovative Tech
            <br />
            Solutions for
            <br />
            Business.
          </h1>

          <div className="hero-btns">
            <button
              onClick={() =>
                window.open(
                  "https://wa.me/919284661825?text=Hello%20AmpleMind%20Team,%20I%20visited%20your%20website%20and%20I%20want%20to%20know%20more%20about%20your%20services.",
                  "_blank",
                )
              }
            >
              Explore Services <span>↗</span>
            </button>

            <h3>📞 +91 95522 11561</h3>
          </div>

          <div className="hero-bottom">
            <p>✔ Innovate Smarter</p>
            <p>✔ Technology Simplified</p>
          </div>
        </div>

        <div className="hero-right">
          <img src={aboutImg} alt="AmpleMind Technologies" />

          <div className="trust-box">
            <h3>
              Your Vision, <br /> Our Technology
            </h3>
          </div>
        </div>
      </div>

      {/* ================= MARQUEE ================= */}

      <div className="marquee-container">
        <div className="marquee-track">
          <div className="marquee-item">
            <span className="star">
              <img src={starr} alt="star" />
            </span>
            <h1>Founders And Vision</h1>
          </div>

          <div className="marquee-item">
            <span className="star">
              <img src={starr} alt="star" />
            </span>
            <h1>Growth And Impact</h1>
          </div>

          <div className="marquee-item">
            <span className="star">
              <img src={starr} alt="star" />
            </span>
            <h1>Team And Values</h1>
          </div>

          <div className="marquee-item">
            <span className="star">
              <img src={starr} alt="star" />
            </span>
            <h1>Innovation And Future</h1>
          </div>

          <div className="marquee-item">
            <span className="star">
              <img src={starr} alt="star" />
            </span>
            <h1>Founders And Vision</h1>
          </div>

          <div className="marquee-item">
            <span className="star">
              <img src={starr} alt="star" />
            </span>
            <h1>Growth And Impact</h1>
          </div>

          <div className="marquee-item">
            <span className="star">
              <img src={starr} alt="star" />
            </span>
            <h1>Team And Values</h1>
          </div>

          <div className="marquee-item">
            <span className="star">
              <img src={starr} alt="star" />
            </span>
            <h1>Innovation And Future</h1>
          </div>
        </div>
      </div>

      <div className="main-home">
        <div className="main-box">
          <div className="main-box-img"></div>

          <div className="main-box-para">
            <h1>Software Development</h1>

            <p>
              Custom websites, web apps and scalable software solutions for
              modern <span>businesses</span>.
            </p>
          </div>
        </div>

        <div className="main-box">
          <div className="main-box-img"></div>

          <div className="main-box-para">
            <h1>Digital Marketing</h1>

            <p>
              SEO, social media marketing and branding strategies to grow your{" "}
              <span>online presence</span>.
            </p>
          </div>
        </div>

        <div className="main-box">
          <div className="main-box-img"></div>

          <div className="main-box-para">
            <h1>Graphics Design</h1>

            <p>
              Creative UI/UX designs, branding materials and visual content for
              your <span>business</span>.
            </p>
          </div>
        </div>
      </div>

      {/* ================= ABOUT SECTION ================= */}

      <div className="home-container">
        <div className="home-left">
          <img
            src={aboutImg}
            alt="Website Development Services"
            loading="lazy"
          />

          <div className="home-card">
            <p>Client Requirement</p>

            <p>Modern UI/UX Design</p>

            <p>Software / Website Development</p>

            <p>Testing</p>

            <p>Deployment</p>

            <p>Project Launch</p>
          </div>
        </div>

        <div className="home-right">
          <h5>COMPANY OVERVIEW</h5>

          <h1>Building Powerful Digital Experiences For Future Growth</h1>

          <p className="home-text">
            AmpleMind delivers innovative technology solutions including web
            development, digital marketing, UI/UX design and business
            automation. We help startups and businesses grow with modern,
            scalable and user-focused digital services.
          </p>

          <div className="home-boxes">
            <div className="homebox">
              {/* <span>🌐</span> */}

              <h3>Smart Technology</h3>

              <p>
                We create modern and scalable digital solutions tailored for
                startups and businesses.
              </p>
            </div>

            <div className="homebox active">
              {/* <span>⚙️</span> */}

              <h3>Innovation & Scalability</h3>

              <p>
                Delivering high-performance software and creative solutions for
                long-term business growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;

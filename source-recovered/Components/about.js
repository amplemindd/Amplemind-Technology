import { useState } from "react";
import "../CSS/about.css";
import mainImg from "../Images/man.jpg";
import sideImg from "../Images/man2.jpg";
import CountUp from "react-countup";

function About() {
  const [activeTab, setActiveTab] = useState("frontend");

  const technologies = {
    frontend: [
      {
        name: "ReactJS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      },
      {
        name: "AngularJS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
      },
      {
        name: "VueJS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
      },
      {
        name: "Next.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
      },
    ],

    backend: [
      {
        name: "NodeJS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      },
      {
        name: "ExpressJS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
      },
      {
        name: "Python",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      },
      {
        name: "Java",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      },
    ],

    mobile: [
      {
        name: "Flutter",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
      },
      {
        name: "React Native",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      },
      {
        name: "iOS Development",
        icon: "https://cdn-icons-png.flaticon.com/512/0/747.png",
      },
    ],

    database: [
      {
        name: "MongoDB",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
      },
      {
        name: "SQL Server",
        icon: "https://img.icons8.com/color/512/microsoft-sql-server.png",
      },
      {
        name: "PostgreSQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
      },
    ],

    tools: [
      {
        name: "Git",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
      },
      {
        name: "GitHub",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
      },
    ],

    cloud: [
      {
        name: "AWS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
      },
      {
        name: "Azure",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
      },
      {
        name: "Google Cloud",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
      },
    ],
  };
  return (
    <>
      <div className="about2-section">
        <div className="about2-container">
          {/* LEFT SIDE */}
          <div className="about2-left">
            <div className="about2-play-btn">▶</div>

            <img
              src={sideImg}
              alt="AmpleMind Team"
              className="about2-side-img"
              loading="lazy"
            />

            <img
              src={mainImg}
              alt="Website Development Company"
              className="about2-main-img"
              loading="lazy"
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="about2-right">
            <h1>Empowering Businesses With Smart Technology</h1>

            <p className="about2-blue-text">
              Delivering innovative digital solutions with creativity,
              performance and reliability.
            </p>

            <p className="about2-desc">
              AmpleMind is a modern technology company focused on web
              development, digital marketing, UI/UX design and scalable business
              solutions. Our mission is to help startups and businesses grow
              through innovative and user-friendly digital experiences.
            </p>

            {/* Progress */}
            <div className="about2-progress-box">
              <div className="about2-progress-box-inner">
                <span>95.00% Work Success</span>
              </div>
            </div>

            {/* Bottom Text */}
            <div className="about2-text-row">
              <p>
                Building responsive and high-performance websites for modern
                businesses.
              </p>

              <p>
                Helping businesses choose the right digital strategy and
                technology solutions.
              </p>
            </div>

            {/* Services */}
            <div className="about2-service-row">
              <div className="about2-service-box">
                <div className="about2-icon-circle">◎</div>

                <div>
                  <h3>Web Development</h3>
                  <span>50+ Projects</span>
                </div>
              </div>

              <div className="about2-service-box">
                <div className="about2-icon-circle">☁</div>

                <div>
                  <h3>IT Consulting</h3>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COUNTER SECTION */}

        <div className="about2-counter-section">
          <div className="about2-counter-box">
            <h1>
              +<CountUp end={500} duration={5} />
            </h1>
            <p>IT Consultant Placement</p>
          </div>

          <div className="about2-counter-box">
            <h1>
              +<CountUp end={50} duration={5} />
            </h1>
            <p>Our Total Project</p>
          </div>

          <div className="about2-counter-box">
            <h1>
              +<CountUp end={100} duration={5} />
            </h1>
            <p>Corporate Training</p>
          </div>

          <div className="about2-counter-box">
            <h1>
              +<CountUp end={30} duration={5} />
            </h1>
            <p>Our Team Member</p>
          </div>
        </div>
      </div>

      {/* VIDEO SECTION */}

      <div className="about2-middle-video-section">
        <div className="about2-middle-video">
          <a href="/">▶</a>
        </div>
      </div>

      {/* CHOOSE SECTION */}

      <div className="about2-choose-container">
        {/* Left Side Image */}
        <div className="about2-choose-image">
          <img
            src="https://theme7x.com/itodo/images/about/p3.jpg"
            alt="Professional Web Development Team"
            loading="lazy"
          />
        </div>

        {/* Right Side Content */}
        <div className="about2-choose-content">
          <h1>
            Why Choose Us To <br /> Join Our Work?
          </h1>
          <div className="about2-choose-list">
            <div className="about2-list-item">
              <span>✔</span>
              <p>Innovative Software & IT Solutions</p>
            </div>

            <div className="about2-list-item">
              <span>✔</span>
              <p>Experienced Developers & Technology Experts</p>
            </div>

            <div className="about2-list-item">
              <span>✔</span>
              <p>Custom Web, Mobile & Software Development</p>
            </div>

            <div className="about2-list-item">
              <span>✔</span>
              <p>End-to-End Project Development & Support</p>
            </div>

            <div className="about2-list-item">
              <span>✔</span>
              <p>Reliable, Secure & Scalable Digital Solutions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="about2-tech-section">
        <span className="about2-tech-subtitle">OUR TECHNOLOGIES</span>

        <h1>Technologies We Work With</h1>

        <div className="about2-tech-tabs">
          <span
            className={activeTab === "frontend" ? "active" : ""}
            onClick={() => setActiveTab("frontend")}
          >
            FRONT END
          </span>

          <span
            className={activeTab === "backend" ? "active" : ""}
            onClick={() => setActiveTab("backend")}
          >
            BACK END
          </span>

          <span
            className={activeTab === "mobile" ? "active" : ""}
            onClick={() => setActiveTab("mobile")}
          >
            MOBILE
          </span>

          <span
            className={activeTab === "database" ? "active" : ""}
            onClick={() => setActiveTab("database")}
          >
            DATABASE
          </span>

          <span
            className={activeTab === "tools" ? "active" : ""}
            onClick={() => setActiveTab("tools")}
          >
            TOOLS
          </span>

          <span
            className={activeTab === "cloud" ? "active" : ""}
            onClick={() => setActiveTab("cloud")}
          >
            CLOUD
          </span>
        </div>

        <div className="about2-tech-grid">
          {technologies[activeTab].map((tech, index) => (
            <div className="about2-tech-card" key={index}>
              <img src={tech.icon} alt={tech.name} />
              <h3>{tech.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default About;
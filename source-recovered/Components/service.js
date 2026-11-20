import "../CSS/service.css";

import img1 from "../Images/Website-Development.png";
import img2 from "../Images/software-dev.jpg";
import img3 from "../Images/Mobile-app.png";

import img4 from "../Images/Corporate-training.jpg";
import img5 from "../Images/IT-Consultant.png";
import img6 from "../Images/Digital-Marketing.png";

import img7 from "../Images/Real-Estate-Services.png";
import img8 from "../Images/Customer-Support.png";
import img9 from "../Images/Cloud-Hosting.png";

import png1 from "../Images/home-icone1.png";
import png2 from "../Images/home-icone2.png";
import png3 from "../Images/home-icone3.png";
import png4 from "../Images/home-icone4.png";
import png5 from "../Images/home-icone5.png";
import png6 from "../Images/home-icone6.png";

function Service() {
  return (
    <>
      <div className="us-service-main">

        {/* TITLE */}
        <div className="us-service-main-title">
          <h2>OUR SERVICES</h2>
          <h1>
            Sophisticated Knowledge For Rapidly Emerging Legal Service Of
            Our IT Solutions!
          </h1>
        </div>

        {/* SERVICE ROW 1 */}
        <div className="us-service-card-section">

          <div className="us-service-card-box">
            <div className="us-service-icon-circle">
              <img
                src={img1}
                alt="Website Development"
                className="us-service-image"
                loading="lazy"
              />
            </div>
            <h2>Website Development</h2>
            <p>
              E-Commerce or Static Website Development with responsive design,
              fast loading speed, SEO optimization, and secure web solutions
              for all business types.
            </p>
            <button className="us-service-btn">→</button>
          </div>

          <div className="us-service-card-box">
            <div className="us-service-icon-circle">
              <img
                src={img2}
                alt="Software Development"
                className="us-service-image"
                loading="lazy"
              />
            </div>
            <h2>Software Development</h2>
            <p>
              Banking, Finance, Billing System, ERP, CRM, and custom software
              solutions designed to improve business productivity and management.
            </p>
            <button className="us-service-btn">→</button>
          </div>

          <div className="us-service-card-box">
            <div className="us-service-icon-circle">
              <img
                src={img3}
                alt="Mobile Application"
                className="us-service-image"
                loading="lazy"
              />
            </div>
            <h2>Mobile Application</h2>
            <p>
              Android & iOS App Development for all business solutions with
              modern UI, smooth performance, and secure functionality.
            </p>
            <button className="us-service-btn">→</button>
          </div>
        </div>

        {/* SERVICE ROW 2 */}
        <div className="us-service-card-section">

          <div className="us-service-card-box">
            <div className="us-service-icon-circle">
              <img
                src={img4}
                alt="Corporate Training"
                className="us-service-image"
                loading="lazy"
              />
            </div>
            <h2>Corporate Training</h2>
            <p>
              Provide Training on Fullstack Development, Data Science,
              Programming Languages, Database Management, and modern industry
              technologies.
            </p>
            <button className="us-service-btn">→</button>
          </div>

          <div className="us-service-card-box">
            <div className="us-service-icon-circle">
              <img
                src={img5}
                alt="IT Consultant"
                className="us-service-image"
                loading="lazy"
              />
            </div>
            <h2>Recruitment Consultant</h2>
            <p>
              Providing job requirements, hiring for startups and MNC companies,
              project guidance, and business technology consulting services.
            </p>
            <button className="us-service-btn">→</button>
          </div>

          <div className="us-service-card-box">
            <div className="us-service-icon-circle">
              <img
                src={img6}
                alt="Digital Marketing"
                className="us-service-image"
                loading="lazy"
              />
            </div>
            <h2>Digital Marketing</h2>
            <p>
              Google profile creation, SEO, Meta ads, social media marketing,
              branding, and online business promotion services.
            </p>
            <button className="us-service-btn">→</button>
          </div>
        </div>

        {/* SERVICE ROW 3 */}
        <div className="us-service-card-section">

          <div className="us-service-card-box">
            <div className="us-service-icon-circle">
              <img
                src={img7}
                alt="UI UX Design"
                className="us-service-image"
                loading="lazy"
              />
            </div>
            <h2>Real Estate Services</h2>
            <p>
              We provide flats, residential and commercial properties, rental homes, and complete real estate solutions.
            </p>
            <button className="us-service-btn">→</button>
          </div>

          <div className="us-service-card-box">
            <div className="us-service-icon-circle">
              <img
                src={img8}
                alt="Customer Support"
                className="us-service-image"
                loading="lazy"
              />
            </div>
            <h2>Customer Support</h2>
            <p>
              24/7 Customer Support, Email Support, Live Chat Support,
              Client Follow-Up Support, and technical assistance services.
            </p>
            <button className="us-service-btn">→</button>
          </div>

          <div className="us-service-card-box">
            <div className="us-service-icon-circle">
              <img
                src={img9}
                alt="Cloud Hosting"
                className="us-service-image"
                loading="lazy"
              />
            </div>
            <h2>Cloud & Hosting</h2>
            <p>
              Cloud Development, Server Management, Web Hosting Solutions,
              Database Management, deployment, and security maintenance services.
            </p>
            <button className="us-service-btn">→</button>
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="us-service-middle">

        <div className="us-service-middle-title">
          <h2>WHY CHOOSE US</h2>
          <h1>Our Work Services</h1>
        </div>

        {/* ROW 1 */}
        <div className="us-service-middle-row1">

          <div className="us-service-middle-box">
            <div className="us-service-box-img">
              <img src={png1} alt="Professional Consulting" loading="lazy" />
            </div>
            <h1>Professional Consulting</h1>
            <p>
              Expert IT consulting solutions to improve business growth,
              productivity, and digital transformation.
            </p>
          </div>

          <div className="us-service-middle-box">
            <div className="us-service-box-img">
              <img src={png2} alt="Secure IT Solutions" loading="lazy" />
            </div>
            <h1>Secure IT Solutions</h1>
            <p>
              We provide secure and reliable technology services with advanced
              protection and support.
            </p>
          </div>

          <div className="us-service-middle-box">
            <div className="us-service-box-img">
              <img src={png3} alt="Monitoring Review" loading="lazy" />
            </div>
            <h1>Monitoring & Review</h1>
            <p>
              Continuous monitoring and project review services for better
              performance and quality assurance.
            </p>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="us-service-middle-row2">

          <div className="us-service-middle-box">
            <div className="us-service-box-img">
              <img src={png4} alt="Modern Technology" loading="lazy" />
            </div>
            <h1>Modern Technology</h1>
            <p>
              Latest technologies and modern frameworks for scalable software
              and web applications.
            </p>
          </div>

          <div className="us-service-middle-box">
            <div className="us-service-box-img">
              <img src={png5} alt="Business Strategy" loading="lazy" />
            </div>
            <h1>Business Strategy</h1>
            <p>
              Strategic planning and digital business solutions to enhance
              company performance and growth.
            </p>
          </div>

          <div className="us-service-middle-box">
            <div className="us-service-box-img">
              <img src={png6} alt="Technical Support" loading="lazy" />
            </div>
            <h1>Technical Support</h1>
            <p>
              Dedicated technical support and maintenance services available
              for all software and IT solutions.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Service;
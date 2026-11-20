import "../CSS/footer.css";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";

function Footer() {

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const sendFooterEmail = (e) => {
    e.preventDefault();

    const formData = {
      name: capitalizeWords(e.target.name.value),
      email: e.target.email.value,
      message: capitalizeWords(e.target.message.value),
    };
    
    emailjs
      .send(
        "service_ei6n70c",
        "template_nqr886k",
        formData,
        "ADK8N77N4ePPfTVvW"
      )
      .then(() => {
        alert("Message Sent Successfully!");
        e.target.reset();
      })
      .catch((error) => {
        console.log(error);
        alert("Failed to send message!");
      });
  };

  return (
    <>
      <div className="footer-main">

        <div className="footer-content">

          {/* Left */}
          <div className="footer-left">
            <h2>AmpleMind</h2>

            <p>
              08, Nandanvan, Near Zudio,
              <br />
              Opposite of Gurudev Nagar bus stop,
              <br />
              Nagpur, Maharashtra 440009.
            </p>

            <div className="contact">

              <div>
                <span>Phone number</span>
                <h4>(+91) 95522 11561</h4>
              </div>

              <div>
                <span>Email</span>
                <h4>contact@amplemind.in</h4>
              </div>

            </div>
          </div>

          {/* Links */}
          <div className="footer-links">

            <div>
              <h3>Quick links</h3>
              <Link to="/about-us">About us</Link>
              <Link to="/services">Services</Link>
              <Link to="/faqs">FAQ</Link>
              <Link to="/contact-us">Contact us</Link>
            </div>

            <div>
              <h3>Social</h3>

              <a
                href="https://www.facebook.com/100092625685076/"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>

              <a
                href="https://www.instagram.com/amplemind_?igsh=MTUyZmRic2FwcDR1MA=="
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>

              <a
                href="https://in.linkedin.com/company/amplemindtechnologies"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>

              <a href="/">Twitter</a>

              <a
                href="https://youtube.com/@amplemind?si=orfm4lgIQNUyl36o"
                target="_blank"
                rel="noreferrer"
              >
                Youtube
              </a>
            </div>

            <div>
              <h3>Legal</h3>

              <Link to="/terms">Terms of Service</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>


          {/* Form */}
          <div className="footer-form">

            <form onSubmit={sendFooterEmail}>

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
              />

              <textarea
                name="message"
                placeholder="Your Message"
                required
              ></textarea>

              <button type="submit">
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 AmpleMind Technology. All rights reserved.</p>
        </div>

      </div>
    </>
  );
}

export default Footer;
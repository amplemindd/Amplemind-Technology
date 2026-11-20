import React from "react";
import "../CSS/contact.css";
import emailjs from "@emailjs/browser";

function Contact() {
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_ei6n70c",
        "template_s8wbolw",
        e.target,
        "ADK8N77N4ePPfTVvW"
      )
      .then((result) => {
        console.log(result.text);
        alert("Message Sent Successfully!");
        e.target.reset();
      })
      .catch((error) => {
        console.log(error.text);
        alert("Failed to send message!");
      });
  };

  return (
    <div className="amp-contact-wrapper">
      <section className="amp-contact-section">
        {/* LEFT CONTENT */}
        <div className="amp-contact-content">
          <span className="amp-contact-small-title">CONTACT US</span>

          <h1>
            Let’s Build <br />
            Something Amazing
          </h1>

          <p className="amp-contact-description">
            We help businesses with Website Development, Software Solutions,
            Mobile Apps, UI/UX Design, Digital Marketing, and Cloud Services.
          </p>

          <div className="amp-contact-details">
            <div className="amp-contact-detail-box">
              <div className="amp-contact-icon">✉️</div>
              <div>
                <h3>Email</h3>
                <p>contact@amplemind.in</p>
              </div>
            </div>

            <div className="amp-contact-detail-box">
              <div className="amp-contact-icon">📞</div>
              <div>
                <h3>Phone</h3>
                <p>(+91) 95522 11561</p>
              </div>
            </div>

            <div className="amp-contact-detail-box">
              <div className="amp-contact-icon">📍</div>
              <div>
                <h3>Location</h3>
                <p>Nagpur, Maharashtra</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="amp-contact-form-box">
          <div className="amp-form-top">
            <h2>Send a Message</h2>
            <p>Fill out the form and our team will contact you soon.</p>
          </div>

          <form className="amp-contact-form" onSubmit={sendEmail}>
            <div className="amp-form-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
              />
            </div>

            <div className="amp-form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
              />
            </div>

            <div className="amp-form-group">
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                required
              />
            </div>

            <div className="amp-form-group">
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                required
              />
            </div>

            <div className="amp-form-group">
              <textarea
                name="message"
                placeholder="Write your message..."
                required
              ></textarea>
            </div>

            <button type="submit" className="amp-send-btn">
              SEND MESSAGE <span>→</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Contact;
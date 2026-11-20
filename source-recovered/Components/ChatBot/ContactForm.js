import { useState } from "react";

function ContactForm({ course }) {
  const [formData, setFormData] = useState({
    name: "",

    email: "",

    phone: "",

    course: course || "",

    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://amplemindtechnologies.com/api/leads",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("✅ Details Submitted Successfully");

        setFormData({
          name: "",

          email: "",

          phone: "",

          course: course || "",

          message: "",
        });
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      alert("Server Error");

      console.log(error);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h3>📝 Apply Now</h3>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="tel"
        name="phone"
        placeholder="Mobile Number"
        value={formData.phone}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="course"
        placeholder="Course"
        value={formData.course}
        onChange={handleChange}
        readOnly
      />

      <textarea
        name="message"
        placeholder="Message"
        rows="4"
        value={formData.message}
        onChange={handleChange}
      ></textarea>

      <button type="submit" className="submit-btn">
        Submit
      </button>
    </form>
  );
}

export default ContactForm;

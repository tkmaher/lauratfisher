import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    email: '',
    message: '',
  });

  const emailURL = new URL(
    "https://lauratfisher-worker.tomaszkkmaher.workers.dev/?page=connect"
  );

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClick = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const newUrl = new URL(emailURL);
      let response = await fetch(newUrl, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
      });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Form submitted:', formData);
      alert('Thank you for your message!');
    } catch (err) {
        console.error("Error sending email: ", err);
        alert("Error sending email.");
    }
    setFormData({ name: '', subject: '', email: '', message: '' }); // Clear the form
  };

  return (
    <form id="connectform" onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          placeholder="Name*"
          onClick={handleClick}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          placeholder="Subject*"
          onClick={handleClick}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          placeholder="Email*"
          onClick={handleClick}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <textarea
            style={{width: "100%"}}
            id="message"
            name="message"
            value={formData.message}
            placeholder='Your Message'
            onChange={handleChange}
            required
        ></textarea>
      </div>
      <button type="submit">Send Message...</button>
    </form>
  );
}


import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: any) => {

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClick = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Here you would typically send the formData to a backend or a third-party service
    console.log('Form submitted:', formData);
    alert('Thank you for your message!');
    setFormData({ name: '', email: '', message: '' }); // Clear the form
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          id="name"
          name="name"
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
      <button type="submit">Send Message</button>
    </form>
  );
}


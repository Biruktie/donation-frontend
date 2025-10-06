import React from "react";

const Contact = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white py-12 px-4">
    <h1 className="text-3xl font-bold text-green-700 mb-4">
      Contact Information
    </h1>
    <p className="text-lg text-green-800 mb-2">
      For inquiries, support, or partnership opportunities, please contact us:
    </p>
    <div className="bg-green-50 rounded-xl shadow p-6 flex flex-col items-center">
      <div className="mb-2">
        <span className="font-semibold">Email:</span>{" "}
        <a
          href="mailto:info@ethi-donations.org"
          className="text-green-700 hover:underline"
        >
          info@ethi-donations.org
        </a>
      </div>
      <div className="mb-2">
        <span className="font-semibold">Phone:</span>{" "}
        <a href="tel:+251900000000" className="text-green-700 hover:underline">
          +251 900 000 000
        </a>
      </div>
      <div>
        <span className="font-semibold">Address:</span> Addis Ababa, Ethiopia
      </div>
    </div>
  </div>
);

export default Contact;

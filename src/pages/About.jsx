import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-green-700 mb-4 text-center">
          About Ethiopian NGO Digital Donations
        </h2>
        <p className="text-green-700 mb-4 text-center">
          Many Ethiopian NGOs, like Macedonia, face challenges collecting
          digital donations due to security concerns and accessibility barriers,
          often relying on cash or insecure third-party tools. Our platform is
          designed to build trust, ensure security, and provide localized
          accessibility for all donors and organizations.
        </p>
        <ul className="list-disc pl-6 text-green-700 mb-4 text-left">
          <li>
            Verified NGO profiles with real stories and photos, shared with
            consent, so donors see exactly who they are helping.
          </li>
          <li>
            Blockchain-powered public ledger logs every donation and its impact
            (e.g., “Donation A purchased ‘this’ for Child B”).
          </li>
          <li>
            Multi-language support (Amharic & Oromo) for wider accessibility.
          </li>
          <li>
            Integration with Tele birr/CBE and SMS OTP for secure, fraud-free
            donations.
          </li>
          <li>
            Automated donation process to help NGOs reach and support more
            people in need.
          </li>
        </ul>
        <p className="text-green-700 text-center">
          This project aligns with Cyber Talent Ethiopia’s mission, empowering
          local organizations and allowing developers to build full stack and
          cybersecurity skills while solving real-life problems.
        </p>
      </div>
    </div>
  );
};

export default About;

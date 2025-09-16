import React from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaDonate, FaChartLine } from "react-icons/fa";

export default function Home() {
  return (
    <div className="w-full font-sans">
      {/* HERO SECTION */}
      <section
        className="relative h-[90vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1532629345422-7515f3d16bb6')",
        }}
      >
        <div className="absolute inset-0 bg-green-900/60"></div>
        <div className="relative z-10 text-white px-6">
          <h1 className="text-4xl md:text-6xl font-bold">
            Support Verified NGOs in Ethiopia
          </h1>
          <p className="text-lg md:text-xl mt-4 text-white/90 max-w-2xl mx-auto">
            Give with confidence. Track your impact in real time using
            blockchain transparency.
          </p>
          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-green-400 hover:bg-green-500 text-black font-semibold px-6 py-3 rounded-lg"
            >
              Get Started
            </Link>
            <Link
              to="/ngos"
              className="bg-white hover:bg-green-100 text-green-800 font-semibold px-6 py-3 rounded-lg"
            >
              Explore NGOs
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-green-50 text-center">
        <h2 className="text-3xl font-bold mb-8 text-green-800">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div>
            <FaSearch className="text-green-400 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Discover</h3>
            <p className="text-green-700 mt-2">
              Browse verified NGO profiles with real stories and photos.
            </p>
          </div>
          <div>
            <FaDonate className="text-green-400 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Donate</h3>
            <p className="text-green-700 mt-2">
              Choose your amount and payment method (Telebirr, CBE, etc.).
            </p>
          </div>
          <div>
            <FaChartLine className="text-green-400 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Track Impact</h3>
            <p className="text-green-700 mt-2">
              See exactly how your donation is used via blockchain.
            </p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 bg-white text-center">
        <h2 className="text-3xl font-bold mb-8 text-green-800">
          Why Choose Us?
        </h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            title="Verified NGOs"
            text="Every NGO is authenticated for credibility."
          />
          <FeatureCard
            title="Secure Payments"
            text="Multiple trusted payment gateways."
          />
          <FeatureCard
            title="Full Transparency"
            text="Track every donation on blockchain."
          />
          <FeatureCard
            title="Global Reach"
            text="Support causes anywhere in Ethiopia."
          />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 bg-green-50 text-center">
        <h2 className="text-3xl font-bold mb-8 text-green-800">
          What People Say
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <TestimonialCard
            name="Abebe T."
            text="I donated through this platform and could see exactly where my money went. I trust them completely."
          />
          <TestimonialCard
            name="Sara K."
            text="It feels amazing to give and actually see the impact in real time."
          />
          <TestimonialCard
            name="Mulugeta D."
            text="Finally a donation platform that puts transparency first."
          />
        </div>
      </section>

      {/* FINAL CTA (Landing page style, original text) */}
      <section className="w-full flex flex-col items-center justify-center py-12 px-4 bg-white">
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center">
          Ready to Make a Difference?
        </h2>
        <p className="text-lg md:text-xl text-green-800 mb-8 text-center max-w-2xl">
          Join us today and help create a transparent future for donations.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow transition"
          >
            Join Us Today
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-green-600 bg-white bg-opacity-80 flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-8 mb-2">
          <div className="flex items-center gap-2">
            <img
              src="/cbe-logo.png"
              alt="CBE Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="text-xs text-green-700 font-semibold">CBE</span>
          </div>
          <div className="flex items-center gap-2">
            <img
              src="/telebirr-logo.png"
              alt="Telebirr Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="text-xs text-green-700 font-semibold">
              Telebirr
            </span>
          </div>
        </div>
        <div className="mb-2">
          <Link
            to="/contact"
            className="text-green-700 hover:underline font-semibold"
          >
            Contact Info
          </Link>
        </div>
        <div>
          &copy; {new Date().getFullYear()} Ethiopian NGO Digital Donations. All
          rights reserved.
          <br />
          Powered by Cyber Talent Ethiopia
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, text }) {
  return (
    <div className="p-6 border rounded-lg shadow-sm hover:shadow-lg transition">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-green-700 mt-2">{text}</p>
    </div>
  );
}

function TestimonialCard({ name, text }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
      <p className="text-green-800 italic">"{text}"</p>
      <h4 className="mt-4 font-semibold">{name}</h4>
    </div>
  );
}

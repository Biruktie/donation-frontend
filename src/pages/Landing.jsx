import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const featuredNgos = [
  {
    id: 1,
    name: "Macedonia Humanitarian Association",
    image: "/hero-image.jpg", // Use your local image for demo
    description:
      "Supporting homeless and vulnerable communities in Addis Ababa.",
  },
  {
    id: 2,
    name: "Organization for Women in Self Employment (WISE)",
    image: "https://example.com/wise.jpg",
    description:
      "Empowering women through training and microfinance initiatives.",
  },
  {
    id: 3,
    name: "Hope for Children Organization",
    image: "https://example.com/hope.jpg",
    description:
      "Improving child welfare through education and health programs.",
  },
];

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        backgroundImage: "url('/tree.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      {/* Main content */}
      <main className="flex flex-col items-center justify-center flex-1 px-4">
        <section className="w-full flex flex-col items-center justify-center py-10 px-2 md:px-8">
          <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-2xl shadow-lg overflow-hidden bg-white">
            {/* Left: Image */}
            <div className="md:w-1/2 w-full h-72 md:h-auto flex-shrink-0">
              <img
                src="/hero-image.jpg"
                alt="Ethiopian NGO Hero"
                className="w-full h-full object-cover object-center"
              />
            </div>
            {/* Right: Text and CTA */}
            <div className="md:w-1/2 w-full flex flex-col justify-center items-center relative p-8 md:p-12 text-center overflow-hidden bg-gradient-to-br from-green-200 to-green-100">
              <h1 className="text-3xl md:text-4xl font-extrabold text-green-800 mb-4">
                Discover verified profiles with real stories and photos.
              </h1>
              <p className="text-lg md:text-xl text-green-700 mb-8 font-medium">
                Every donation is securely tracked on blockchain for full
                transparency.
                <br />
                Therefore
                <br />
                Give confidently and see your impact in real time.
              </p>
              <button
                onClick={() => navigate("/ngos")}
                className="mt-2 bg-green-700 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-green-600 transition"
              >
                Find NGOs to support
              </button>
            </div>
          </div>
        </section>
        {/* How It Works Section */}
        <section className="w-full flex flex-col items-center justify-center py-12 px-4 bg-white">
          <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-8 text-center">
            How It Works
          </h2>
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1: Choose NGO */}
            <div className="flex flex-col items-center text-center p-6 bg-green-50 rounded-xl shadow-sm">
              <span className="text-4xl mb-3">🔎</span>
              <h3 className="font-semibold text-lg mb-2 text-green-800">
                1. Choose an NGO
              </h3>
              <p className="text-green-700">
                Browse verified NGOs and select one whose mission inspires you.
              </p>
            </div>
            {/* Step 2: Donate Securely */}
            <div className="flex flex-col items-center text-center p-6 bg-green-50 rounded-xl shadow-sm">
              <span className="text-4xl mb-3">💳</span>
              <h3 className="font-semibold text-lg mb-2 text-green-800">
                2. Donate Securely
              </h3>
              <p className="text-green-700">
                Contribute using trusted Ethiopian payment systems (Telebirr /
                CBE).
              </p>
            </div>
            {/* Step 3: Track Your Impact */}
            <div className="flex flex-col items-center text-center p-6 bg-green-50 rounded-xl shadow-sm">
              <span className="text-4xl mb-3">📈</span>
              <h3 className="font-semibold text-lg mb-2 text-green-800">
                3. Track Your Impact
              </h3>
              <p className="text-green-700">
                See real-time updates and transparent reports on how your
                donation is making a difference.
              </p>
            </div>
          </div>
        </section>
        ;{/* Featured NGOs Section */}
        <section className="w-full flex flex-col items-center justify-center py-12 px-4 bg-green-50">
          <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-8 text-center">
            Featured NGOs
          </h2>
          <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {featuredNgos.map((ngo) => {
              // Assign images and logos for each NGO
              let mainImage = ngo.image;
              let logo = null;
              if (ngo.id === 1) {
                logo = "/mekedonia-logo.jpg";
                mainImage = "/hero-image.jpg";
              }
              if (ngo.id === 2) {
                logo = "/wise-logo.jpg";
                mainImage = "/wise-image.jpg";
              }
              if (ngo.id === 3) {
                logo = "/hope-logo.png";
                mainImage = "/hope-image.jpg";
              }
              return (
                <div
                  key={ngo.id}
                  className="bg-white rounded-2xl shadow-md border border-green-200 flex flex-col items-center hover:shadow-lg transition p-0 relative"
                >
                  {/* NGO logo overlay */}
                  {logo && (
                    <img
                      src={logo}
                      alt={ngo.name + " Logo"}
                      className="absolute top-2 left-2 h-10 w-10 object-contain bg-white rounded-full border border-green-200 shadow"
                      style={{ zIndex: 2 }}
                    />
                  )}
                  <img
                    src={mainImage}
                    alt={ngo.name}
                    className="h-48 w-full object-cover rounded-t-2xl"
                  />
                  <div className="p-6 flex flex-col flex-1 w-full">
                    <h3 className="text-xl font-semibold text-green-700 mb-2 text-center">
                      {ngo.name}
                    </h3>
                    <p className="text-gray-700 mb-4 text-center">
                      {ngo.description}
                    </p>
                    <button className="mt-auto bg-green-700 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-semibold transition w-full">
                      Donate
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => navigate("/ngos")}
            className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow transition"
          >
            See All NGOs
          </button>
        </section>
        {/* Why Donate Here Section */}
        <section className="w-full flex flex-col items-center justify-center py-12 px-4 bg-white">
          <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-8 text-center">
            Why Donate Here?
          </h2>
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Verified NGOs */}
            <div className="flex flex-col items-center text-center p-6 bg-green-50 rounded-xl shadow-sm">
              <span className="text-3xl mb-3">✅</span>
              <h3 className="font-semibold text-lg mb-2 text-green-800">
                Verified NGOs
              </h3>
              <p className="text-green-700">
                All NGOs are thoroughly vetted, so you can trust exactly where
                your money goes.
              </p>
            </div>
            {/* Secure Donations */}
            <div className="flex flex-col items-center text-center p-6 bg-green-50 rounded-xl shadow-sm">
              <span className="text-3xl mb-3">🔒</span>
              <h3 className="font-semibold text-lg mb-2 text-green-800">
                Secure Donations (Telebirr / CBE)
              </h3>
              <p className="text-green-700">
                Your contributions are processed through trusted Ethiopian
                payment systems for maximum safety.
              </p>
            </div>
            {/* Transparent Impact Reports */}
            <div className="flex flex-col items-center text-center p-6 bg-green-50 rounded-xl shadow-sm">
              <span className="text-3xl mb-3">🌍</span>
              <h3 className="font-semibold text-lg mb-2 text-green-800">
                Transparent Impact Reports
              </h3>
              <p className="text-green-700">
                Track every birr you give with real-time blockchain records and
                progress updates.
              </p>
            </div>
          </div>
        </section>
        {/* Testimonials / Success Stories Section */}
        <section className="w-full flex flex-col items-center justify-center py-12 px-4 bg-green-50">
          <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-8 text-center">
            Testimonials & Success Stories
          </h2>
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md">
              <p className="text-green-800 italic mb-4">
                “Thanks to this platform, I was able to support a local NGO and
                see exactly how my donation was used. I feel confident giving
                here.”
              </p>
              <span className="font-semibold text-green-700">Alemu T.</span>
              <span className="text-sm text-green-600">Donor</span>
            </div>
            {/* Testimonial 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md">
              <p className="text-green-800 italic mb-4">
                “Our organization received much-needed funds and could show our
                supporters real progress. The transparency builds trust.”
              </p>
              <span className="font-semibold text-green-700">Selamawit G.</span>
              <span className="text-sm text-green-600">NGO Representative</span>
            </div>
            {/* Testimonial 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md">
              <p className="text-green-800 italic mb-4">
                “I love that I can track my impact in real time. It’s easy to
                use and I know my money is making a difference.”
              </p>
              <span className="font-semibold text-green-700">Mekdes A.</span>
              <span className="text-sm text-green-600">Donor</span>
            </div>
          </div>
        </section>
        {/* Repeated Main CTA Section */}
        <section className="w-full flex flex-col items-center justify-center py-12 px-4 bg-white">
          <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center">
            Ready to make a difference?
          </h2>
          <p className="text-lg md:text-xl text-green-800 mb-8 text-center max-w-2xl">
            Discover verified profiles with real stories and photos. Every
            donation is securely tracked on blockchain for full transparency.
            Give confidently and see your impact in real time.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/ngos")}
              className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow transition"
            >
              Find NGOs to support
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-green-700 border border-green-700 px-8 py-3 rounded-lg font-semibold text-lg shadow hover:bg-green-50 transition"
            >
              Register
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
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
            <span className="text-xs text-green-700 font-semibold">Telebirr</span>
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
};

export default Landing;

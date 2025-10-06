import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NGORegister from "./pages/NGORegister";
import Landing from "./pages/Landing";
import About from "./pages/About";
import NGOs from "./pages/NGOs";
import Contact from "./pages/Contact";
import NgoDashboard from "./pages/NGODashboard";
import DonorDashboard from "./pages/DonorDashboard";
import ProfilePage from "./pages/ProfilePage";
import CampaignDetails from "./pages/CampaignDetails";
import MyCampaigns from "./pages/MyCampaigns";

export default function App() {
  return (
    <div>
      {/* Show Navbar on all pages except Landing */}
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <div className="p-4">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/ngo-register" element={<NGORegister />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/ngos" element={<NGOs />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route
                    path="/ngo-dashboard/:id"
                    element={
                      <PrivateRoute>
                        <NgoDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/donor-dashboard/:id"
                    element={
                      <PrivateRoute>
                        <DonorDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/profile/:id" element={<ProfilePage />} />
                  <Route path="/campaign/:id" element={<CampaignDetails />} />
                  <Route path="/my-campaigns" element={<MyCampaigns />} />
                </Routes>
              </div>
            </>
          }
        />
      </Routes>
    </div>
  );
}

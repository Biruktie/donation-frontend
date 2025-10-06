import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CampaignsList from "../components/CampaignsList"; // Adjust the import based on your file structure
import CreateCampaignModal from "../components/CreateCampaignModal"; // Import the modal component
import EditCampaignModal from "../components/EditCampaignModal"; // Import the edit modal component

const NgoDashboard = () => {
  const { id: userId } = useParams();
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null); // For image upload
  const [logoUrl, setLogoUrl] = useState(""); // For preview
  const [description, setDescription] = useState("");
  const [story, setStory] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [social, setSocial] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("pending");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentDonations, setRecentDonations] = useState([]);
  const [donationsLoading, setDonationsLoading] = useState(true);
  const [showAllDonations, setShowAllDonations] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false); // State to control modal visibility
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  // Fetch existing NGO info
  useEffect(() => {
    if (!userId) {
      setError("Missing user id in URL");
      return;
    }
    const fetchNGO = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/ngo/${userId}`);
        const data = await response.json();
        if (response.ok) {
          setName(data.name || "");
          setDescription(data.description || "");
          setStory(data.story || "");
          setPhone(data.phone || "");
          setAddress(data.address || "");
          setWebsite(data.website || "");
          setSocial(data.social || "");
          setBankAccount(data.bankAccount || "");
          setVerificationStatus(data.verified ? "verified" : "pending");
          setLogoUrl(data.logoUrl || "");
          setFeaturedImageUrl(data.featuredImageUrl || "");

          // Check if profile is "complete"
          if (
            data.name &&
            data.description &&
            data.logoUrl &&
            data.featuredImageUrl &&
            data.phone &&
            data.address &&
            data.bankAccount
          ) {
            setProfileUpdated(true);
          } else {
            setProfileUpdated(false);
          }
        } else {
          setError(data.message || "Failed to fetch NGO info");
        }
      } catch (err) {
        setError("Network error");
      }
    };

    fetchNGO();
  }, [userId]);

  // Fetch statistics when profile is updated
  useEffect(() => {
    if (!profileUpdated) return;
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/api/ngo/${userId}/statistics`
        );
        const data = await res.json();
        setStats(data);
      } catch {
        setStats(null);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [userId, profileUpdated]);

  // Fetch recent donations when profile is updated
  useEffect(() => {
    if (!profileUpdated) return;
    const fetchDonations = async () => {
      setDonationsLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/api/donation/ngo/${userId}`
        );
        const data = await res.json();
        setRecentDonations(data.slice(0, 5)); // Show only the 5 most recent
      } catch {
        setRecentDonations([]);
      } finally {
        setDonationsLoading(false);
      }
    };
    fetchDonations();
  }, [userId, profileUpdated]);

  // Handle logo file selection
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogo(file);
    if (file) {
      setLogoUrl(URL.createObjectURL(file));
    }
  };

  // Handle featured image file selection
  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    setFeaturedImage(file);
    if (file) {
      setFeaturedImageUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Prepare form data for file upload
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("story", story);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("website", website);
    formData.append("social", social);
    formData.append("bankAccount", bankAccount);
    if (logo) formData.append("logo", logo);
    if (featuredImage) formData.append("featuredImage", featuredImage);

    try {
      const response = await fetch(
        `http://localhost:3000/api/ngo/update/${userId}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSuccess("Profile updated successfully!");
        setProfileUpdated(true);
        if (data.logoUrl) setLogoUrl(data.logoUrl);
      } else {
        setError(data.message || "Update failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  const displayedDonations = showAllDonations
    ? recentDonations
    : recentDonations.slice(0, 5);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-8">
      {!profileUpdated && (
        <form
          onSubmit={handleUpdate}
          className="bg-white p-12 rounded-lg shadow-md w-full max-w-3xl"
          encType="multipart/form-data"
        >
          <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">
            NGO Dashboard
          </h2>

          {success && (
            <div className="mb-4 text-green-600 text-center">{success}</div>
          )}
          {error && (
            <div className="mb-4 text-red-600 text-center">{error}</div>
          )}

          {/* Verification Status */}
          <div className="mb-4 text-center">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                verificationStatus === "verified"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {verificationStatus === "verified"
                ? "Verified"
                : "Pending Verification"}
            </span>
          </div>

          {/* Logo Upload */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-700 font-semibold">
              Upload your NGO Logo
            </label>
            <div className="flex flex-col items-center">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="NGO Logo"
                  className="w-20 h-20 rounded-full object-cover mb-2"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="block w-full text-sm text-gray-500"
              />
              {logo && (
                <span className="mt-2 text-xs text-gray-600">{logo.name}</span>
              )}
            </div>
          </div>

          {/* Featured Image Upload */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-700 font-semibold">
              Upload a Featured Image (shows what your NGO helps with)
            </label>
            <div className="flex flex-col items-center">
              {featuredImageUrl && (
                <img
                  src={featuredImageUrl}
                  alt="Featured"
                  className="w-32 h-20 object-cover mb-2 rounded"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFeaturedImageChange}
                className="block w-full text-sm text-gray-500"
              />
              {featuredImage && (
                <span className="mt-2 text-xs text-gray-600">
                  {featuredImage.name}
                </span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-700">NGO Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Story</label>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Website</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="https://yourngo.org"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Social Links</label>
            <input
              type="text"
              value={social}
              onChange={(e) => setSocial(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Facebook, Twitter, etc."
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-gray-700">
              Bank Account Info
            </label>
            <input
              type="text"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Bank name, account number, etc."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-500 transition"
          >
            Update Profile
          </button>
        </form>
      )}

      {profileUpdated && (
        <div className="mt-8 w-full px-8">
          <h3 className="text-2xl font-bold mb-8 text-green-700 text-left">
            Dashboard Sections
          </h3>
          {/* Statistics Section */}
          <div className="bg-white p-8 mb-8">
            <h4 className="text-lg font-semibold mb-4">Statistics</h4>
            {statsLoading ? (
              <div>Loading statistics...</div>
            ) : stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700">
                    {stats.totalDonations ?? 0}
                  </div>
                  <div className="text-gray-600">Total Donations (ETB)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700">
                    {stats.donorCount ?? 0}
                  </div>
                  <div className="text-gray-600">Donors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700">
                    {stats.campaignCount ?? 0}
                  </div>
                  <div className="text-gray-600">Campaigns</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700">
                    {stats.averageDonation ?? 0}
                  </div>
                  <div className="text-gray-600">Avg. Donation (ETB)</div>
                </div>
              </div>
            ) : (
              <div className="text-red-600">Failed to load statistics.</div>
            )}
            {stats?.topCampaign && (
              <div className="mt-6 text-center">
                <div className="font-semibold">Top Campaign:</div>
                <div>
                  {stats.topCampaign.title} ({stats.topCampaign.amount} ETB)
                </div>
              </div>
            )}
          </div>

          {/* Campaigns Section */}
          <div className="bg-white p-8 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Your Campaigns</h4>
            </div>
            <CampaignsList
              ngoId={userId}
              onCreate={() => setShowCreateModal(true)}
              onEdit={(campaign) => {
                setEditingCampaign(campaign);
                setShowEditModal(true);
              }}
            />
            {/* Modal for creating a campaign */}
            {showCreateModal && (
              <CreateCampaignModal
                ngoId={userId}
                onClose={() => setShowCreateModal(false)}
              />
            )}
            {/* Show the edit modal */}
            {showEditModal && editingCampaign && (
              <EditCampaignModal
                campaign={editingCampaign}
                onClose={() => setShowEditModal(false)}
              />
            )}
          </div>
          {/* All Donations Section */}
          <div className="bg-white p-8 mb-8">
            <h4 className="text-lg font-semibold mb-4">All Donations</h4>
            {donationsLoading ? (
              <div>Loading donations...</div>
            ) : recentDonations.length === 0 ? (
              <div>No donations yet.</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Donor</th>
                        <th className="py-2 px-4 border-b">Amount (ETB)</th>
                        <th className="py-2 px-4 border-b">Campaign</th>
                        <th className="py-2 px-4 border-b">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedDonations.map((donation) => (
                        <tr key={donation._id}>
                          <td className="py-2 px-4 border-b">
                            {donation.donor?.name || "Anonymous"}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {donation.amount}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {donation.campaign?.title || "N/A"}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Show See All/Show Less button if more than 5 donations */}
                {recentDonations.length > 5 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setShowAllDonations((prev) => !prev)}
                      className="text-sm text-green-700 hover:underline"
                    >
                      {showAllDonations
                        ? "Show less"
                        : `Show all ${recentDonations.length} donations`}
                    </button>
                  </div>
                )}
                {/* Show buttons only if there are donations and all are visible */}
                {showAllDonations && recentDonations.length > 0 && (
                  <div className="flex flex-row gap-4 mt-6">
                    <button
                      className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={() => {
                        const csvRows = [
                          ["Donor", "Amount (ETB)", "Campaign", "Date"],
                          ...recentDonations.map((d) =>
                            [
                              d.donor?.name || "Anonymous",
                              d.amount,
                              d.campaign?.title || "N/A",
                              new Date(d.createdAt).toLocaleDateString(),
                            ].join(",")
                          ),
                        ];
                        const csvContent =
                          "data:text/csv;charset=utf-8," + csvRows.join("\n");
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", "donations.csv");
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      Export to CSV
                    </button>
                    <button
                      className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                      onClick={() =>
                        alert("Withdraw funds feature coming soon!")
                      }
                    >
                      Withdraw Funds
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NgoDashboard;

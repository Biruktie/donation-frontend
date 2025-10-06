import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import CreateCampaignModal from "../components/CreateCampaignModal";

export default function MyCampaigns() {
  const { user } = useContext(AuthContext);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await axios.get(`/api/campaign/ngo/${user._id}`);
        setCampaigns(res.data);
      } catch (e) {
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    }
    if (user?._id) fetchCampaigns();
  }, [user]);

  const handleCampaignCreated = (newCampaign) => {
    setCampaigns((prev) => [newCampaign, ...prev]);
    setShowModal(false);
  };

  const filteredCampaigns = campaigns.filter((c) =>
    statusFilter === "all" ? true : c.status === statusFilter
  );

  if (loading) {
    return (
      <div className="p-8 text-center text-green-700">Loading campaigns...</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-800">My Campaigns</h2>
        <button
          className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
          onClick={() => setShowModal(true)}
        >
          + Create Campaign
        </button>
      </div>
      {showModal && (
        <CreateCampaignModal
          ngoId={user._id}
          onClose={() => setShowModal(false)}
          onCreated={handleCampaignCreated}
        />
      )}
      <div className="mb-4 flex gap-2">
        <button
          className={`px-3 py-1 rounded ${
            statusFilter === "all"
              ? "bg-green-700 text-white"
              : "bg-green-100 text-green-700"
          }`}
          onClick={() => setStatusFilter("all")}
        >
          All
        </button>
        <button
          className={`px-3 py-1 rounded ${
            statusFilter === "active"
              ? "bg-green-700 text-white"
              : "bg-green-100 text-green-700"
          }`}
          onClick={() => setStatusFilter("active")}
        >
          Active
        </button>
        <button
          className={`px-3 py-1 rounded ${
            statusFilter === "completed"
              ? "bg-green-700 text-white"
              : "bg-green-100 text-green-700"
          }`}
          onClick={() => setStatusFilter("completed")}
        >
          Completed
        </button>
      </div>
      {filteredCampaigns.length === 0 ? (
        <div className="text-gray-500">No campaigns found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign._id}
              className="bg-green-50 rounded-xl shadow p-4 flex flex-col"
            >
              <div className="font-bold text-green-800 text-lg mb-1">
                {campaign.title}
              </div>
              <div className="text-base font-semibold text-green-700 mb-1">
                Status: {campaign.status}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {campaign.description}
              </div>
              <div className="my-2 bg-green-100 h-2 rounded">
                <div
                  className="bg-green-500 h-2 rounded"
                  style={{
                    width:
                      campaign.raisedAmount && campaign.targetAmount
                        ? `${Math.min(
                            100,
                            (campaign.raisedAmount / campaign.targetAmount) *
                              100
                          )}%`
                        : "0%",
                    transition: "width 0.5s",
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-700 mb-2">
                <span>Raised: {campaign.raisedAmount || 0} ETB</span>
                <span>Target: {campaign.targetAmount} ETB</span>
              </div>
              <Link
                to={`/campaign/${campaign._id}`}
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-center"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

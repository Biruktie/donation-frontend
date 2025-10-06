import React, { useEffect, useState } from "react";

export default function CampaignsList({
  ngoId,
  onCreate = () => {},
  onEdit = () => {},
}) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/campaign/ngo/${ngoId}`
        );
        const data = await res.json();
        setCampaigns(data);
      } catch {
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, [ngoId]);

  if (loading) return <div>Loading campaigns...</div>;
  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="text-center text-gray-500 mb-6">
        No campaigns yet.
        <div className="mt-6 flex justify-center">
          <button
            className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-600"
            onClick={onCreate}
          >
            Create Campaign
          </button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((c) => (
          <div
            key={c._id}
            className="bg-white rounded-xl shadow border border-green-200 p-6 flex flex-col relative"
          >
            <h3 className="text-lg font-bold text-green-700 mb-2">{c.title}</h3>
            <p className="text-gray-700 mb-2">{c.description}</p>
            <div className="text-sm text-gray-500 mb-2">
              Target: {c.targetAmount} ETB
            </div>
            <div className="text-sm text-gray-500 mb-2 capitalize">
              Status: {c.status}
            </div>
            <button
              className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
              onClick={() => onEdit(c)}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <button
          className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-600"
          onClick={onCreate}
        >
          Create Campaign
        </button>
      </div>
    </div>
  );
}

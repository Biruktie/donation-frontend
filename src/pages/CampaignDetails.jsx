import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/campaign/${id}`);
        const data = await res.json();
        setCampaign(data);
      } catch {
        setCampaign(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!campaign)
    return (
      <div className="text-center py-12 text-red-600">Campaign not found.</div>
    );

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {campaign.imageUrl && (
        <img
          src={`http://localhost:3000${campaign.imageUrl}`}
          alt={campaign.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        {campaign.title}
      </h1>
      <p className="mb-4 text-gray-700">{campaign.description}</p>
      <div className="mb-2 text-gray-600">
        <strong>Target:</strong> {campaign.targetAmount} ETB
      </div>
      <div className="mb-2 text-gray-600">
        <strong>Deadline:</strong>{" "}
        {new Date(campaign.deadline).toLocaleDateString()}
      </div>
      {/* You can add a donation form here */}
      <button className="mt-6 bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition">
        Donate to this Campaign
      </button>
    </div>
  );
}

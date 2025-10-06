import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/campaign");
        const data = await res.json();
        setCampaigns(data.filter((c) => c.status === "active"));
      } catch {
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-green-700 text-center mb-8">
        All Active Campaigns
      </h2>
      {loading ? (
        <div className="text-center text-green-700">Loading campaigns...</div>
      ) : campaigns.length === 0 ? (
        <div className="text-center text-gray-500">
          No active campaigns yet.
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {campaigns.map((campaign) => (
            <div
              key={campaign._id}
              className="bg-white rounded-2xl shadow-md border border-green-200 flex flex-col items-center hover:shadow-lg transition p-0"
            >
              {campaign.imageUrl && (
                <img
                  src={
                    campaign.imageUrl
                      ? `http://localhost:3000${campaign.imageUrl}`
                      : `${import.meta.env.BASE_URL}default-campaign.jpg`
                  }
                  alt={campaign.title}
                  className="h-48 w-full object-cover rounded-t-2xl"
                />
              )}
              <div className="p-6 flex flex-col flex-1 w-full">
                <h3 className="text-xl font-semibold text-green-700 mb-2 text-center">
                  {campaign.title}
                </h3>
                <p className="text-gray-700 mb-4 text-center">
                  {campaign.description}
                </p>
                <div className="text-sm text-gray-500 mb-2 text-center">
                  Target: {campaign.targetAmount} ETB
                </div>
                <Link
                  to={`/campaign/${campaign._id}`}
                  className="mt-auto bg-green-700 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-semibold transition w-full text-center"
                >
                  Donate
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

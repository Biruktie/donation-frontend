import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import PaymentSettings from "../components/PaymentSettings";
import { Link } from "react-router-dom";

export default function DonorDashboard() {
  const { user } = useContext(AuthContext);
  const donorName = user?.name || "Donor";
  const userId = user?.id || user?._id;

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalDonated: 0,
    campaignsSupported: 0,
    impact: "",
    savedCampaigns: [],
  });
  const isNewDonor =
    summary.totalDonated === 0 && summary.campaignsSupported === 0;

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await axios.get(
          `/api/donor/${userId}` // changed from /api/donors/${userId}/summary
        );
        if (!ignore) {
          setSummary({
            totalDonated: res.data.totalDonated || 0,
            campaignsSupported: res.data.campaignsSupported || 0,
            impact: res.data.impact || "",
            savedCampaigns: res.data.savedCampaigns || [],
          });
        }
      } catch (e) {
        // optional: toast/log
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    if (userId) load();
    return () => {
      ignore = true;
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        <div className="animate-pulse h-24 bg-green-50 rounded-xl" />
        <div className="animate-pulse h-40 bg-white rounded-lg" />
        <div className="animate-pulse h-40 bg-white rounded-lg" />
      </div>
    );
  }

  const { totalDonated, campaignsSupported, impact, savedCampaigns } = summary;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome */}
      <section className="bg-green-50 rounded-xl p-6 flex items-center gap-6 shadow">
        {/* Avatar or Initials */}
        <div className="flex-shrink-0">
          {user?.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={donorName}
              className="w-16 h-16 rounded-full border-2 border-green-300 object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center text-2xl font-bold text-green-800 border-2 border-green-300">
              {donorName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-green-800">
            Welcome, <span className="text-green-700">{donorName}</span>!
          </h2>
          {isNewDonor ? (
            <div className="mt-2 text-green-700">
              You haven’t donated yet —{" "}
              <span className="font-semibold">
                start by exploring campaigns below.
              </span>
            </div>
          ) : (
            <div className="mt-2 text-green-700">
              <span className="mr-4">
                Total Donated: <b>ETB {totalDonated}</b>
              </span>
              <span className="mr-4">
                Campaigns Supported: <b>{campaignsSupported}</b>
              </span>
              <span>
                Impact: <b>{impact}</b>
              </span>
            </div>
          )}
        </div>
        <Link
          to={`/profile/${userId}`}
          className="inline-block mt-3 px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium shadow"
        >
          Edit Profile
        </Link>
      </section>

      {/* Donation Overview */}
      {!isNewDonor ? (
        <section>
          <h3 className="text-lg font-semibold mb-2 text-green-800">
            Donation Overview
          </h3>
          <div className="bg-green-50 rounded-xl shadow p-4">
            <div className="mb-4">[Donation History Chart]</div>
            <div className="mb-2">
              Top Causes Supported: Health, Education, Food
            </div>
            <div>Recent Donations: [List]</div>
          </div>
        </section>
      ) : (
        <section>
          <h3 className="text-lg font-semibold mb-2 text-green-800">
            Donation Overview
          </h3>
          <div className="bg-green-50 rounded-xl shadow p-4">
            Once you donate, you’ll see your donation history here.
          </div>
        </section>
      )}

      {/* Active Campaigns */}
      <section>
        <h3 className="text-lg font-semibold mb-2 text-green-800">
          Active Campaigns
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-xl shadow p-4">
            <div className="font-bold">[NGO Name]</div>
            <div className="text-sm text-gray-500">[Campaign Title]</div>
            <div className="my-2 bg-green-100 h-2 rounded">
              <div
                className="bg-green-500 h-2 rounded"
                style={{ width: "60%" }}
              />
            </div>
            <button className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
              Donate Now
            </button>
          </div>
        </div>
      </section>

      {/* Impact & Transparency */}
      {!isNewDonor ? (
        <section>
          <h3 className="text-lg font-semibold mb-2 text-green-800">
            Impact & Transparency
          </h3>
          <div className="bg-green-50 rounded-xl shadow p-4">
            <div>[Receipts, NGO updates, thank-you notes, blockchain log]</div>
          </div>
        </section>
      ) : (
        <section>
          <h3 className="text-lg font-semibold mb-2 text-green-800">
            Impact & Transparency
          </h3>
          <div className="bg-green-50 rounded-xl shadow p-4">
            Your receipts and impact updates will appear here after your first
            donation.
          </div>
        </section>
      )}

      {/* Saved Campaigns */}
      <section>
        <h3 className="text-lg font-semibold mb-2 text-green-800">
          Saved Campaigns
        </h3>
        <div className="bg-green-50 rounded-xl shadow p-4">
          {savedCampaigns?.length > 0 ? (
            <div>[List of bookmarked campaigns]</div>
          ) : (
            <div className="text-gray-500">
              Bookmark campaigns you care about to find them here.
            </div>
          )}
        </div>
      </section>

      {/* Notifications */}
      <section>
        <h3 className="text-lg font-semibold mb-2 text-green-800">
          Notifications
        </h3>
        <div className="bg-white rounded-lg shadow p-4 text-gray-500">
          No updates yet.
        </div>
      </section>

      {/* Payment & Settings */}
      <section>
        <h3 className="text-lg font-semibold mb-2 text-green-800">
          Payment & Settings
        </h3>
        <PaymentSettings />
      </section>

      {/* Community & Recognition */}
      {!isNewDonor ? (
        <section>
          <h3 className="text-lg font-semibold mb-2 text-green-800">
            Community & Recognition
          </h3>
          <div className="bg-green-50 rounded-xl shadow p-4">
            <div>
              [Badges, milestones, leaderboard, anonymous donation option]
            </div>
          </div>
        </section>
      ) : (
        <section>
          <h3 className="text-lg font-semibold mb-2 text-green-800">
            Community & Recognition
          </h3>
          <div className="bg-green-50 rounded-xl shadow p-4">
            <span className="italic">
              Unlock badges and milestones by making your first donation!
            </span>
          </div>
        </section>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";

export default function NGOs() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/ngo/");
        const data = await res.json();
        setNgos(data);
      } catch {
        setNgos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNgos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-green-700 text-xl">Loading NGOs...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-white py-10 px-4">
      <h1 className="text-3xl font-bold text-green-700 text-center mb-8">
        Available NGOs for Donation
      </h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {ngos.map((ngo) => (
          <div
            key={ngo._id}
            className="bg-white rounded-2xl shadow-md border border-green-200 flex flex-col items-center hover:shadow-lg transition p-0"
          >
            {/* Featured image */}
            {ngo.featuredImageUrl ? (
              <img
                src={`http://localhost:3000${ngo.featuredImageUrl}`}
                alt={ngo.name}
                className="h-48 w-full object-cover rounded-t-2xl"
              />
            ) : (
              <div className="h-48 w-full bg-green-50 rounded-t-2xl flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
            <div className="p-6 flex flex-col flex-1 w-full">
              {/* Logo */}
              {ngo.logoUrl && (
                <img
                  src={`http://localhost:3000${ngo.logoUrl}`}
                  alt={`${ngo.name} logo`}
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border border-green-200"
                />
              )}
              <h2 className="text-xl font-semibold text-green-700 mb-2 text-center">
                {ngo.name}
              </h2>
              <p className="text-gray-700 mb-4 text-center">
                {ngo.description}
              </p>
              <button className="mt-auto bg-green-700 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-semibold transition w-full">
                Donate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

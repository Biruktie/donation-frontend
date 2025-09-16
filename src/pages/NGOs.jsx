import React from "react";

const ngos = [
  {
    id: 1,
    name: "Macedonia Humanitarian Association",
    image: "https://example.com/macedonia.jpg",
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

export default function NGOs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-white py-10 px-4">
      <h1 className="text-3xl font-bold text-green-700 text-center mb-8">
        Available NGOs for Donation
      </h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {ngos.map((ngo) => (
          <div
            key={ngo.id}
            className="bg-white rounded-2xl shadow-md border border-green-200 flex flex-col items-center hover:shadow-lg transition p-0"
          >
            <img
              src={ngo.image}
              alt={ngo.name}
              className="h-48 w-full object-cover rounded-t-2xl"
            />
            <div className="p-6 flex flex-col flex-1 w-full">
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

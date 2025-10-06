import React, { useState } from "react";

export default function EditCampaignModal({ campaign, onClose }) {
  const [title, setTitle] = useState(campaign.title);
  const [description, setDescription] = useState(campaign.description);
  const [targetAmount, setTargetAmount] = useState(campaign.targetAmount);
  const [deadline, setDeadline] = useState(
    campaign.deadline ? campaign.deadline.slice(0, 10) : ""
  );
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    campaign.imageUrl ? `http://localhost:3000${campaign.imageUrl}` : ""
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("targetAmount", targetAmount);
      formData.append("deadline", deadline);
      if (image) formData.append("image", image);

      const res = await fetch(
        `http://localhost:3000/api/campaign/${campaign._id}`,
        {
          method: "PATCH",
          body: formData,
        }
      );
      const data = await res.json();
      if (res.ok) {
        setSuccess("Campaign updated!");
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1000);
      } else {
        setError(data.message || "Failed to update campaign");
      }
    } catch {
      setError("Network error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
        encType="multipart/form-data"
      >
        <h3 className="text-xl font-bold mb-4">Edit Campaign</h3>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Target Amount (ETB)</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
            min={1}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Deadline</label>
          <input
            type="date"
            className="w-full border px-3 py-2 rounded"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Campaign Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-full h-32 object-cover rounded"
            />
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-green-700 text-white hover:bg-green-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

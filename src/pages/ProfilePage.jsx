// src/pages/ProfilePage.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import PaymentSettings from "../components/PaymentSettings";
import { FaCamera, FaTrash } from "react-icons/fa";

export default function ProfilePage() {
  const { user: authUser, token } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Profile form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
  });

  // Secondary emails
  const [secondaryEmails, setSecondaryEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [showAddEmail, setShowAddEmail] = useState(false);

  // preferences (simple)
  const [prefs, setPrefs] = useState({
    receipts: true,
    ngoUpdates: true,
    milestones: true,
    showNamePublicly: false,
    showTotals: false,
  });

  // password change fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // donation summary (simple)
  const [summary, setSummary] = useState({
    totalDonated: 0,
    campaignsSupported: 0,
    lastDonation: null,
  });

  // Avatar upload state
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();

  // collapsible section state
  const [openSection, setOpenSection] = useState("personal"); // "personal" | "prefs" | "security" | "payments"

  // small helper to update form fields
  const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // load profile & summary on mount
  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        // Only one API call
        const meRes = await api.get("/api/donor/me");

        if (ignore) return;
        const me = meRes.data;
        setForm({
          name: me.name || "",
          email: me.email || "",
          phone: me.phone || "",
          country: me.address?.country || "",
          city: me.address?.city || "",
        });
        setSecondaryEmails(me.secondaryEmails || []);

        setPrefs({
          receipts: me?.preferences?.notifications?.receipts ?? true,
          ngoUpdates: me?.preferences?.notifications?.ngoUpdates ?? true,
          milestones: me?.preferences?.notifications?.milestones ?? true,
          showNamePublicly: me?.preferences?.privacy?.showNamePublicly ?? false,
          showTotals: me?.preferences?.privacy?.showTotals ?? false,
        });

        // If you want to show summary, use me fields or set dummy data
        setSummary({
          totalDonated: me.totalDonated || 0,
          campaignsSupported: me.campaignsSupported || 0,
          lastDonation: me.lastDonation || null,
        });
      } catch (err) {
        console.error("Profile load error:", err);
        setError("Failed to load profile");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [authUser, token]);

  // save profile (name, phone, address, secondary emails) — PUT /api/me
  const saveProfile = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        address: { country: form.country, city: form.city },
        secondaryEmails,
        preferences: {
          notifications: {
            receipts: prefs.receipts,
            ngoUpdates: prefs.ngoUpdates,
            milestones: prefs.milestones,
          },
          privacy: {
            showNamePublicly: prefs.showNamePublicly,
            showTotals: prefs.showTotals,
          },
        },
      };
      await api.put("/api/donor/me", payload);
      await api.put("/api/donor/me/password", { currentPassword, newPassword });
      setSuccess("Profile saved");
    } catch (err) {
      console.error("Save profile error:", err);
      setError(err.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  // Add a new secondary email
  const addSecondaryEmail = () => {
    if (!newEmail) return;
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
    if (!valid) {
      setError("Please enter a valid email address");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (secondaryEmails.includes(newEmail) || newEmail === form.email) {
      setError("Email already added");
      setTimeout(() => setError(""), 2500);
      return;
    }
    setSecondaryEmails((prev) => [...prev, newEmail]);
    setNewEmail("");
  };

  // Remove a secondary email
  const removeSecondaryEmail = (email) => {
    setSecondaryEmails((prev) => prev.filter((e) => e !== email));
  };

  // change password
  const changePassword = async (e) => {
    e.preventDefault();
    setPwdSaving(true);
    setError("");
    setSuccess("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill all password fields");
      setPwdSaving(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setPwdSaving(false);
      return;
    }
    try {
      await api.put("/donor/me/password", { currentPassword, newPassword });
      setSuccess("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Change password error:", err);
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setPwdSaving(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  // Avatar upload handler
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      // TODO: Upload to backend if needed
    }
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const toggleSection = (id) => setOpenSection((s) => (s === id ? null : id));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-green-700">Loading profile…</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-green-800 mb-6">My Profile</h1>

      {error && (
        <div className="mb-4 text-red-600 bg-red-50 p-3 rounded">{error}</div>
      )}
      {success && (
        <div className="mb-4 text-green-700 bg-green-50 p-3 rounded">
          {success}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left column: summary */}
        <div className="md:col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-col items-center gap-4">
            {/* Avatar with upload */}
            <div className="relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full border-2 border-green-200 object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-2xl border-2 border-green-200">
                  {(authUser?.name || "U")
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")}
                </div>
              )}
              {/* Camera icon button */}
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-1 shadow hover:bg-green-700 transition"
                title="Upload image"
              >
                <FaCamera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <button
              type="button"
              onClick={triggerFileInput}
              className="text-green-700 text-xs cursor-pointer hover:underline"
            >
              Upload image
            </button>

            <div className="text-center">
              <div className="font-semibold text-gray-900">
                {form.name || authUser?.name || "Unnamed"}
              </div>
              <div className="text-sm text-gray-500">
                {form.email || authUser?.email}
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-700 space-y-3">
            <div>
              <div className="text-xs text-gray-500">Total donated</div>
              <div className="font-medium">ETB {summary.totalDonated}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Campaigns supported</div>
              <div className="font-medium">{summary.campaignsSupported}</div>
            </div>
            {summary.lastDonation && (
              <div>
                <div className="text-xs text-gray-500">Last donation</div>
                <div className="font-medium">
                  {summary.lastDonation.amount} —{" "}
                  {new Date(summary.lastDonation.date).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: collapsible sections */}
        <div className="md:col-span-2 space-y-4">
          {/* Personal info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Personal information
              </h2>
              <button
                type="button"
                onClick={() => toggleSection("personal")}
                className="text-sm text-green-600"
              >
                {openSection === "personal" ? "Collapse" : "Open"}
              </button>
            </div>
            {openSection === "personal" && (
              <div className="mt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Full name
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-200"
                    />
                  </div>

                  {/* Email block */}
                  <div className="md:col-span-2 bg-gray-50 border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">
                          Email
                        </h3>
                        <div className="text-sm text-gray-700 mt-1">
                          {form.email}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Primary
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      {!showAddEmail ? (
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddEmail(true);
                            setTimeout(() => {
                              const el = document.getElementById(
                                "secondary-email-input"
                              );
                              el?.focus();
                            }, 50);
                          }}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                        >
                          + Add secondary email
                        </button>
                      ) : (
                        <div className="flex gap-2 mt-2">
                          <input
                            id="secondary-email-input"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="Enter secondary email"
                            className="w-full px-3 py-2 border rounded text-xs placeholder:text-xs"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => {
                              addSecondaryEmail();
                              setShowAddEmail(false);
                            }}
                            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddEmail(false);
                              setNewEmail("");
                            }}
                            className="px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            title="Cancel"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    {secondaryEmails.length > 0 && (
                      <ul className="space-y-2 mt-4">
                        {secondaryEmails.map((email) => (
                          <li
                            key={email}
                            className="flex items-center justify-between bg-green-50 border rounded-lg px-3 py-2"
                          >
                            <span className="text-sm text-gray-700 truncate">
                              {email}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeSecondaryEmail(email)}
                              className="text-red-600 hover:text-red-800 ml-2"
                              title="Remove"
                            >
                              <FaTrash />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      value={form.country}
                      onChange={(e) => updateField("country", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-200"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Preferences
                </h2>
                <p className="text-sm text-gray-500">
                  Notification & privacy settings
                </p>
              </div>
              <button
                onClick={() => toggleSection("prefs")}
                className="text-sm text-green-600 px-3 py-1"
              >
                {openSection === "prefs" ? "Collapse" : "Open"}
              </button>
            </div>
            {openSection === "prefs" && (
              <div className="p-6 border-t">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={prefs.receipts}
                        onChange={(e) =>
                          setPrefs((p) => ({
                            ...p,
                            receipts: e.target.checked,
                          }))
                        }
                        className="accent-green-600 focus:ring-green-500"
                      />
                      <span>Email me receipts</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={prefs.ngoUpdates}
                        onChange={(e) =>
                          setPrefs((p) => ({
                            ...p,
                            ngoUpdates: e.target.checked,
                          }))
                        }
                        className="accent-green-600 focus:ring-green-500"
                      />
                      <span>NGO updates</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={prefs.milestones}
                        onChange={(e) =>
                          setPrefs((p) => ({
                            ...p,
                            milestones: e.target.checked,
                          }))
                        }
                        className="accent-green-600 focus:ring-green-500"
                      />
                      <span>Campaign milestones</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={prefs.showNamePublicly}
                        onChange={(e) =>
                          setPrefs((p) => ({
                            ...p,
                            showNamePublicly: e.target.checked,
                          }))
                        }
                        className="accent-green-600 focus:ring-green-500"
                      />
                      <span>Show my name publicly</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={prefs.showTotals}
                        onChange={(e) =>
                          setPrefs((p) => ({
                            ...p,
                            showTotals: e.target.checked,
                          }))
                        }
                        className="accent-green-600 focus:ring-green-500"
                      />
                      <span>Show my total donations</span>
                    </label>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600"
                  >
                    {saving ? "Saving..." : "Save preferences"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Security
                </h2>
                <p className="text-sm text-gray-500">Change password, 2FA</p>
              </div>
              <button
                onClick={() => toggleSection("security")}
                className="text-sm text-green-600 px-3 py-1"
              >
                {openSection === "security" ? "Collapse" : "Open"}
              </button>
            </div>
            {openSection === "security" && (
              <div className="p-6 border-t">
                <form onSubmit={changePassword} className="max-w-md space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Current password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      New password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Confirm new password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-200"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={pwdSaving}
                      className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600"
                    >
                      {pwdSaving ? "Updating…" : "Change password"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Payments */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Payment methods
                </h2>
                <p className="text-sm text-gray-500">
                  Add or manage cards / TeleBirr / CBE
                </p>
              </div>
              <button
                onClick={() => toggleSection("payments")}
                className="text-sm text-green-600 px-3 py-1"
              >
                {openSection === "payments" ? "Collapse" : "Open"}
              </button>
            </div>
            {openSection === "payments" && (
              <div className="p-6 border-t">
                {typeof PaymentSettings !== "undefined" ? (
                  <PaymentSettings />
                ) : (
                  <div className="text-sm text-gray-500">
                    Manage payment methods here.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

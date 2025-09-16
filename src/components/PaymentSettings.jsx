// src/components/PaymentSettings.jsx
import React, { useState, useEffect, useContext } from "react";
import api from "../api/axios"; // <-- use your custom instance
import { AuthContext } from "../context/AuthContext";
import {
  FaPlus,
  FaTrash,
  FaCheckCircle,
  FaCreditCard,
  FaMobileAlt,
  FaRegEdit,
} from "react-icons/fa";

export default function PaymentSettings() {
  const { token } = useContext(AuthContext);

  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recurring, setRecurring] = useState({
    enabled: false,
    amount: "",
    frequency: "monthly",
    nextCharge: null,
  });
  const [notifications, setNotifications] = useState({
    receipts: true,
    reminders: true,
    expiringCards: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newType, setNewType] = useState("CBE");
  const [newLast4, setNewLast4] = useState("");

  // Fetch payment methods on mount
  useEffect(() => {
    async function fetchMethods() {
      setLoading(true);
      try {
        const res = await api.get("/api/payments/methods");
        setMethods(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Failed to load payment methods");
      } finally {
        setLoading(false);
      }
    }
    fetchMethods();
  }, [token]);

  // Add a payment method (with dropdown)
  const handleAddMethod = async (e) => {
    e.preventDefault();
    if (
      !newType ||
      !newLast4 ||
      newLast4.length !== 4 ||
      !/^\d+$/.test(newLast4)
    ) {
      setError("Please enter the last 4 digits of your card/number");
      setTimeout(() => setError(""), 2000);
      return;
    }
    try {
      const res = await api.post("/api/payments/methods", {
        type: newType,
        last4: newLast4,
      });
      setMethods((prev) => [...prev, res.data]);
      setSuccess("Payment method added");
      setShowAddForm(false);
      setNewType("CBE");
      setNewLast4("");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Failed to add payment method");
      setTimeout(() => setError(""), 2000);
    }
  };

  // Remove a payment method
  const removeMethod = async (id) => {
    if (!window.confirm("Remove this payment method?")) return;
    try {
      await api.delete(`/api/payments/methods/${id}`);
      setMethods((prev) => prev.filter((m) => m._id !== id));
      setSuccess("Payment method removed");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Failed to remove payment method");
      setTimeout(() => setError(""), 2000);
    }
  };

  // Set default payment method
  const setDefault = async (id) => {
    try {
      await api.patch(`/api/payments/methods/${id}/default`, {});
      setMethods((prev) => prev.map((m) => ({ ...m, default: m._id === id })));
      setSuccess("Default payment method updated");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Failed to set default method");
      setTimeout(() => setError(""), 2000);
    }
  };

  // Save recurring donation settings
  const saveRecurring = async (e) => {
    e.preventDefault();
    try {
      await api.post("/payments/recurring", recurring);
      setSuccess("Recurring donation settings saved");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Failed to save recurring settings");
      setTimeout(() => setError(""), 2000);
    }
  };

  // Save notification preferences
  const saveNotifications = async (e) => {
    e.preventDefault();
    try {
      await api.patch("/users/notifications", notifications);
      setSuccess("Notification preferences saved");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Failed to save notification preferences");
      setTimeout(() => setError(""), 2000);
    }
  };

  // Helper for icons
  const methodIcon = (type) => {
    if (
      type.toLowerCase().includes("visa") ||
      type.toLowerCase().includes("card")
    )
      return <FaCreditCard className="text-green-600 mr-2" />;
    if (type.toLowerCase().includes("telebirr"))
      return <FaMobileAlt className="text-green-600 mr-2" />;
    return <FaRegEdit className="text-green-600 mr-2" />;
  };

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {error && (
        <div className="mb-2 text-red-600 bg-red-50 p-2 rounded">{error}</div>
      )}
      {success && (
        <div className="mb-2 text-green-700 bg-green-50 p-2 rounded">
          {success}
        </div>
      )}

      {/* Saved Payment Methods */}
      <div className="bg-green-50 rounded-xl shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-base font-semibold text-green-800">
            Saved Payment Methods
          </h4>
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1 text-green-700 hover:underline text-sm"
            >
              <FaPlus /> Add Method
            </button>
          ) : (
            <form
              onSubmit={handleAddMethod}
              className="flex items-center gap-2"
            >
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="border border-green-400 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400 appearance-none"
              >
                <option value="CBE">CBE</option>
                <option value="TeleBirr">TeleBirr</option>
                <option value="PayPal">PayPal</option>
              </select>
              <input
                type="text"
                value={newLast4}
                onChange={(e) => setNewLast4(e.target.value)}
                placeholder="Last 4 digits or —"
                className="border rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                maxLength={4}
                style={{ width: 90 }}
              />
              <button
                type="submit"
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewType("CBE");
                  setNewLast4("");
                }}
                className="px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
        {loading ? (
          <div className="text-gray-500 text-sm">
            Loading payment methods...
          </div>
        ) : Array.isArray(methods) && methods.length === 0 ? (
          <div className="text-gray-500 text-sm">
            You haven’t added any payment methods yet.
          </div>
        ) : (
          <ul className="divide-y divide-green-100">
            {Array.isArray(methods) &&
              methods.map((m) => (
                <li
                  key={m._id}
                  className="py-2 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    {methodIcon(m.type)}
                    <span className="font-medium text-green-700">
                      {m.type} {m.last4 !== "—" ? `•••• ${m.last4}` : ""}
                    </span>
                    {m.default && (
                      <FaCheckCircle
                        className="ml-2 text-green-500"
                        title="Default method"
                      />
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!m.default && (
                      <button
                        onClick={() => setDefault(m._id)}
                        className="text-green-700 hover:underline text-xs"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => removeMethod(m._id)}
                      className="text-red-500 hover:underline text-xs flex items-center gap-1"
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Recurring Donations */}
      <div className="bg-green-50 rounded-xl shadow p-4">
        <h4 className="text-base font-semibold text-green-800 mb-2">
          Recurring Donations
        </h4>
        <form
          onSubmit={saveRecurring}
          className="grid md:grid-cols-3 gap-3 items-end"
        >
          <label className="block">
            <span className="block text-xs text-gray-700">Enable</span>
            <select
              value={recurring.enabled ? "on" : "off"}
              onChange={(e) =>
                setRecurring((r) => ({
                  ...r,
                  enabled: e.target.value === "on",
                }))
              }
              className="mt-1 w-full px-2 py-1 border rounded-lg focus:ring-2 focus:ring-green-400 text-sm"
            >
              <option value="off">Off</option>
              <option value="on">On</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-xs text-gray-700">Amount (ETB)</span>
            <input
              type="number"
              min="1"
              value={recurring.amount}
              onChange={(e) =>
                setRecurring((r) => ({ ...r, amount: e.target.value }))
              }
              className="mt-1 w-full px-2 py-1 border rounded-lg focus:ring-2 focus:ring-green-400 text-sm"
              placeholder="e.g., 200"
              disabled={!recurring.enabled}
            />
          </label>
          <label className="block">
            <span className="block text-xs text-gray-700">Frequency</span>
            <select
              value={recurring.frequency}
              onChange={(e) =>
                setRecurring((r) => ({ ...r, frequency: e.target.value }))
              }
              className="mt-1 w-full px-2 py-1 border rounded-lg focus:ring-2 focus:ring-green-400 text-sm"
              disabled={!recurring.enabled}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
          <div className="md:col-span-3">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={!recurring.enabled || !recurring.amount}
            >
              Save Recurring
            </button>
          </div>
        </form>

        {recurring.enabled && recurring.nextCharge && (
          <div className="mt-2 text-sm text-gray-600">
            Next charge: {new Date(recurring.nextCharge).toLocaleString()}
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-green-800">
            Transaction History
          </h4>
          <button className="px-3 py-1 border rounded hover:bg-green-50 text-green-700">
            Download Receipts (PDF)
          </button>
        </div>
        <div className="text-gray-500">
          {/* Replace with table/list mapped from API */}
          No transactions yet.
        </div>
      </div>

      {/* Notifications & Security */}
      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="text-lg font-semibold text-green-800 mb-3">
          Notifications & Security
        </h4>
        <form onSubmit={saveNotifications} className="space-y-3">
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-green-600 w-4 h-4"
                checked={notifications.receipts}
                onChange={(e) =>
                  setNotifications((n) => ({
                    ...n,
                    receipts: e.target.checked,
                  }))
                }
              />
              <span>Email me receipts</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-green-600 w-4 h-4"
                checked={notifications.reminders}
                onChange={(e) =>
                  setNotifications((n) => ({
                    ...n,
                    reminders: e.target.checked,
                  }))
                }
              />
              <span>Remind me before recurring charges</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-green-600 w-4 h-4"
                checked={notifications.expiringCards}
                onChange={(e) =>
                  setNotifications((n) => ({
                    ...n,
                    expiringCards: e.target.checked,
                  }))
                }
              />
              <span>Notify me about expiring cards</span>
            </label>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save Preferences
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {/* TODO: Add 2FA, recent sessions, and require password for large donations. */}
          </div>
        </form>
      </div>
    </div>
  );
}

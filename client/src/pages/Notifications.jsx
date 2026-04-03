import React, { useEffect, useState } from "react";

const defaultSettings = {
  enabled: false,
  breakfast: { enabled: true, time: "08:00" },
  lunch: { enabled: true, time: "12:30" },
  dinner: { enabled: true, time: "18:30" },
};

const Notifications = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://localhost:5000/notifications", {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok && data) {
          setSettings({ ...defaultSettings, ...data });
        }
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };

    fetchSettings();
  }, []);

  const updateMeal = (mealKey, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [mealKey]: {
        ...prev[mealKey],
        [field]: value,
      },
    }));
  };

  const saveSettings = async () => {
    setSaving(true);

    try {
      const res = await fetch("http://localhost:5000/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to save settings");
        return;
      }

      alert("Notification settings saved");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving");
    } finally {
      setSaving(false);
    }
  };

  const sendTestEmail = async () => {
    try {
      const res = await fetch("http://localhost:5000/notifications/test", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to send test email");
        return;
      }

      alert("Test email sent successfully");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while sending the test email");
    }
  };

  return (
    <div className="px-10 min-h-screen w-full bg-gradient-to-b from-green-100 to-gray-100 pb-20">
      <div className="pt-30">
        <h1 className="text-gray-900 text-4xl font-bold">Notifications</h1>
        <p className="text-gray-600 mt-2">Manage your meal reminder schedule</p>
      </div>

      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, enabled: e.target.checked }))
              }
            />
            <span className="text-gray-900 font-semibold">
              Enable email meal reminders
            </span>
          </label>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-gray-700">
            Meal reminders will be sent to the email address on your account.
          </p>
        </div>

        {["breakfast", "lunch", "dinner"].map((meal) => (
          <div key={meal} className="border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                {meal}
              </h2>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings[meal].enabled}
                  onChange={(e) => updateMeal(meal, "enabled", e.target.checked)}
                />
                <span className="text-sm text-gray-700">Enabled</span>
              </label>
            </div>

            <input
              type="time"
              value={settings[meal].time}
              onChange={(e) => updateMeal(meal, "time", e.target.value)}
              className="h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900"
            />
          </div>
        ))}

        <div className="flex gap-4">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex-1 h-12 bg-green-500 hover:bg-green-600 text-white rounded-md font-semibold"
          >
            {saving ? "Saving..." : "Save notification settings"}
          </button>

        
        </div>
      </div>
    </div>
  );
};

export default Notifications;
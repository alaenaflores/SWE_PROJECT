const express = require("express");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not logged in" });
  }
  next();
};

const defaultNotificationSettings = {
  enabled: false,
  breakfast: { enabled: true, time: "08:00" },
  lunch: { enabled: true, time: "12:30" },
  dinner: { enabled: true, time: "18:30" },
};

router.get("/", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select("notificationSettings");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.notificationSettings || defaultNotificationSettings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notification settings" });
  }
});

router.put("/", requireAuth, async (req, res) => {
  try {
    const { enabled, breakfast, lunch, dinner } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.session.userId,
      {
        notificationSettings: {
          enabled: !!enabled,
          breakfast: breakfast || { enabled: true, time: "08:00" },
          lunch: lunch || { enabled: true, time: "12:30" },
          dinner: dinner || { enabled: true, time: "18:30" },
        },
      },
      { new: true }
    ).select("notificationSettings");

    res.json(updatedUser.notificationSettings);
  } catch (error) {
    res.status(500).json({ error: "Failed to save notification settings" });
  }
});

router.post("/test", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select("email name");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.email) {
      return res.status(400).json({ error: "No email found for this user" });
    }

    const result = await sendEmail(
      user.email,
      "Nutriventure Test Reminder",
      `Hi ${user.name || "there"}, your meal reminder system is working.`
    );

    res.json({
      message: "Test email sent",
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("Email test error:", error);
    res.status(500).json({
      error: error.message || "Failed to send email",
    });
  }
});

module.exports = router;
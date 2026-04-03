const cron = require("node-cron");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

function startReminderJob() {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const currentTime =
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0");

      console.log("checking reminders for time:", currentTime);

      const users = await User.find({
        "notificationSettings.enabled": true,
      });

      for (const user of users) {
        const settings = user.notificationSettings;

        if (!settings) continue;
        if (!user.email) continue;

        const meals = ["breakfast", "lunch", "dinner"];

        for (const meal of meals) {
          const mealSettings = settings[meal];

          if (!mealSettings?.enabled) continue;

          if (mealSettings.time === currentTime) {
            console.log(`sending ${meal} reminder to ${user.email}`);

            const result = await sendEmail(
              user.email,
              `Nutriventure ${meal.charAt(0).toUpperCase() + meal.slice(1)} Reminder`,
              `Hey ${user.name || "there"}, don't forget to log your ${meal} and keep your streak going!`
            );

            console.log("email sent successfully:", result.messageId);
          }
        }
      }
    } catch (error) {
      console.error("Reminder job error:", error.message);
    }
  });
}

module.exports = startReminderJob;
import cron from "node-cron";
import axios from "axios";
import dotenv from "dotenv";
import { io } from "../server.js"; // Import WebSocket instance

dotenv.config();

const API_KEY = process.env.LIGHTNING_PROXIES_API_KEY;
const BASE_URL = "https://resell.lightningproxies.net/api";

let latestCronData = null; // Store the latest data

// Function to fetch bandwidth and store data
const checkAndLogBandwidth = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/plan/1-20`, {
      headers: { "x-api-key": API_KEY },
    });

    latestCronData = {
      plans: response.data,
      timestamp: new Date().toISOString(),
    };

    console.log("✅ [Cron] Bandwidth data updated:", latestCronData);

    // Emit data to all connected WebSocket clients
    io.emit("data-update", latestCronData);
  } catch (error) {
    console.error(
      "❌ [Cron Error] Failed to fetch bandwidth:",
      error.response?.data || error.message
    );
  }
};

// Schedule the cron job to run every 30 seconds
cron.schedule("*/30 * * * * *", async () => {
  console.log("🔄 Running scheduled bandwidth check...");
  await checkAndLogBandwidth();
});

// Export latest data for API access
export { latestCronData, checkAndLogBandwidth };

import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.LIGHTNING_PROXIES_API_KEY;
const BASE_URL = 'https://resell.lightningproxies.net/api';

// Function to fetch bandwidth and send data
const checkAndLogBandwidth = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/user-info`, {
            headers: { 'x-api-key': API_KEY }
        });

        const remainingBytes = response.data.remaining_bytes;
        const remainingGB = (remainingBytes / (1024 * 1024 * 1024)).toFixed(2);

        console.log(`✅ [Bandwidth Check] Remaining Bandwidth: ${remainingGB} GB at ${new Date().toLocaleString()}`);

        // Example: Send data to a database, webhook, or log it somewhere
        // await axios.post("YOUR_WEBHOOK_OR_DATABASE_API", { remainingGB });

    } catch (error) {
        console.error("❌ [Cron Error] Failed to fetch bandwidth:", error.response?.data || error.message);
    }
};

// Schedule the cron job to run every 30 minutes
cron.schedule('*/30 * * * *', async () => {
    console.log("🔄 Running scheduled bandwidth check...");
    await checkAndLogBandwidth();
});

export default checkAndLogBandwidth;

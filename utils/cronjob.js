import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.LIGHTNING_PROXIES_API_KEY;
const BASE_URL = 'https://resell.lightningproxies.net/api';

let latestCronData = null; // ✅ Global variable to store the latest data

// Function to fetch bandwidth and store data
const checkAndLogBandwidth = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/plan/1-20`, {
            headers: { 'x-api-key': API_KEY }
        });
        latestCronData = {
            plans: response.data, 
            timestamp: new Date().toISOString()
        };

        
        
    } catch (error) {
        console.error("❌ [Cron Error] Failed to fetch bandwidth:", error.response?.data || error.message);
    }
};

// Schedule the cron job to run every 30 seconds
cron.schedule('*/30 * * * * *', async () => {
    console.log("🔄 Running scheduled bandwidth check...");
    await checkAndLogBandwidth();
});

// ✅ Export the latestCronData so it can be used in other files
export { latestCronData, checkAndLogBandwidth };

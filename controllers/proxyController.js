import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.LIGHTNING_PROXIES_API_KEY;
const BASE_URL = 'https://resell.lightningproxies.net/api';

//Create a New User
export const createUser = async (req, res) => {
    try {
        const { username, email } = req.body;
        const response = await axios.post(`${BASE_URL}/create-user`, 
            { username, email },
            { headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' } }
        );
        res.json({ success: true, user: response.data });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.response?.data || error.message });
    }
};

//Create a Proxy User for a Given User

export const createProxyUser = async (req, res) => {
    try {
        const { userId, country } = req.body;
        const response = await axios.post(`${BASE_URL}/create-proxy-user`, 
            { userId, country },
            { headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' } }
        );
        res.json({ success: true, proxyUser: response.data });
    } catch (error) {
        res.status(500).json({ message: 'Error creating proxy user', error: error.response?.data || error.message });
    }
};





//Update User Credentials
export const updateUser = async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        const { planType, username, password, proxyType } = req.body;

        if (!subscriptionId  || !username || !password) {
            console.log(subscriptionId,username,password);
            return res.status(400).json({ message: "Missing required fields." });
        }
        console.log(subscriptionId,username,password);
        const response = await axios.post(
            `${BASE_URL}/credentials-change/${subscriptionId}`,
            { planType, username, password, proxyType },
            { headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' } }
        );

        res.json({ success: true, message: "User updated successfully", data: response.data });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating user', 
            error: error.response?.data || error.message 
        });
    }
};


// Get Residential Plan
export const getResidentialPlan = async (req, res) => {
    try {
        console.log(req.body,"body");
        const { bandwidth } = req.body;
        console.log(bandwidth,typeof(bandwidth),"bandwidth")
        const response = await axios.post(`${BASE_URL}/getplan/residential`, 
            { bandwidth },
            { headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' } }
        );
        res.json({ success: true, planID: response.data.PlanID });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching residential plan', error: error.response?.data || error.message });
    }
};

//Create Account with PlanId
export const createAccountWithPlan = async (req, res) => {
    try {
        const { planId } = req.params;
        const response = await axios.get(`${BASE_URL}/plan/residential/read/${planId}`, {
            headers: { 'x-api-key': API_KEY }
        });
        res.json({ success: true, accountDetails: response.data });
    } catch (error) {
        res.status(500).json({ message: 'Error creating account with plan', error: error.response?.data || error.message });
    }
};

//Get list of plans
export const getPlanList = async (req, res) => {
    console.log("entered ")
    try {
        const response = await axios.get(`${BASE_URL}/plan/1-5`, {
            headers: { 'x-api-key': API_KEY }
        });
        res.json({ success: true, plans: response.data });
    } catch (error) {
        console.log("error",error.message)
        res.status(500).json({ message: 'Error fetching plans', error: error.response?.data || error.message });
    }
};

//Get List of Countries
export const getCountryList = async (req, res) => {
    try {
        const response = await axios.post(`${BASE_URL}/getlist/country_list`, {}, {
            headers: { 'x-api-key': API_KEY }
        });
        res.json({ success: true, countries: response.data.country_list });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching country list', error: error.response?.data || error.message });
    }
};

//Get list of states
export const getStateList = async (req, res) => {
    try {
        const { country_code } = req.body;
        if (!country_code) return res.status(400).json({ message: "Country code is required" });

        const response = await axios.post(`${BASE_URL}/getlist/state_list`, { country_code }, {
            headers: { 'x-api-key': API_KEY }
        });

        res.json({ success: true, states: response.data.state_list });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching state list', error: error.response?.data || error.message });
    }
};

//Get List of cities
export const getCityList = async (req, res) => {
    try {
        const { country_code, state } = req.body;
        if (!country_code || !state) return res.status(400).json({ message: "Country code and state are required" });

        const response = await axios.post(`${BASE_URL}/getlist/city_list`, { country_code, state }, {
            headers: { 'x-api-key': API_KEY }
        });

        res.json({ success: true, cities: response.data.city_list });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching city list', error: error.response?.data || error.message });
    }
};


//Purchase Residential Proxy Plan
export const purchaseResidentialPlan = async (req, res) => {
    try {
        const { planId, quantity, userId } = req.body;
        const response = await axios.post(`${BASE_URL}/purchase`,
            { planId, quantity, userId },
            { headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' } }
        );
        res.json({ success: true, message: "Residential plan purchased successfully", data: response.data });
    } catch (error) {
        res.status(500).json({ message: 'Error purchasing residential plan', error: error.response?.data || error.message });
    }
};

//Modify Gigabytes Add/Remove
export const modifyGigabytes = async (req, res) => {
    try {
        const { action, planId, gigabytes } = req.body;
        if (!['add', 'del'].includes(action)) {
            return res.status(400).json({ message: "Invalid action. Use 'add' or 'del'." });
        }
        const response = await axios.post(`${BASE_URL}/${action}/${planId}/${gigabytes}`, 
            {},
            { headers: { 'x-api-key': API_KEY } }
        );
        res.json({ success: true, data: response.data });
    } catch (error) {
        res.status(500).json({ message: 'Error modifying gigabytes', error: error.response?.data || error.message });
    }
};


// Check Remaining Bandwidth

export const checkBandwidth = async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/user-info`, {
            headers: { 'x-api-key': API_KEY }
        });
        res.json({ success: true, bandwidthGB: (response.data.remaining_bytes / (1024 * 1024 * 1024)).toFixed(2) });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bandwidth', error: error.response?.data || error.message });
    }
};

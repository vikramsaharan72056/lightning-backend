import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import cors from 'cors';
import proxyRoutes from './routes/proxyRoutes.js';
import connectDB from './config/db.js'
import {checkAndLogBandwidth}  from './utils/cronjob.js';


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/proxies', proxyRoutes);
app.get("/",(req,res) =>{
    res.json({message:"This is testing message"})
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

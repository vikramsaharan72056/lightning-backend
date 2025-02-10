import express from 'express';
import { 
    createUser, 
    createProxyUser, 
    updateUser,
    getResidentialPlan, 
    createAccountWithPlan, 
    getPlanList, 
    getCountryList, 
    purchaseResidentialPlan, 
    modifyGigabytes, 
    checkBandwidth,
    getStateList,
    getCityList 
} from '../controllers/proxyController.js';

const router = express.Router();

router.post('/create-user', createUser);
router.post('/create-proxy-user', createProxyUser);
router.post('/update-user/:subscriptionId', updateUser);

router.post('/get-residential-plan', getResidentialPlan);
router.get('/create-account/:planId', createAccountWithPlan);
router.get('/get-plan-list', getPlanList);
router.post('/get-country-list', getCountryList);
router.post('/get-state-list', getStateList);
router.post('/get-city-list', getCityList);
router.post('/purchase-residential-plan', purchaseResidentialPlan);
router.post('/modify-gigabytes', modifyGigabytes);
router.get('/check-bandwidth', checkBandwidth);

export default router;

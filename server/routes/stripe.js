import express from "express";
import { requireSignin } from "../middleware/index";
import {createConnectAccount,getAccountStatus,getAccountBalance,payoutSetting} from '../controllers/stripe';

const router = express.Router();

router.post("/create-connect-account",requireSignin, createConnectAccount);
router.post("/get-account-status",requireSignin, getAccountStatus);
router.post("/get-account-balance",requireSignin, getAccountBalance);
router.post("/payout-setting",requireSignin, payoutSetting);
        
module.exports = router;

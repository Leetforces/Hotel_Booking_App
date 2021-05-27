import express from "express";
import { requireSignin } from "../middleware/index";
import {
  createConnectAccount,
  getAccountStatus,
  getAccountBalance,
  payoutSetting,
  stripeSessionId,
  stripeSuccess,
  makePayment,
  activateAccount,
} from "../controllers/stripe";

const router = express.Router();

router.post("/create-connect-account", requireSignin, createConnectAccount);
router.post("/get-account-status", requireSignin, getAccountStatus);
router.post("/get-account-balance", requireSignin, getAccountBalance);
router.post("/payout-setting", requireSignin, payoutSetting);
router.post("/stripe-session-id", requireSignin, stripeSessionId);
router.post("/stripe-success",requireSignin,stripeSuccess);
router.post("/payment",requireSignin,makePayment);
router.post("/payment",requireSignin,makePayment);
router.post("/activate-account",requireSignin,activateAccount);
module.exports = router;

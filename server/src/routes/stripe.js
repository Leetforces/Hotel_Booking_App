//create-connect-account
import express from 'express';
const router = express.Router();
//importing controllers
import {createConnectAccount} from '../controllers/stripe';
import {requireSignin} from "../middleware/index";


router.post('/create-connect-account',requireSignin,createConnectAccount);


module.exports= router;
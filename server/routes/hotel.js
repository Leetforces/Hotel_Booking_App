import express from "express";
import { requireSignin } from "../middleware/index";
import {create,hotels} from '../controllers/hotel'
import  formidable from 'express-formidable'
const router = express.Router();

router.post("/create-hotel",requireSignin,formidable(),create);
router.get('/hotels',requireSignin,hotels);
module.exports = router;

import express from "express";

const router = express.Router();

import { register, login,resetPassword,updatePassword } from "../controllers/auth";

router.post("/register", register);
router.post("/login", login);
router.post('/resetPassword',resetPassword);
router.post('/updatePassword',updatePassword);

module.exports = router;
 
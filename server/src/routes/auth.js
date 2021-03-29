import express from 'express';
const router = express.Router();
//importing controllers
import {register,login} from '../controllers/auth';


router.post('/register',register);
router.post('/login',login);


module.exports= router;
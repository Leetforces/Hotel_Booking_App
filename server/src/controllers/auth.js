import User from '../models/user';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name) return res.status(400).send("Name is Required");
    if (!password || password.length < 6) return res.status(400).send("Password is required with length 6 or more.");

    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send("Email is Taken.");

    try {
        const user = new User(req.body);
        await user.save();
        console.log("USER CREATED");
        return res.json({ OK: true })

    } catch (error) {
        console.log(error);
        return res.status(400).send("Error. Try Again.");
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email }).exec();
        if (!user) return res.status(400).send("Invalid Email");
        user.comparePassword(password, (err, match) => {
            console.log("Match:", match, err);
            if ((!match) || err) {
                console.log("Hello");
                return res.status(400).send("Invalid Details.");
            }

            // GENERATE A TOKEN THEN SEND AS RESPOSNSE TO CLIENT
            let token=jwt.sign({_id: user._id},process.env.JWT_SECRET,{
                expiresIn: '1d',
            });

            return res.json({token,user:{
                _id:user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,

            }}); 
            // console.log("LOGIN SUCCESSFUL:)");
            // return res.status(200).send("Login Successful:)");
        })


    } catch (error) {
        console.log(error);
        return res.status(400).send("Signin failed.");
    }
}
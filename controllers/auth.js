import User from "../models/user";
import jwt from "jsonwebtoken";

import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";

import crypto from "crypto";

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_EMAIL_API_KEY,
    },
  })
);

export const register = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;

    // validation
    if (!name) return res.status(400).send("Name is Required");
    if (!email) return res.status(400).send("Email is Required");
    if (!password || password.length < 6)
      return res
        .status(400)
        .send("Password is Required and should be minimum 6 characters long");
    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send("Email is Taken");

    // register user
    const user = new User(req.body);

    await user.save();
    console.log("User Created", user);
    return res.json({ ok: true });
  } catch {
    console.log("User Creation Failed ");
    return res.status(400).send("Error, Please try again");
  }
};

export const login = async (req, res) => {
  // using the data in req, find the user in the DB
  // if the user with the email already exists
  try {
    // console.log(req.body);
    const { email, password } = req.body;
    // check if user with that email exists in DB
    let user = await User.findOne({ email }).exec();
    // console.log("User Exists:", user);
    // if user not found
    if (!user) return res.status(400).send("User with that email not found");
    // comapre password
    user.comparePassword(password, (err, match) => {
      console.log("compare Password in Login Err:", err);
      // if password doesn't match or returns an error
      if (!match || err) return res.status(400).send("Wrong Password");
      // Generate a Token & send as response to client
      let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          stripe_account_id: user.stripe_account_id,
          stripe_seller: user.stripe_seller,
          stripeSession: user.stripeSession,
        },
      });
    });
  } catch (err) {
    // if error, send the error message
    console.log("Login ERROR:", err);
    res.status(400).send("Sign in Failed");
  }
};

export const resetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const buffer = await crypto.randomBytes(32);
    const token = buffer.toString("hex");

    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(400).send("USER NOT FOUND.");
    }

    console.log("UESR IN RESET PASSWORD:", user);

    user.resetToken = token;
    user.expireToken = Date.now() + 3600000;

    console.log("User Token assigned: ", user.resetToken);

    console.log("RESET TOKEN: ", token);
    console.log("Expiry Token TOKEN: ", user.expireToken);
    const result = await user.save();
    console.log("result after Update user=======>", result);
    const link = process.env.LINK_FOR_CHANGE_PASSWORD_PAGE;
    transporter.sendMail({
      to: user.email,
      from: process.env.MY_EMAIL,
      subject: "password reset",
      html: `
          <p>You requested for password Reset.</p>
        <h3>Click in this <a href="${link}/${token}">Link</a> to reset the password.</h3>
        `,
    });

    res.json({
      data: "Check Your Email to reset your Password",
    });
  } catch (err) {
    console.log("Error on sending reset Link====>", err);
    res.json({
      error: err,
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    console.log("Token:", sentToken);
    console.log("password", newPassword);
    const user = await User.findOne({
      resetToken: sentToken,
      expireToken: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(422)
        .send(
          "Session Expire or Invalid Token. Please Try to reset the Password Again."
        );
    } else {
      user.password = newPassword;
      user.resetToken = undefined;
      user.expireToken = undefined;
      await user.save();

      res.send("Password Updated Successfully 👍");
    }
  } catch (err) {
    console.log("Error On Updating the Password :", err);
    res.send({ error: err });
  }
};

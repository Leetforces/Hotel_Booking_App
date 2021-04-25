import User from "../models/user";
import jwt from "jsonwebtoken";

import Stripe from 'stripe';
import queryString from 'query-string';
const stripe = Stripe(process.env.STRIPE_SECRET);

export const createConnectAccount = async (req, res) => {

    //Find user from db
    const user = await User.findById(req.user._id).exec();

    //if user don't have stripe_account_id
    if (!user.stripe_account_id) {
        const account = await stripe.accounts.create({
            type: "express",
            country: "US",
        
        })
        user.stripe_account_id = account.id;
        user.save();
    }

    console.log("USER ========>", user);
    //create login link based on account id (for frontend to complete onboarding)
    let accountLink = await stripe.accountLinks.create({
        account: user.stripe_account_id,
        refresh_url: process.env.STRIPE_REDIRECT_URL,
        return_url: process.env.STRIPE_REDIRECT_URL,
        type: 'account_onboarding',
    });

    // prefill any info such as email
    accountLink = Object.assign(accountLink, {
        "stripe_user[email]": user.email || undefined,
    })
    console.log("Account Link", accountLink);
    let link = `${accountLink.url}?${queryString.stringify(accountLink)}`
    console.log("Link send to Frontend=====>", link);
    return res.send(link);
}

const updateDelayDays = async (accountId) => {
    try {
        const account = await stripe.accounts.update(accountId, {
            settings: {
                payouts: {
                    schedule: {
                        delay_days: 7,
                    },
                },
            },
        });
        console.log("=========>", account);
        return account;
    } catch (err) {
        console.log("Error in updating delay date", err);
        return err;
    }

}
export const getAccountStatus = async (req, res) => {
    //Find user from db
    const user = await User.findById(req.user._id).exec();
    const account = await stripe.accounts.retrieve(user.stripe_account_id);

    //update delays days 2(default) to 7days
    //    const updateAccount= await updateDelayDays(account.id);
    //    console.log("Updated Account",updateAccount);

    //update  in database
    const upadatedUser = await User.findByIdAndUpdate(user._id, {
        stripe_seller: account,
    }, { new: true }).select("-password").exec();


    console.log("Updated user======> ", upadatedUser);
    res.json(upadatedUser);

}

export const getAccountBalance = async (req, res) => {
    const user = await User.findById(req.user._id).exec();

    try {
        const balance = await stripe.balance.retrieve({
            stripeAccount: user.stripe_account_id,
        })
        console.log("Balance=======>",balance);
        return res.json(balance);
    } catch (err) {
        console.log(err);
        return err;
    }
}

export const payoutSetting =async(req,res)=>{
   try{
       const user= await User.findById(req.user._id).exec();
       const loginLink = await stripe.accounts.createLoginLink(user.stripe_account_id,{
        redirect_url: process.env.STRIPE_SETTING_REDIRECT_URL,
    });
    console.log("Login Link For Payout Setting =====>",loginLink);
    return res.json(loginLink);
   }catch(err){
       console.log("Stripe Payout Setting Error====>",err);
   }
}
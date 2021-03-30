import User from '../models/user';
import Stripe from 'stripe';
import queryString from 'query-string';
const stripe = Stripe(process.env.STRYPE_SECRET);

export const createConnectAccount = async (req, res) => {
    console.log(req.user);
    // console.log(stripe);
    //find user in the database
    const user = await User.findById(req.user._id).exec();
    if (!user.stripe_account_id) {
        // if user don't have stripe_Account_id yet, create now
        const account = await stripe.accounts.create({
            type: "express",
        });
        console.log("Account : ", account);
        user.stripe_account_id=account.id;
        res.send(`Created Stripe_Id: ${user.stripe_account_id}`);
        user.save();
    }else{
        console.log("Already Created");
        res.send("Stripe Account Already Exist.");

    }
    
    // create login link based on account id (for frontend to complete onboarding)
    let accountLink=await stripe.accountLinks.create({
        account: user.stripe_account_id,
        refresh_url:process.env.STRIPE_REDIRECT_URL,
        return_url:process.env.STRIPE_REDIRECT_URL,
        type:'account_onboarding',
    });


    accountLink=Object.assign(accountLink,{
        "stripe_user[email]":user.email || undefined,
    });
    console.log(accountLink);
    res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`)
};